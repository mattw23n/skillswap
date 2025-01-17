const BASE_URL = 'http://localhost:8000';

export const fetchSkills = async () => {
    const response = await fetch(`${BASE_URL}/skills`);
    if (!response.ok) {
        throw new Error('Failed to fetch skills');
    }
    return await response.json();
};

export const fetchUser = async (id) => {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return await response.json();
};

export const fetchSkill = async (id) => {
    const response = await fetch(`${BASE_URL}/skills/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch skill');
    }
    return await response.json();
};

export const fetchSession = async (id) => {
    const response = await fetch(`${BASE_URL}/sessions/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch skill');
    }
    return await response.json();
};

export const updateSessionStatus = async (sessionId, status) => {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/status?status=${status}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update session status');
    }

    return await response.json();
};

export const fetchUpcomingSessions = async (id) => {
    const response = await fetch(`${BASE_URL}/users/${id}/sessions`);
    if (!response.ok) {
        throw new Error('Failed to fetch upcoming sessions');
    }
    return await response.json();
};

export const registerSession = async (sessionData) => {
    const response = await fetch(`${BASE_URL}/sessions/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            skill_id: sessionData.skill_id,
            teacher_id: sessionData.teacher_id,
            student_id: sessionData.student_id,
            date: sessionData.date,
            time: sessionData.time
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to register session');
    }

    return await response.json();
};