import requests

# Base URL
BASE_URL = "http://127.0.0.1:8000"

# Dummy Users
users = [
    {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "location": "New York, USA",
        "language": "English",
        "availability": {
            "days": ["Monday", "Wednesday"],
            "time_slots": [{"start_time": "10:00", "end_time": "12:00"}]
        },
        "interests": ["Photography", "Public Speaking"]
    },
    {
        "name": "Bob Smith",
        "email": "bob@example.com",
        "location": "San Francisco, USA",
        "language": "English",
        "availability": {
            "days": ["Tuesday", "Thursday"],
            "time_slots": [{"start_time": "14:00", "end_time": "16:00"}]
        },
        "interests": ["Python Programming", "Cooking"]
    }
]

# Register Users
user_ids = []
for user in users:
    response = requests.post(f"{BASE_URL}/users/register", json=user)
    print("Register User Response:", response.json())
    user_ids.append(response.json().get("id"))

# Dummy Skills for Alice
skills = [
    {
        "name": "Python Basics",
        "category": "Technology",
        "description": "Learn the basics of Python programming.",
        "price": 15,
        "online": True,
        "experience_level": "Beginner",
        "tags": ["Python", "Programming", "Coding"]
    },
    {
        "name": "Photography Masterclass",
        "category": "Arts",
        "description": "Master the art of photography.",
        "price": 20,
        "online": False,
        "experience_level": "Advanced",
        "tags": ["Photography", "Camera", "Editing"]
    }
]

# Add Skills for Alice (user_id[0])
for skill in skills:
    response = requests.post(f"{BASE_URL}/users/{user_ids[0]}/skills", json=skill)
    print("Add Skill Response:", response.json())

# Dummy Session
session = {
    "skill_id": 1,  # Assuming Python Basics is skill_id 1
    "teacher_id": user_ids[0],  # Alice
    "student_ids": [user_ids[1]],  # Bob
    "date": "2025-01-25",
    "time": "14:00",
    "duration": 60
}

# Register Session
response = requests.post(f"{BASE_URL}/sessions/register", json=session)
print("Register Session Response:", response.json())
session_id = response.json().get("session_id")

# Dummy Review
review = {
    "session_id": session_id,
    "teacher_id": user_ids[0],  # Alice
    "rating": 5,
    "comment": "Great session! Learned a lot.",
    "from_user": user_ids[1]  # Bob
}

# Submit Review
response = requests.post(f"{BASE_URL}/sessions/{session_id}/review", json=review)
print("Submit Review Response:", response.json())
