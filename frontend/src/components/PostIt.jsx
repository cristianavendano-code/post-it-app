import { useState, useEffect } from 'react';

const postItRotations = ['-rotate-3', '-rotate-2', '-rotate-1', 'rotate-1', 'rotate-2', 'rotate-3'];

export default function PostIt({ text, onClick }) {
    const [rotation, setRotation] = useState('');

    useEffect(() => {
        const randomRotation = postItRotations[Math.floor(Math.random() * postItRotations.length)];
        setRotation(randomRotation);
    }, []);

    return (
        <button 
            onClick={onClick} 
            className={`
                ${rotation}
                relative w-32 h-32 flex items-center justify-center 
                text-black font-semibold text-lg
                shadow-[2px_4px_6px_rgba(0,0,0,0.25)] 
                transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-10
                bg-yellow-400 hover:bg-yellow-500
            `}
        >
            {text}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-sm rounded-br-2xl"></div>
        </button>
    );
}