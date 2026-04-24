import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostIt from './PostIt';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [viewNewNote, setViewNewNote] = useState(false);
    const [viewEditNote, setViewEditNote] = useState(null);
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
                console.error('Falla de telemetría:', error);
            }
        };
        fetchNotes();
    }, [navigate]);

    const handleCreateNote = async () => {
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
                setNotes(notes.filter(note => note.id !== id));
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
        <div className="flex h-screen w-full items-center justify-center bg-cover bg-[url(./assets/whitewall.jpg)] bg-green-700 p-4">
            <div className="flex w-full max-w-6xl aspect-video flex-col items-center justify-center bg-cover bg-[url(./assets/wooden-background.jpg)] p-6 md:p-10 shadow-xl/50">
                <div className="w-full h-full p-8 md:p-12 bg-cover bg-[url(./assets/cork-board.jpg)] inset-shadow-sm inset-shadow-black overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-start">
                        {notes.map(note => (
                            <PostIt 
                                key={note.id} 
                                text={note.content}
                                onClick={() => {
                                    setViewEditNote(note.id);
                                    setContent(note.content);
                                }} 
                            />
                        ))}
                    </div>
                </div>
                <button 
                    onClick={() => setViewNewNote(true)} 
                    className="
                        absolute bottom-8 left-8
                        w-32 h-32 flex items-center justify-center 
                        text-black font-semibold text-4xl
                        shadow-[2px_4px_6px_rgba(0,0,0,0.25)] 
                        transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-10
                        bg-yellow-400 hover:bg-yellow-500
                    "
                >+</button>
                
            </div>


            {viewEditNote !== null && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-yellow-400 p-8 shadow-xl/50 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] w-96 h-96 relative">
                        <button onClick={() => setViewEditNote(null)} className="absolute top-2 right-4 text-red-400 font-bold">X</button>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className='w-full p-2 bg-yellow-400 text-black mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none'
                            placeholder='Escribe los datos aquí...' 
                            rows="4"
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => handleUpdateNote(viewEditNote, content)} 
                                className='w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-4'>
                                Rewrite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewNewNote && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-yellow-400 p-8 shadow-xl/50 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] w-96 h-96 relative">
                        <button onClick={() => setViewNewNote(false)} className="absolute top-2 right-4 text-red-400 font-bold">X</button>
                        <textarea
                            className='w-full p-2 bg-yellow-400 text-black mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none'
                            placeholder='Escribe los datos aquí...' 
                            rows="4"
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => handleCreateNote(viewNewNote, content)} 
                                className='w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-4'>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}