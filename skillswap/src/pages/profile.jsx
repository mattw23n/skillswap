import { useState, useEffect, useContext } from 'react';
import { ProfileContext } from '../profileContext';
import SessionCard from '../components/sessionCard';
import { fetchUpcomingSessions, fetchUser } from '../api/api';

export default function ProfilePage() {
    const { profile } = useContext(ProfileContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingInterests, setEditingInterests] = useState(false);
    const [newInterest, setNewInterest] = useState('');
    const [editingSkills, setEditingSkills] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetchUpcomingSessions(profile.id)
                setSessions(response.sessions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (profile) {
            fetchSessions();
        }
    }, [profile]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const teachingSessions = sessions.filter(session => session.teacher_id === profile.id);
    const learningSessions = sessions.filter(session => session.student_id === profile.id);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{profile.name}'s Profile</h1>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p>Email: {profile.email}</p>
                        <p>Location: {profile.location}</p>
                        <p>Language: {profile.language}</p>
                        <p>Credits: {profile.credits}</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                                <span 
                                    key={index}
                                    className="bg-gray-100 rounded-full px-3 py-1 text-sm"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Teaching History</h2>
                <div className="flex flex-wrap gap-4">
                    {teachingSessions.length > 0 ? (
                        teachingSessions.map(session => (
                            <SessionCard key={session.id} session={session} />
                        ))
                    ) : (
                        <p>No teaching sessions yet</p>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Learning History</h2>
                <div className="flex flex-wrap gap-4">
                    {learningSessions.length > 0 ? (
                        learningSessions.map(session => (
                            <SessionCard key={session.id} session={session} />
                        ))
                    ) : (
                        <p>No learning sessions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}