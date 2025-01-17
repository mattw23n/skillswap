from pydantic import BaseModel
from typing import List, Optional

class Availability(BaseModel):
    days: List[str]
    time_slots: List[dict]  # E.g., [{"start_time": "09:00", "end_time": "11:00"}]

class Skill(BaseModel):
    name: str
    category: str
    description: str
    price: int
    online: bool
    tags: Optional[List[str]] = []
    availability: Optional[Availability] = None

class User(BaseModel):
    name: str
    email: str
    location: str
    language: str
    credits: int = 60
    interests: List[str] = []

class Session(BaseModel):
    skill_id: int
    teacher_id: int
    student_id: int
    date: str
    time: str

class Review(BaseModel):
    session_id: int
    teacher_id: int
    rating: int
    comment: str
    from_user: int