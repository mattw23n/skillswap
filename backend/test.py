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
    "New York, USA", "San Francisco, USA", "Los Angeles, USA", 
    "Chicago, USA", "Seattle, USA", "Austin, USA", "Boston, USA", 
    "Denver, USA", "Miami, USA", "Atlanta, USA"
]

languages = ["English", "Spanish", "French", "German", "Mandarin"]

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
        "availability": {
            "days": random.sample(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 3),
            "time_slots": [
                {"start_time": "10:00", "end_time": "12:00"},
                {"start_time": "14:00", "end_time": "16:00"}
            ]
        },
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
        "experience_level": "Beginner",
        "tags": ["Python", "Programming"]
    },
    {
        "name": "Photography Masterclass",
        "category": "Arts",
        "description": "Master the art of photography.",
        "price": 20,
        "online": False,
        "experience_level": "Advanced",
        "tags": ["Photography", "Camera"]
    },
    {
        "name": "Cooking for Beginners",
        "category": "Lifestyle",
        "description": "Learn to cook delicious meals.",
        "price": 15,
        "online": True,
        "experience_level": "Beginner",
        "tags": ["Cooking", "Food"]
    },
    {
        "name": "Public Speaking Workshop",
        "category": "Personal Development",
        "description": "Improve your public speaking skills.",
        "price": 25,
        "online": False,
        "experience_level": "Intermediate",
        "tags": ["Speaking", "Communication"]
    },
    {
        "name": "Yoga and Meditation",
        "category": "Health",
        "description": "Practice yoga and meditation for a healthy lifestyle.",
        "price": 18,
        "online": True,
        "experience_level": "Beginner",
        "tags": ["Yoga", "Meditation"]
    }
]

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
        skill_response = requests.post(f"{BASE_URL}/users/{user_id}/skills", json=skill)
        if skill_response.status_code == 200:
            print(f"Skill added for User {user_id}: {skill_response.json()}")
        else:
            print(f"Error adding skill for User {user_id}:", skill_response.json())