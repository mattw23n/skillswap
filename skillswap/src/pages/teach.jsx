import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../profileContext';

export default function TeachPage() {
    const { profile } = useContext(ProfileContext);
    const navigate = useNavigate();

    const motivationalQuotes = [
        "How are you giving back to the community?",
        "What are you planning to teach today?",
        "Share your expertise with others!",
        "Your knowledge could be someone's next breakthrough."
    ];

    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <section className="text-center my-12">
                <h1 className="text-4xl font-bold mb-4">Teach & Share</h1>
                <p className="text-xl text-gray-600 mb-8">{randomQuote}</p>
                <button 
                    onClick={() => navigate('/add-skill')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
                >
                    Add a New Skill
                </button>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Your Teaching Skills</h2>
                {profile.skills && profile.skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.skills.map((skill) => (
                            <div 
                                key={skill.id}
                                className="border rounded-xl p-6 hover:border-blue-500 cursor-pointer"
                                onClick={() => navigate(`/skill/${skill.id}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl">{skill.name}</h3>
                                        <p className="text-gray-600">{skill.category}</p>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                        {skill.price} Credits
                                    </span>
                                </div>
                                <p className="text-gray-700">{skill.description}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {skill.tags.map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-xl text-gray-600 mb-4">You haven't added any skills yet.</p>
                        <p className="text-gray-500">Share your knowledge with the community!</p>
                    </div>
                )}
            </section>
        </div>
    );
}