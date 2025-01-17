# SkillSwap

SkillSwap is a peer-to-peer skill-sharing platform based on a timebank system. The currency used in SkillSwap is people's time. It is a community-driven platform where the only way to earn credits (time) is by teaching others. It is built using React, FastAPI, and SQlite for speedy development and testing. 

## Overview

SkillSwap allows users to share their skills and learn new ones from others in the community. Users can register, create profiles, and list the skills they are willing to teach. They can also browse and sign up for sessions to learn new skills from other users.

### Key Features

- **Peer-to-Peer Skill Sharing**: Users can teach and learn various skills from each other.
- **Timebank System**: The currency is time. Users earn credits by teaching others and spend credits to learn new skills.
- **Community-Driven**: The platform encourages community engagement and knowledge sharing.
- **Flexibility**: Teachers determine their own availability to teach.
- **Location and Interest Recommendations**: Recommendations based on user profiles.

### How the Credit System Works

- **Credits**: A credit is equivalent to 2 minutes. Users start with 60 credits (2 hours) to get a taste of the skills being taught.
- **Earning Credits**: Users earn credits by teaching others.
- **Using Credits**: Users spend credits to learn new skills.
- **Session Sign-Up**: When users sign up for a session, their credits are held by the system. After attending the session, they can release the credits to the tutor/teacher.


## Project Plan and Milestones

### Project Plan

The vision for SkillSwap extends beyond the current Proof of Concept (POC). While this initial version focused on the core functionality necessary to showcase the concept, several features were identified but deferred due to time constraints. These features aim to enrich the platform and create a vibrant, community-driven learning experience:

1. **Reviews for Sessions/Courses**:
   - Allow users to leave reviews for sessions and courses they have attended.

2. **Community Forum and Learning Groups**:
   - Create a forum where users can discuss and learn together as a group, similar to Coursera's learning groups.

3. **Public User Profiles**:
   - Make user profiles visible to others, showcasing their interests, skills, and reviews. These profiles can be shared externally.

4. **Workshop System**:
   - Enable workshops with multiple teachers or multiple students. Students can pool credits to participate if they lack sufficient credits individually.

5. **Credit Gifting**:
   - Allow users to gift credits to encourage collaboration and community engagement.

6. **AI-Powered Feedback**:
   - Provide AI-powered feedback to new teachers, helping them gain confidence and improve their teaching abilities.

---

### Milestones

1. **Improving Current Status Quo**:
   - Add reviews for sessions and courses.
   - Make user profiles public and shareable.
   - Enable credit gifting.
   - Implement messaging capabilities between teachers and students.

2. **Fostering Community Engagement**:
   - Introduce workshops with multiple teachers and students.
   - Create a community discussion forum and learning groups to encourage collaborative learning.

3. **AI-Powered Phase**:
   - Implement AI-driven course and skill recommendations tailored to user interests.
   - Provide AI-powered feedback for teachers to enhance their teaching methods.

---

This plan outlines the progression of SkillSwap from a foundational POC to a fully-fledged platform that supports community-driven learning and innovative AI-powered tools.


### Getting Started

To get started with SkillSwap, follow these steps:

### Clone the Repository

```bash
git clone [github.com/mattw23n/skillswap](https://github.com/mattw23n/skillswap)
cd skillswap
```

---

## Running the Application

### Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set up the Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend server will now be running at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd ../skillswap
   ```

2. Install the necessary packages:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will now be running at [http://localhost:3000](http://localhost:3000).

---

## Populating the Database

1. Ensure the backend server is running.
2. Run the `populate.py` script to generate dummy data:
   ```bash
   python populate.py
   ```

This will create a SQLite database (`app.db`) in the backend directory and populate it with sample data.

---

## Technologies Used

- **Backend:** FastAPI, SQLite, Python
- **Frontend:** React, JavaScript, Tailwind CSS
- **Database:** SQLite

---
