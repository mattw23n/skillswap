import datetime
import json
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import User, Skill, Session, Review
from initialization import get_cursor, init_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.on_event("startup")
async def startup_event():
    init_db()

#USER ENDPOINTS
@app.get("/users")
def get_all_users():
    with get_cursor() as cursor:
        try:
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
                    "interests": row[6].split(',') if row[6] else []
                }
                for row in rows
            ]

            return users
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/users/register")
def register_user(user: User):
    try:
        with get_cursor() as cursor:
            interests = ",".join(user.interests)
            cursor.execute('''
                INSERT INTO users (name, email, location, language, credits, interests)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user.name, user.email, user.location, user.language, user.credits, interests))
            user_id = cursor.lastrowid
            return {"id": user_id, "message": "User successfully registered."}
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail="Email already exists.")

@app.get("/users/{user_id}/sessions")
def get_user_sessions(user_id: int):
    with get_cursor() as cursor:
        cursor.execute('''
            SELECT * FROM sessions 
            WHERE teacher_id = ? OR student_id = ?
        ''', (user_id, user_id))
        rows = cursor.fetchall()

        sessions = [
            {
                "id": row[0],
                "skill_id": row[1],
                "teacher_id": row[2],
                "student_id": row[3],
                "date": row[4],
                "time": row[5],
                "status": row[6],
            }
            for row in rows
        ]

        return {"user_id": user_id, "sessions": sessions}

@app.get("/users/{user_id}")
def get_user_profile(user_id: int):
    with get_cursor() as cursor:
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
                "tags": row[7].split(',') if row[7] else [],
                "availability": json.loads(row[8]) if row[8] else None
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
            "interests": user_row[6].split(',') if user_row[6] else [],
            "skills": skills
        }

@app.post("/users/{user_id}/skills")
def add_skill(user_id: int, skill: Skill):
    with get_cursor() as cursor:
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found.")
        tags = ",".join(skill.tags) if skill.tags else None
        availability = json.dumps(skill.availability.dict()) if skill.availability else None
        cursor.execute('''
            INSERT INTO skills (user_id, name, category, description, price, online, tags, availability)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, skill.name, skill.category, skill.description, skill.price, skill.online, tags, availability))
        skill_id = cursor.lastrowid
        return {"message": "Skill added successfully.", "skill_id": skill_id}

#SKILLS ENDPOINTS
@app.get("/skills/{skill_id}")
def get_skill_by_id(skill_id: int):
    with get_cursor() as cursor:
        cursor.execute('''
            SELECT skills.id, skills.user_id, skills.name, skills.category, 
                skills.description, skills.price, skills.online, skills.tags, skills.availability, 
                users.location
            FROM skills
            INNER JOIN users ON skills.user_id = users.id
            WHERE skills.id = ?
        ''', (skill_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Skill not found.")

        return {
            "id": row[0],
            "user_id": row[1],
            "name": row[2],
            "category": row[3],
            "description": row[4],
            "price": row[5],
            "online": bool(row[6]),
            "tags": row[7].split(',') if row[7] else [],
            "availability": json.loads(row[8]) if row[8] else None,
            "location": row[9]
        }

@app.get("/skills")
def get_all_skills():
    with get_cursor() as cursor:
        try:
            cursor.execute('''
                SELECT skills.id, skills.user_id, skills.name, skills.category, 
                    skills.description, skills.price, skills.online, skills.tags, skills.availability, 
                    users.location
                FROM skills
                INNER JOIN users ON skills.user_id = users.id
            ''')
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
                    "tags": row[7].split(',') if row[7] else [],
                    "availability": json.loads(row[8]) if row[8] else None,
                    "location": row[9]
                }
                for row in rows
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

#SESSIONS ENDPOINTS
@app.post("/sessions/register")
def register_session(session: Session):
    with get_cursor() as cursor:
    # Verify teacher
        cursor.execute('SELECT * FROM users WHERE id = ?', (session.teacher_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Teacher not found.")

        # Verify student and ensure enough credits
        cursor.execute('SELECT * FROM users WHERE id = ?', (session.student_id,))
        student_row = cursor.fetchone()
        if not student_row:
            raise HTTPException(status_code=404, detail="Student not found.")
        
        # Check skill price and credits
        cursor.execute('SELECT price FROM skills WHERE id = ?', (session.skill_id,))
        skill_row = cursor.fetchone()
        if not skill_row:
            raise HTTPException(status_code=404, detail="Skill not found.")
        
        skill_price = skill_row[0]
        if student_row[5] < skill_price:
            raise HTTPException(status_code=400, detail="Not enough credits.")

        # Deduct credits from student
        cursor.execute('UPDATE users SET credits = credits - ? WHERE id = ?', 
                    (skill_price, session.student_id))

        # Register session
        cursor.execute('''
            INSERT INTO sessions (skill_id, student_id, teacher_id, date, time, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (session.skill_id, session.student_id, session.teacher_id, 
            session.date, session.time, "pending"))
        
        return {
            "message": "Session registered successfully.",
            "session_id": cursor.lastrowid,
            "credits_on_hold": skill_price
        }

@app.patch("/sessions/{session_id}/status")
def update_session_status(session_id: int, status: str):
    with get_cursor() as cursor:
        cursor.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
        session_row = cursor.fetchone()
        if not session_row:
            raise HTTPException(status_code=404, detail="Session not found.")

        cursor.execute('UPDATE sessions SET status = ? WHERE id = ?', 
                    (status, session_id))

        if status == "completed":
            teacher_id = session_row[2]
            skill_id = session_row[1]

            cursor.execute('SELECT price FROM skills WHERE id = ?', (skill_id,))
            skill_row = cursor.fetchone()
            if not skill_row:
                raise HTTPException(status_code=404, detail="Skill not found.")
            
            skill_price = skill_row[0]
            cursor.execute('UPDATE users SET credits = credits + ? WHERE id = ?', 
                        (skill_price, teacher_id))

        return {"message": f"Session status updated to '{status}'"}

@app.post("/sessions/{session_id}/review")
def review_session(session_id: int, review: Review):
    with get_cursor() as cursor:
        cursor.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
        session_row = cursor.fetchone()
        if not session_row:
            raise HTTPException(status_code=404, detail="Session not found.")

        cursor.execute('''
            INSERT INTO reviews (session_id, teacher_id, rating, comment, from_user)
            VALUES (?, ?, ?, ?, ?)
        ''', (session_id, review.teacher_id, review.rating, review.comment, review.from_user))

@app.get("/sessions/{session_id}")
def get_session(session_id: int):
    with get_cursor() as cursor:
        try:
            cursor.execute('''
                SELECT sessions.*, skills.name as skill_name, skills.price
                FROM sessions 
                JOIN skills ON sessions.skill_id = skills.id
                WHERE sessions.id = ?
            ''', (session_id,))
            
            session = cursor.fetchone()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
                
            return {
                "id": session[0],
                "skill_id": session[1],
                "teacher_id": session[2],
                "student_id": session[3],
                "date": session[4],
                "time": session[5],
                "status": session[6],
                "skill_name": session[7],
                "price": session[8]
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))