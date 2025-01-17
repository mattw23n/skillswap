import { useNavigate } from 'react-router-dom';


export function SkillCard({skill}){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/skill/${skill.id}`);
    };

    return (
        <div 
            onClick={handleClick}
            className="cursor-pointer flex flex-col justify-between rounded-xl p-4 border border-gray-300 min-w-64 max-w-64 hover:border-blue-600">
            <div>
                <p className="text-lg font-bold">{truncateText(skill.name, 20)}</p>
                <div className="flex flex-row gap-x-3">
                    <p>{skill.location}</p>
                    <p>{skill.price} Credits</p>
                </div>

                <p className="text-sm my-2">{truncateText(skill.description, 80)}</p>
            </div>

            

            <div>
                <p className="text-sm mb-1 ">{skill.category}</p>
                <div className="flex flex-wrap gap-1">
                    {skill.tags.map((tag, idx) => {
                        return <span key={idx} className="text-xs rounded-lg px-2 py-1 bg-gray-200">{tag}</span>
                    })}

                </div>

            </div>
            

        </div>
    )
}

export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};