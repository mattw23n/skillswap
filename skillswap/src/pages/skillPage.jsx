import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import UserCard from '../components/userCard';
import { ProfileContext } from '../profileContext';
import { fetchSkill, registerSession } from '../api/api';

export default function SkillPage() {
    const { profile } = useContext(ProfileContext);
    const { skillId } = useParams();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [modalError, setModalError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const handleSignupClick = () => {
        setShowConfirmation(true);
    };

    const renderAvailability = () => {
        if (!skill.availability) return null;

        return (
            <div className="mt-4">
                <h3 className="text-xl mb-2">Available Times</h3>
                <div className="grid gap-4">
                    {skill.availability.days.map(day => (
                        <div key={day} className="border p-4 rounded">
                            <h4 className="font-bold">{day}</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {skill.availability.time_slots.map((slot, index) => (
                                    <button
                                        key={index}
                                        className={`p-2 rounded ${
                                            selectedDate === day && selectedTimeSlot === slot
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                        onClick={() => {
                                            setSelectedDate(day);
                                            setSelectedTimeSlot(slot);
                                        }}
                                    >
                                        {slot.start_time} - {slot.end_time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchSkillData = async () => {
            try {
                const response = await fetchSkill(skillId)
                setSkill(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSkillData();
    }, [skillId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!skill) return <div>Skill not found</div>;

    const handleConfirmSignup = async () => {
        if (!selectedDate || !selectedTimeSlot) return;
        
        try {
            const sessionData = {
                skill_id: skill.id,
                teacher_id: profile.id,
                student_id: skill.user_id,
                date: selectedDate,
                time: `${selectedTimeSlot.start_time}-${selectedTimeSlot.end_time}`
            };

            console.log(sessionData)
    
            const response = await registerSession(sessionData);
            setShowConfirmation(false);
            alert('Session booked successfully!');
        } catch (err) {
            setModalError(err.message);
        }
    };

    const handleCloseModal = () => {
        setShowConfirmation(false);
        setModalError(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
            <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 px-3 py-1 rounded-xl text-sm">
                        {tag}
                    </span>
                ))}
            </div>
           
            <div className="grid grid-cols-2 gap-8">
                <div className='mt-4 flex flex-col gap-4'>
                    <div>
                        <p className="text-xl mb-2">Description</p>
                        <p className="text-gray-600">{skill.description}</p>

                        <div className="mt-4">
                            <p>Category: {skill.category}</p>
                            <p>Location: {skill.location}</p>
                            <p>Price: {skill.price} Credits</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl mb-2">Taught by</p>
                        <UserCard userID={skill.user_id} />
                    </div>


                    

                </div>
                <div>
                    {renderAvailability()}
                    <button 
                        className={`mt-6 w-full py-3 px-6 rounded-lg ${
                            selectedDate && selectedTimeSlot
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                        onClick={handleSignupClick}
                        disabled={!selectedDate || !selectedTimeSlot}
                    >
                        {selectedDate && selectedTimeSlot 
                            ? `Sign Up for ${selectedDate} at ${selectedTimeSlot.start_time}`
                            : 'Please select a date and time'}
                    </button>

                </div>
                    
            </div>
            {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
                    {modalError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {modalError}
                        </div>
                    )}
                    <p className="mb-4">
                        Are you sure you want to book this session?<br/>
                        Date: {selectedDate}<br/>
                        Time: {selectedTimeSlot.start_time} - {selectedTimeSlot.end_time}<br/>
                        Price: {skill.price} credits<br/>
                        Your credits: {profile.credits} credits
                    </p>
                    <div className="flex justify-end gap-4">
                        <button 
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleConfirmSignup}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}