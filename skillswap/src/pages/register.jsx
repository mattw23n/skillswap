import { useState } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        language: '',
        interests: [],
        availability: {
            days: [],
            time_slots: []
        }
    });
    const [errors, setErrors] = useState({});
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [interest, setInterest] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddAvailability = () => {
        setFormData((prevData) => ({
            ...prevData,
            availability: {
                days: [...prevData.availability.days, day],
                time_slots: [...prevData.availability.time_slots, { start_time: startTime, end_time: endTime }]
            }
        }));
        setDay('');
        setStartTime('');
        setEndTime('');
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.language) newErrors.language = 'Language is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(step + 1);
        }
    };

    const handleAddInterest = () => {
        setFormData((prevData) => ({
            ...prevData,
            interests: [...prevData.interests, interest]
        }));
        setInterest('');
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log(formData);

            const response = await fetch('http://localhost:8000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const data = await response.json();
            console.log('Registration successful:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="mx-auto max-w-2xl border border-gray-500 rounded-md p-4">
            <p className="text-3xl font-bold">Register</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                    <>
                        <div>
                            <label className="block text-lg">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-lg">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        {/* <div>
                            <label className="block text-lg">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                        </div> */}
                        <div>
                            <label className="block text-lg">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.location && <p className="text-red-500">{errors.location}</p>}
                        </div>
                        <div>
                            <label className="block text-lg">Language</label>
                            <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.language && <p className="text-red-500">{errors.language}</p>}
                        </div>
                        <button type="button" onClick={handleNext} className="w-full py-2 px-4 bg-blue-500 text-white rounded">
                            Next
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <div>
                            <label className="block text-lg">Interests (Optional)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={interest}
                                    onChange={(e) => setInterest(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                <button type="button" onClick={handleAddInterest} className="py-2 px-4 bg-green-500 text-white rounded">
                                    Add
                                </button>
                            </div>
                            <div className="mt-2">
                                <p>Interests: {formData.interests.join(', ')}</p>
                            </div>
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
                                <p>Days: {formData.availability.days.join(', ')}</p>
                                <p>Time Slots: {formData.availability.time_slots.map(slot => `${slot.start_time} - ${slot.end_time}`).join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={handleBack} className="py-2 px-4 bg-gray-500 text-white rounded">
                                Back
                            </button>
                            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">
                                Submit
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}