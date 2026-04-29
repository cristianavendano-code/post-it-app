import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostIt from './PostIt';
import paperBasketImg from '../assets/paper-basket.png';

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

                <button
                    onClick={logout}
                    className="fixed bottom-15 right-58 w-28 h-10 flex items-center justify-center transition-transform duration-200 hover:scale-105 group z-40 drop-shadow-md cursor-pointer"
                >
                    <svg viewBox="0 0 120 40" className="absolute inset-0 w-full h-full">
                        <polygon
                            points="0,0 120,0 105,20 120,40 0,40"
                            fill="#e53d3d"
                        />
                        <polygon
                            points="4,4 112,4 99,20 112,36 4,36"
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="1.5"
                            strokeDasharray="6, 4"
                        />
                    </svg>
                    <span className="relative z-10 font-hand text-xl font-bold text-black pr-4 tracking-wider">
                        Logout
                    </span>
                </button>

                <div
                    id="basurero"
                    className={`
                        fixed bottom-2 right-4
                        w-45 h-45 flex flex-col items-center justify-center transition-transform duration-300
                        ${isTrashOpen ? 'scale-110 drop-shadow-2xl' : 'scale-100 drop-shadow-md'}
                    `}
                >
                    <img 
                        src={paperBasketImg}
                        alt="Paper Basket"
                        className="w-full h-full object-contain pointer-events-none"
                    />
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