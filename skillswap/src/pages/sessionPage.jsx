import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import UserCard from '../components/userCard';
import { ProfileContext } from '../profileContext';
import { fetchSkill, fetchSession, updateSessionStatus } from '../api/api';

export default function SessionPage() {
    const { sessionId } = useParams();
    const { profile } = useContext(ProfileContext);
    const [session, setSession] = useState(null);
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionData = await fetchSession(sessionId);
                const skillData = await fetchSkill(sessionData.skill_id);
                setSession(sessionData);
                setSkill(skillData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sessionId]);

    const handleStatusUpdate = async (status) => {
        try {
            await updateSessionStatus(session.id, status);
            setSession({ ...session, status });
            setShowConfirmation(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!session || !skill) return <div>Session not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-xl text-sm ${
                    session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {session.status}
                </span>
            </div>
           
            <div className="grid grid-cols-2 gap-8">
                <div className='mt-4 flex flex-col gap-4'>
                    <div>
                        <p className="text-xl mb-2">Session Details</p>
                        <p>Date: {session.date}</p>
                        <p>Time: {session.time}</p>
                        <p>Price: {skill.price} Credits</p>
                        
                        <div className="mt-4">
                            <p>Category: {skill.category}</p>
                            <p>Location: {skill.location}</p>
                            <p className="text-gray-600">{skill.description}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl mb-2">Teacher</p>
                        <UserCard userID={session.teacher_id} />
                    </div>
                    <div>
                        <p className="text-xl mb-2">Student</p>
                        <UserCard userID={session.student_id} />
                    </div>
                </div>
                
                <div className="mt-4">
                    {session.status === 'pending' && session.student_id === profile.id &&  (
                        <button 
                            className="w-full py-3 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white mb-4"
                            onClick={() => setShowConfirmation(true)}
                        >
                            Complete Session & Release Credits
                        </button>
                    )}
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Session Completion</h3>
                        <p className="mb-4">
                            Are you sure you want to complete this session?<br/>
                            This will release {skill.price} credits to the teacher.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button 
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-green-500 text-white rounded"
                                onClick={() => handleStatusUpdate('completed')}
                            >
                                Complete Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}