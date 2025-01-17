import { useState, useContext } from 'react';
import { ProfileContext } from '../profileContext';
import { addSkill } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AddSkillPage() {
    const { profile } = useContext(ProfileContext);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [online, setOnline] = useState(false);
    const [tags, setTags] = useState('');
    const [availability, setAvailability] = useState({ days: [], time_slots: [] });
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const navigate = useNavigate();

    const handleAddAvailability = () => {
        if (!day || !startTime || !endTime) return;
        setAvailability({
            days: [...availability.days, day],
            time_slots: [...availability.time_slots, { start_time: startTime, end_time: endTime }]
        });
        setDay('');
        setStartTime('');
        setEndTime('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const skillData = {
            name,
            category,
            description,
            price: parseInt(price),
            online,
            tags: tags.split(',').map(tag => tag.trim()),
            availability
        };

        try {
            await addSkill(profile.id, skillData);
            alert('Skill added successfully!');
            navigate('/teach');
            
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Add a New Skill</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option disabled value="">Select Category</option>
                        <option value="technology">Technology</option>
                        <option value="arts">Arts</option>
                        <option value="personal development">Personal Development</option>
                        <option value="health">Health</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className='flex flex-row justify-between items-center'>
                    <div>
                        <label className="block text-lg">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg">Online</label>
                        <input
                            type="checkbox"
                            checked={online}
                            onChange={(e) => setOnline(e.target.checked)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-lg">Tags (comma separated)</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-lg">Availability</label>
                    <div className="flex gap-2">
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option disabled value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                        <input
                            type="time"
                            placeholder="Start Time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="time"
                            placeholder="End Time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <button type="button" onClick={handleAddAvailability} className="py-2 px-4 bg-green-500 text-white rounded">
                            Add
                        </button>
                    </div>
                    <div className="mt-2">
                        <p>Days: {availability.days.join(', ')}</p>
                        <p>Time Slots: {availability.time_slots.map(slot => `${slot.start_time} - ${slot.end_time}`).join(', ')}</p>
                    </div>
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded">
                    Add Skill
                </button>
            </form>
        </div>
    );
}