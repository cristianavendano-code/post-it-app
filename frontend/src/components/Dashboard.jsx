import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostIt from './PostIt';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [viewNewNote, setViewNewNote] = useState(false);
    const [viewEditNote, setViewEditNote] = useState(null);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const response = await fetch('http://localhost:3000/api/postits', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotes(data);
                } else {
                    console.log('No hay notas para mostrar');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchNotes();
    }, [navigate]);

    const handleCreateNote = async () => {
        if (notes.length >= 18) {
            alert("Tablero lleno.");
            setViewNewNote(false);
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const response = await fetch('http://localhost:3000/api/postits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: content })
            });

            if (response.ok) {
                const data = await response.json();
                setNotes([...notes, { id: data.id, content: content }]);
                setContent('');
                setViewNewNote(false);
            }
        } catch (error) {
            console.error('Falla de inyección:', error);
        }
    };

    const handleUpdateNote = async (id, updatedContent) => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const response = await fetch(`http://localhost:3000/api/postits/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: updatedContent })
            });

            if (response.ok) {
                setNotes(notes.map(note => note.id === id ? { ...note, content: updatedContent } : note));
                setViewEditNote(null);
            }
        } catch (error) {
            console.error('Falla de actualización:', error);
        }
    };

    const handleDeleteNote = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const response = await fetch(`http://localhost:3000/api/postits/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Purga matemática de la memoria visual
                setNotes(prevNotes => prevNotes.filter(note => String(note.id) !== String(id)));
            }
        } catch (error) {
            console.error('Falla de erradicación:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="relative flex h-screen w-screen overflow-hidden items-center justify-center bg-cover bg-[url(./assets/whitewall.jpg)] bg-green-700 p-4">
            <div className="flex w-full max-w-6xl aspect-video flex-col items-center justify-center bg-cover bg-[url(./assets/wooden-background.jpg)] p-6 md:p-10 shadow-xl/50">
                <div className="w-full h-full p-8 md:p-12 bg-cover bg-[url(./assets/cork-board.jpg)] inset-shadow-sm inset-shadow-black">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-start">
                        {notes.map(note => (
                            <PostIt
                                key={note.id}
                                id={note.id}
                                text={note.content}
                                isDraggable={true}
                                onDelete={handleDeleteNote}
                                onTrashHover={setIsTrashOpen}
                                textSize="text-sm md:text-lg"
                                onClick={() => {
                                    setViewEditNote(note.id);
                                    setContent(note.content);
                                }}
                            />
                        ))}
                    </div>
                </div>
                {notes.length < 18 && (
                    <button
                        onClick={() => {
                            setContent('');
                            setViewNewNote(true);
                        }}
                        className="fixed bottom-8 left-8 w-32 h-32 flex items-center justify-center text-black font-semibold text-4xl shadow-[2px_4px_6px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-10 bg-yellow-400 hover:bg-yellow-500 z-40"
                    >
                        +
                    </button>
                )}
                <div
                    id="basurero"
                    className={`
                        fixed bottom-0 right-2
                        w-50 h-50 flex flex-col items-center justify-center transition-colors duration-300
                    `}
                >
                    <motion.svg
                        viewBox="0 0 100 100"
                        className="w-50 h-50"
                        animate={{
                            rotate: isTrashOpen ? [0, -5, 5, -5, 5, 0] : 0,
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <defs>
                            <pattern id="wire-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
                                <path d="M0,0 L6,6 M6,0 L0,6" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                            </pattern>
                            <linearGradient id="bin-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
                                <stop offset="30%" stopColor="rgba(0,0,0,0.1)" />
                                <stop offset="70%" stopColor="rgba(0,0,0,0.1)" />
                                <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
                            </linearGradient>
                        </defs>
                        <ellipse cx="50" cy="20" rx="35" ry="10" fill="rgba(0,0,0,0.8)" />
                        <path d="M 15,20 L 30,90 A 20 6 0 0 0 70,90 L 85,20 Z" fill="url(#wire-mesh)" />
                        <path d="M 15,20 L 30,90 A 20 6 0 0 0 70,90 L 85,20 Z" fill="url(#bin-shadow)" />
                        <ellipse cx="50" cy="90" rx="20" ry="6" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path d="M 15,20 A 35 10 0 0 0 85,20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 15,20 A 35 10 0 0 1 85,20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    </motion.svg>
                </div>

            </div>


            {viewEditNote !== null && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-yellow-400 p-6 md:p-8 shadow-xl/50 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] w-96 h-96 relative flex flex-col">
                        <button onClick={() => setViewEditNote(null)} className="absolute top-3 right-4 text-red-500 font-extrabold hover:text-red-700">X</button>
                        <div className="relative grow flex flex-col mb-2 mt-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={80}
                                className='font-hand text-3xl w-full h-full p-2 pb-8 bg-yellow-400 text-black font-medium focus:outline-none resize-none'
                                placeholder='Write here...'
                            />
                            <span className={`absolute bottom-0 right-2 text-sm font-bold ${content.length === 80 ? 'text-red-600' : 'text-black/50'}`}>
                                {content.length}/80
                            </span>
                        </div>

                        <div className="flex justify-center mt-auto">
                            <button
                                onClick={() => handleUpdateNote(viewEditNote, content)}
                                className='w-full border border-yellow-400 text-yellow-800 hover:text-yellow-100 font-semibold py-1 px-4 transition-colors duration-200'>
                                Rewrite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewNewNote && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-yellow-400 p-6 md:p-8 shadow-xl/50 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] w-96 h-96 relative flex flex-col">
                        <button onClick={() => setViewNewNote(false)} className="absolute top-3 right-4 text-red-500 font-extrabold hover:text-red-700">X</button>
                        <div className="relative grow flex flex-col mb-2 mt-4">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={80}
                                className='font-hand text-3xl w-full h-full p-2 pb-8 bg-yellow-400 text-black font-medium focus:outline-none resize-none'
                                placeholder='Write here...'
                            />
                            <span className={`absolute bottom-0 right-2 text-sm font-bold ${content.length === 80 ? 'text-red-600' : 'text-black/50'}`}>
                                {content.length}/80
                            </span>
                        </div>

                        <div className="flex justify-center mt-auto">
                            <button
                                onClick={handleCreateNote}
                                className='w-full border border-yellow-400 text-yellow-800 hover:text-yellow-100 font-semibold py-1 px-4 transition-colors duration-200'>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}