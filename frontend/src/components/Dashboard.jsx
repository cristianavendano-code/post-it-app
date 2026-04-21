import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [newPostItModel, setNewPostItOpen] = useState(false);
    const navigate = useNavigate();

    // 1. MOTOR DE LECTURA (GET)
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
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Falla de telemetría:', error);
            }
        };
        fetchNotes();
    }, [navigate]);

    // 2. MOTOR DE INYECCIÓN (POST)
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
                body: JSON.stringify({ content: newContent })
            });

            if (response.ok) {
                const data = await response.json();
                // Corrección Crítica: Ensamblaje manual del objeto
                setNotes([...notes, { id: data.id, content: newContent }]);
                setNewContent('');
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Falla de inyección:', error);
        }
    };

    // Modificar nota
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
            }
        } catch (error) {
            console.error('Falla de actualización:', error);
        }
    };

    // 3. MOTOR DE ERRADICACIÓN (DELETE)
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

    // 4. PROTOCOLO DE EYECCIÓN
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className='min-h-screen bg-gray-900 p-8'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-bold text-white'>Panel Táctico</h1>
                <div className="gap-4 flex">
                    <button onClick={() => newPostItModel(true)} className='bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold'>
                        NUEVA UNIDAD
                    </button>
                    <button onClick={logout} className='bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold'>
                        ABORTAR (LOGOUT)
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {notes.map(note => (
                    <div key={note.id} className='bg-yellow-200 p-4 rounded shadow-lg text-black flex flex-col justify-between min-h-[150px] relative group'>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                        
                        {/* Botón de Erradicación Inyectado */}
                        <button 
                            onClick={() => handleDeleteNote(note.id)} 
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Destruir Unidad"
                        >
                            ✕
                        </button>

                        <button 
                            onClick={() => setIsModalOpen(true)}className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Modificar Unidad"
                        >
                            ✎
                        </button>
                    </div> 
                ))}
            </div>

            {newPostItModel && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'>
                    <div className='bg-gray-800 p-6 rounded shadow-lg w-96 border border-gray-600'>
                        <h2 className='text-xl text-white font-bold mb-4'>Parámetros de Inyección</h2>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className='w-full p-2 bg-gray-700 text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none'
                            placeholder='Escribe los datos aquí...' 
                            rows="4"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setNewPostItOpen(false)} className='bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded'>
                                CANCELAR
                            </button>
                            <button onClick={handleCreateNote} className='bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold'>
                                EJECUTAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}