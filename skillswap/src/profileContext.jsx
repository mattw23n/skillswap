import { createContext, useState, useEffect } from 'react';
import { fetchUser } from './api/api';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await fetchUser(12); // Fetch user with ID 1
                setProfile(userData);
            } catch (err) {
                setError(err.message);
                console.error('Failed to load profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>Error loading profile: {error}</div>;
    if (!profile) return <div>No profile found</div>;

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};