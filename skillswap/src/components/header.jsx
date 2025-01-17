import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProfileContext } from "../profileContext";

export default function Header(){
    const { profile, setProfile } = useContext(ProfileContext);
    
    return (
        <nav className="flex flex-row justify-between text-xl mx-40 py-4">
            <Link to="/" className="text-black hover:text-gray-300">
              SkillSwap
            </Link>

            <div className="flex flex-row justify-center gap-x-4">
                <Link to="/teach" className="hover:underline">Teach</Link>
                <Link to="/" className="hover:underline">Explore</Link>
                <Link className="hover:underline">Forum</Link>
            </div>

            <div className="flex gap-x-2">
                <Link to="/profile">{profile.name}</Link>
                <p className="font-bold">{profile.credits}</p>
            </div>
        </nav>
    )
}