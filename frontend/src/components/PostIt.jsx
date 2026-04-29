import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const postItRotations = ['-rotate-3', '-rotate-2', '-rotate-1', 'rotate-1', 'rotate-2', 'rotate-3'];

export default function PostIt({ id, text, onClick, isDraggable = false, textSize = "text-lg", onDelete, onTrashHover }) {
    const [rotation, setRotation] = useState('');
    const isDragging = useRef(false);

    useEffect(() => {
        const randomRotation = postItRotations[Math.floor(Math.random() * postItRotations.length)];
        setRotation(randomRotation);
    }, []);


    return (
        <motion.button
            onClick={(e) => {
                if (!isDragging.current) {
                    onClick(e);
                }
            }}

            drag={isDraggable}
            dragSnapToOrigin={true}

            dragElastic={0}
            dragMomentum={false}

            whileDrag={{ scale: 1.1, zIndex: 50 }}

            onDragStart={() => {
                isDragging.current = true;
            }}

            onDrag={(e, info) => {
                const trash = document.getElementById('basurero');
                if (trash && onTrashHover) {
                    const rect = trash.getBoundingClientRect();
                    const isOver = info.point.x >= rect.left && info.point.x <= rect.right && info.point.y >= rect.top && info.point.y <= rect.bottom;
                    onTrashHover(isOver);
                }
            }}

            onDragEnd={(e, info) => {
                if (onTrashHover) onTrashHover(false);

                e.target.style.visibility = 'hidden';
                const elementBelow = document.elementFromPoint(info.point.x, info.point.y);
                e.target.style.visibility = 'visible';

                if (elementBelow && elementBelow.closest('#basurero') && onDelete) {
                    onDelete(id);
                }

                setTimeout(() => {
                    isDragging.current = false;
                }, 100);
            }}

            className={`
                ${rotation}
                relative w-32 h-32 flex items-center justify-center 
                text-black font-semibold text-center p-2 wrapper-break-words
                ${textSize} overflow-hidden leading-tight font-hand
                shadow-[2px_4px_6px_rgba(0,0,0,0.25)] 
                bg-yellow-400 hover:bg-yellow-500
                ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
            `}
        >
            {text}
            <div className="absolute inset-0 bg-linear-to-br from-white/30 to-transparent pointer-events-none rounded-sm rounded-br-2xl"></div>
        </motion.button>
    );
}
