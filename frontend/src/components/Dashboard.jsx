import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard () {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/postits', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotes(data);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error al obtener notas:', error);
            }
        };

        fetchNotes();
    }, [navigate]);

    return (
        <div className='min-h-screen bg-gray-900 p-8'>
            <h1 className='text-white text-3xl font-bold mb-6'>Panel de control</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {notes.map(note => (
                    <div key={note.id} className='bg-yellow-200 p-4 rounded shadow text-black'>
                        <p>{note.content}</p>
                    </div> 
                ))}
            </div>
        </div>
    );
}