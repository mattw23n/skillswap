import requests
import random

# Base URL
BASE_URL = "http://127.0.0.1:8000"

# Dummy Data
names = [
    "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", 
    "Eve Adams", "Frank White", "Grace Hopper", "Hank Green", 
    "Ivy Clark", "Jack Daniels", "Karen Black", "Leo King", 
    "Mona Lisa", "Nathan Drake", "Olivia Wilde", "Paul Allen", 
    "Quincy Jones", "Rachel Green", "Steve Rogers", "Tony Stark"
]

locations = [
    "Tiong Bahru", "Newton", "Pasir Ris", 
    "Jurong East", "Yishun", "Punggol", "Bugis", 
    "Serangoon", "Bukit Timah", "Clementi"
]

languages = ["English", "Malay", "Tamil", "Mandarin", "Hokkien"]

interests_pool = [
    "Photography", "Python Programming", "Public Speaking", "Cooking", 
    "Gardening", "Music", "Dancing", "Writing", "Traveling", "Yoga"
]

# Generate Users
for i in range(20):  # Generate 20 users
    user = {
        "name": names[i % len(names)],
        "email": f"user{i+1}@example.com",
        "location": random.choice(locations),
        "language": random.choice(languages),
        "interests": random.sample(interests_pool, 2)
    }
    response = requests.post(f"{BASE_URL}/users/register", json=user)
    print(f"Registering User {i+1}: {response.json()}")

# Skill Pool
skills_pool = [
    {
        "name": "Python Basics",
        "category": "Technology",
        "description": "Learn the basics of Python programming.",
        "price": 10,
        "online": True,
        "tags": ["Python", "Programming"]
    },
    {
        "name": "Photography Masterclass",
        "category": "Arts",
        "description": "Master the art of photography.",
        "price": 20,
        "online": False,
        "tags": ["Photography", "Camera"]
    },
    {
        "name": "Cooking for Beginners",
        "category": "Lifestyle",
        "description": "Learn to cook delicious meals.",
        "price": 15,
        "online": True,
        "tags": ["Cooking", "Food"]
    },
    {
        "name": "Public Speaking Workshop",
        "category": "Personal Development",
        "description": "Improve your public speaking skills.",
        "price": 25,
        "online": False,
        "tags": ["Speaking", "Communication"]
    },
    {
        "name": "Yoga and Meditation",
        "category": "Health",
        "description": "Practice yoga and meditation for a healthy lifestyle.",
        "price": 18,
        "online": True,
        "tags": ["Yoga", "Meditation"]
    }
]

# Define possible time slots
time_slots = [
    {"start_time": "09:00", "end_time": "11:00"},
    {"start_time": "11:00", "end_time": "13:00"},
    {"start_time": "14:00", "end_time": "16:00"},
    {"start_time": "16:00", "end_time": "18:00"}
]

# Define days of the week
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Fetch all users
response = requests.get(f"{BASE_URL}/users")
if response.status_code == 200:
    users = response.json()
else:
    print("Error fetching users:", response.json())
    users = []

# Add skills to each user
for user in users:
    user_id = user["id"]
    # Assign 1-3 random skills to each user
    assigned_skills = random.sample(skills_pool, random.randint(1, 3))
    
    for skill in assigned_skills:
        # Generate random availability
        skill["availability"] = {
            "days": random.sample(days, random.randint(1, 4)),
            "time_slots": random.sample(time_slots, random.randint(1, 2))
        }

        print(skill["availability"])
        
        skill_response = requests.post(f"{BASE_URL}/users/{user_id}/skills", json=skill)
        if skill_response.status_code == 200:
            try:
                print(f"Skill added for User {user_id}: {skill_response.json()}")
            except requests.exceptions.JSONDecodeError:
                print(f"Skill added for User {user_id}, but received non-JSON response")
        else:
            try:
                print(f"Error adding skill for User {user_id}:", skill_response.json())
            except requests.exceptions.JSONDecodeError:
                print(f"Error adding skill for User {user_id}: Received non-JSON response")