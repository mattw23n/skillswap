import datetime
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import sqlite3

app = FastAPI()

# Initialize SQLite database
conn = sqlite3.connect("app.db", check_same_thread=False)
cursor = conn.cursor()

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    location TEXT,
    language TEXT,
    credits INTEGER DEFAULT 60,
    availability TEXT,
    interests TEXT
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    online BOOLEAN NOT NULL,
    experience_level TEXT,
    tags TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    student_ids TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    status_updated_at TEXT,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    from_user INTEGER,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (from_user) REFERENCES users(id)
);
''')

conn.commit()

# Models
class Skill(BaseModel):
    name: str
    category: str
    description: str
    price: int
    online: bool
    experience_level: str
    tags: Optional[List[str]] = []

class Availability(BaseModel):
    days: List[str]
    time_slots: List[dict]  # E.g., [{"start_time": "09:00", "end_time": "11:00"}]

class User(BaseModel):
    name: str
    email: str
    location: str
    language: str
    credits: int = 60
    availability: Optional[Availability] = None
    interests: List[str] = []

class Session(BaseModel):
    skill_id: int
    teacher_id: int
    student_ids: List[int]
    date: str
    time: str

class Review(BaseModel):
    session_id: int
    teacher_id: int
    rating: int
    comment: str
    from_user: int

# Endpoints

# 1. Register User
@app.post("/users/register")
def register_user(user: User):
    try:
        availability = json.dumps(user.availability.dict()) if user.availability else None
        interests = ",".join(user.interests)
        cursor.execute('''
            INSERT INTO users (name, email, location, language, credits, availability, interests)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user.name, user.email, user.location, user.language, user.credits, availability, interests))
        conn.commit()
        user_id = cursor.lastrowid
        return {"id": user_id, "message": "User successfully registered."}
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail="Email already exists.")

# 2. Get User Profile
@app.get("/users/{user_id}")
def get_user_profile(user_id: int):
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found.")

    cursor.execute('SELECT * FROM skills WHERE user_id = ?', (user_id,))
    skill_rows = cursor.fetchall()

    skills = [
        {
            "id": row[0],
            "user_id": row[1],
            "name": row[2],
            "category": row[3],
            "description": row[4],
            "price": row[5],
            "online": bool(row[6]),
            "experience_level": row[7],
            "tags": row[8].split(',') if row[8] else []
        }
        for row in skill_rows
    ]

    return {
        "id": user_row[0],
        "name": user_row[1],
        "email": user_row[2],
        "location": user_row[3],
        "language": user_row[4],
        "credits": user_row[5],
        "availability": json.loads(user_row[6]) if user_row[6] else None,
        "interests": user_row[7].split(',') if user_row[7] else [],
        "skills": skills
    }

