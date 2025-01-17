import { useEffect, useState } from "react";
import { fetchUser } from "../api/api";

export default function UserCard({ userID }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetchUser(userID)
                setUser(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="p-2 border border-gray-200 rounded-xl w-fit hover:border-red-600">
            <p>{user?.name}</p>
        </div>
    )
}