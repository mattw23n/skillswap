import { useEffect, useState } from "react";
import { fetchSkill } from "../api/api";
import { useNavigate } from 'react-router-dom';
import { truncateText } from './skillCard';

export default function SessionCard({ session }) {
    const [ skill, setSkill ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleClick = () => {
        navigate(`/session/${session.id}`);
    };


    useEffect(() => {
        const fetchSkillData = async () => {
                try {
                    const response = await fetchSkill(session.skill_id)
                    setSkill(response);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchSkillData();
        }, [session.skill_id]);

    if (!skill) return null;

    return (
        <div 
            onClick={handleClick}
            className="cursor-pointer flex flex-col justify-between rounded-xl p-4 border border-gray-500 min-w-64 max-w-64 hover:border-red-600"
        >
            <div>
                <p className="text-lg">{truncateText(skill?.name, 20)}</p>
                <div className="flex flex-row gap-x-3">
                    <p>{skill.location}</p>
                    <p>{skill.price} Credits</p>
                </div>

                <div className="flex flex-row gap-x-3 my-2">
                    <p className="text-sm">{session.date}</p>
                    <p className="text-sm">{session.time}</p>
                </div>
                <span className={`text-xs rounded-lg px-2 py-1 ${getStatusColor(session.status)}`}>
                    {session.status}
                </span>
            </div>

        </div>
    )
}