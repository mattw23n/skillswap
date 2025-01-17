import { useState, useEffect, useContext } from 'react';
import { SkillCard } from '../components/skillCard';
import { ProfileContext } from '../profileContext';
import { fetchSkills, fetchUpcomingSessions } from '../api/api';
import SessionCard from '../components/sessionCard';

export default function HomePage() {
    const [skills, setSkills] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const { profile, setProfile } = useContext(ProfileContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchSkills();
                const sessionsData = await fetchUpcomingSessions(profile.id);
                setSessions(sessionsData.sessions);
                setSkills(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = skills.filter(skill => {
            const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                skill.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !category || skill.category === category;
            const matchesLocation = !location || skill.location === location;
            const matchesPrice = !maxPrice || skill.price <= parseInt(maxPrice);
            
            return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
        });
        setFilteredSkills(filtered);
    }, [searchQuery, category, maxPrice, skills, location]);

    const nearbySkills = skills.filter((skill) => skill.location.includes(profile.location));
    const interestedSkills = skills.filter((skill) => 
        skill.tags.some(tag => profile.interests.includes(tag))
    );

    return (
        <div className='w-full'>
            <section className='my-20'>
                <p className='text-3xl text-center'>Hi {profile.name}, <br></br>What would you like to do today?</p>
            </section>
            <section className='my-20'>
                <p className='text-2xl text-center'>Your Upcoming Sessions</p>
                <div className='flex flex-row justify-center gap-x-4 overflow-x-auto my-4'>
                    {sessions.filter((session) => session.status !== "completed").map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}

                </div>

            </section>
            <section className='my-20'>
                <p className='text-2xl text-center'>Skills near <b>{profile.location}</b></p>
                <div className='flex flex-row justify-center gap-x-4 overflow-x-auto my-4'>
                    {nearbySkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}

                </div>

            </section>
            <section>
                <p className='text-2xl text-center'>Skills <b>For You</b></p>
                <div className='flex flex-row justify-center gap-x-4 overflow-x-auto my-4'>
                    {interestedSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}

                </div>
            </section>

            <section className='sticky top-0 py-4 '>
                <div className='mx-auto max-w-2xl p-4'>
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-4 px-6 text-xl text-center border rounded-full shadow-lg"
                    />
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="p-2 border rounded-lg"
                        >
                            <option value="">All Categories</option>
                            <option value="Technology">Technology</option>
                            <option value="Arts">Arts</option>
                            <option value="Personal Development">Personal Development</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="p-2 border rounded-lg"
                        >
                            <option value="">All Locations</option>
                            <option value="Tiong Bahru">Tiong Bahru</option>
                            <option value="Bukit Timah">Bukit Timah</option>
                            <option value="Bugis">Bugis</option>
                            <option value="Clementi">Clementi</option>
                            <option value="Yishun">Yishun</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="p-2 border rounded-lg"
                        />
                    </div>
                </div>
            </section>

            
            <div className="container mx-auto p-4">
                {loading && <p>Loading skills...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                
                <div className="flex flex-wrap gap-4 justify-center">
                    {filteredSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}
                </div>
            </div>
        </div>
        
    );
}