# 3. Add Skill to Teach
@app.post("/users/{user_id}/skills")
def add_skill(user_id: int, skill: Skill):
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="User not found.")
    tags = ",".join(skill.tags) if skill.tags else None
    cursor.execute('''
        INSERT INTO skills (user_id, name, category, description, price, online, experience_level, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, skill.name, skill.category, skill.description, skill.price, skill.online, skill.experience_level, tags))
    conn.commit()
    skill_id = cursor.lastrowid
    return {"message": "Skill added successfully.", "skill_id": skill_id}

# 4. Search Skills
@app.get("/skills/search")
def search_skills(category: Optional[str] = None, tags: Optional[List[str]] = None,
                  location: Optional[str] = None, max_price: Optional[int] = None):
    query = '''
        SELECT skills.id, skills.user_id, skills.name, skills.category, 
               skills.description, skills.price, skills.online, 
               skills.experience_level, skills.tags, users.location
        FROM skills
        INNER JOIN users ON skills.user_id = users.id
        WHERE 1=1
    '''
    params = []

    if category:
        query += ' AND skills.category = ?'
        params.append(category)
    if tags:
        tag_filter = "|".join(tags)
        query += ' AND skills.tags LIKE ?'
        params.append(f'%{tag_filter}%')
    if location:
        query += ' AND users.location LIKE ?'
        params.append(f'%{location}%')
    if max_price:
        query += ' AND skills.price <= ?'
        params.append(max_price)

    cursor.execute(query, params)
    rows = cursor.fetchall()

    return [
        {
            "id": row[0],
            "user_id": row[1],
            "name": row[2],
            "category": row[3],
            "description": row[4],
            "price": row[5],
            "online": bool(row[6]),
            "experience_level": row[7],
            "tags": row[8].split(',') if row[8] else [],
            "location": row[9]
        }
        for row in rows
    ]

# 5. Register for a Session
@app.post("/sessions/register")
def register_session(session: Session):
    # Verify teacher
    cursor.execute('SELECT * FROM users WHERE id = ?', (session.teacher_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Teacher not found.")

    # Verify students and ensure enough credits
    total_credits_on_hold = 0
    for student_id in session.student_ids:
        cursor.execute('SELECT * FROM users WHERE id = ?', (student_id,))
        student_row = cursor.fetchone()
        if not student_row:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found.")
        cursor.execute('SELECT price FROM skills WHERE id = ?', (session.skill_id,))
        skill_row = cursor.fetchone()
        if not skill_row:
            raise HTTPException(status_code=404, detail="Skill not found.")
        skill_price = skill_row[0]
        if student_row[5] < skill_price:  # Check if student has enough credits
            raise HTTPException(
                status_code=400, 
                detail=f"Student with ID {student_id} does not have enough credits."
            )
        total_credits_on_hold += skill_price

    # Deduct credits from students
    for student_id in session.student_ids:
        cursor.execute('SELECT price FROM skills WHERE id = ?', (session.skill_id,))
        skill_price = cursor.fetchone()[0]
        cursor.execute('UPDATE users SET credits = credits - ? WHERE id = ?', (skill_price, student_id))

    # Register session
    student_ids_str = ",".join(map(str, session.student_ids))
    cursor.execute('''
        INSERT INTO sessions (skill_id, teacher_id, student_ids, date, time, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (session.skill_id, session.teacher_id, student_ids_str, session.date, session.time, "pending"))
    conn.commit()
    session_id = cursor.lastrowid

    return {
        "message": "Session registered successfully.",
        "session_id": session_id,
        "credits_on_hold": total_credits_on_hold
    }

# 5. Register for a Session
@app.post("/sessions/register")
def register_session(session: Session):
    cursor.execute('SELECT * FROM users WHERE id = ?', (session.teacher_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Teacher not found.")

    for student_id in session.student_ids:
        cursor.execute('SELECT * FROM users WHERE id = ?', (student_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found.")

    student_ids_str = ",".join(map(str, session.student_ids))
    cursor.execute('''
        INSERT INTO sessions (skill_id, teacher_id, student_ids, date, time, duration, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (session.skill_id, session.teacher_id, student_ids_str, session.date, session.time, session.duration, "pending"))
    conn.commit()
    session_id = cursor.lastrowid
    return {"message": "Session registered successfully.", "session_id": session_id}

# 6. Get Sessions for a User
@app.get("/users/{user_id}/sessions")
def get_user_sessions(user_id: int):
    cursor.execute('SELECT * FROM sessions WHERE teacher_id = ? OR student_ids LIKE ?', (user_id, f'%{user_id}%'))
    rows = cursor.fetchall()

    sessions = [
        {
            "id": row[0],
            "skill_id": row[1],
            "teacher_id": row[2],
            "student_ids": row[3].split(','),
            "date": row[4],
            "time": row[5],
            "status": row[6],
            "status_updated_at": row[7]
        }
        for row in rows
    ]

    return {"user_id": user_id, "sessions": sessions}

# 7. Update Session Status
@app.patch("/sessions/{session_id}/status")
def update_session_status(session_id: int, status: str):
    # Verify if the session exists
    cursor.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
    session_row = cursor.fetchone()
    if not session_row:
        raise HTTPException(status_code=404, detail="Session not found.")

    # Update session status and timestamp
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('UPDATE sessions SET status = ?, status_updated_at = ? WHERE id = ?', (status, timestamp, session_id))
    conn.commit()

    # If status is "completed", handle credit transfer
    if status == "completed":
        teacher_id = session_row[2]
        student_ids = session_row[3].split(",")
        skill_id = session_row[1]

        # Fetch the skill price
        cursor.execute('SELECT price FROM skills WHERE id = ?', (skill_id,))
        skill_row = cursor.fetchone()
        if not skill_row:
            raise HTTPException(status_code=404, detail="Skill not found.")
        skill_price = skill_row[0]

        # Calculate total credits and update teacher's credits
        total_credits = skill_price * len(student_ids)
        cursor.execute('UPDATE users SET credits = credits + ? WHERE id = ?', (total_credits, teacher_id))
        conn.commit()

    return {"message": f"Session status updated to '{status}' successfully."}

# 8. Review a Session
@app.post("/sessions/{session_id}/review")
def review_session(session_id: int, review: Review):
    cursor.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
    session_row = cursor.fetchone()
    if not session_row:
        raise HTTPException(status_code=404, detail="Session not found.")

    cursor.execute('''
        INSERT INTO reviews (session_id, teacher_id, rating, comment, from_user)
        VALUES (?, ?, ?, ?, ?)
    ''', (session_id, review.teacher_id, review.rating, review.comment, review.from_user))
    conn.commit()
    review_id = cursor.lastrowid
    return {"message": "Review submitted successfully.", "review_id": review_id}

#9 Get reviews based on id
@app.get("/users/{teacher_id}/reviews")
def get_teacher_reviews(teacher_id: int):
    # Fetch reviews for the specified teacher
    cursor.execute('SELECT * FROM reviews WHERE teacher_id = ?', (teacher_id,))
    review_rows = cursor.fetchall()

    if not review_rows:
        raise HTTPException(status_code=404, detail="No reviews found for this teacher.")

    reviews = [
        {
            "id": row[0],
            "session_id": row[1],
            "teacher_id": row[2],
            "rating": row[3],
            "comment": row[4],
            "from_user": row[5]
        }
        for row in review_rows
    ]

    return {"teacher_id": teacher_id, "reviews": reviews}

#10 get all users
@app.get("/users")
def get_all_users():
    cursor.execute('SELECT * FROM users')
    rows = cursor.fetchall()

    users = [
        {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "location": row[3],
            "language": row[4],
            "credits": row[5],
            "availability": json.loads(row[6]) if row[6] else None,
            "interests": row[7].split(',') if row[7] else []
        }
        for row in rows
    ]

    return users

#11 get all similar skilss
@app.get("/users/{user_id}/suggested-skills")
def suggest_skills(user_id: int):
    # Fetch user's interests
    cursor.execute('SELECT interests FROM users WHERE id = ?', (user_id,))
    user_row = cursor.fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found.")

    user_interests = user_row[0].split(",") if user_row[0] else []

    if not user_interests:
        return {"message": "No interests found for the user.", "suggested_skills": []}

    # Find skills matching user's interests
    suggestions = []
    for interest in user_interests:
        query = '''
            SELECT * FROM skills
            WHERE tags LIKE ? OR category LIKE ?
            ORDER BY price ASC, experience_level DESC
            LIMIT 5
        '''
        cursor.execute(query, (f"%{interest}%", f"%{interest}%"))
        rows = cursor.fetchall()
        for row in rows:
            suggestions.append({
                "id": row[0],
                "user_id": row[1],
                "name": row[2],
                "category": row[3],
                "description": row[4],
                "price": row[5],
                "online": bool(row[6]),
                "experience_level": row[7],
                "tags": row[8].split(",") if row[8] else []
            })

    return {"user_id": user_id, "suggested_skills": suggestions}
