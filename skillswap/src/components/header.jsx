import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileContext } from "../profileContext";

export default function Header(){
    const { profile, setProfile } = useContext(ProfileContext);
    const location = useLocation();
    
    return (
        <nav className="flex flex-row justify-between text-xl mx-40 py-4">
            <Link to="/" className="text-black hover:text-gray-400">
              SkillSwap
            </Link>

            

            {location.pathname !== '/' && (
                <>
                <div className="flex flex-row justify-center gap-x-4">
                    <Link to="/teach" className="hover:text-gray-400">Teach</Link>
                    <Link to="/" className="hover:text-gray-400">Explore</Link>
                    {/* <Link className="hover:text-gray-400">Forum</Link> */}
                </div>

                <div className="flex gap-x-2">
                    <Link to="/profile">{profile.name}</Link>
                    <p className="font-bold">{profile.credits}</p>
                </div>
                </>
                
            )}
        </nav>
    )
}