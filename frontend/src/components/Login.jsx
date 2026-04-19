import { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log("Pasaporte Criptográfico Guardado:", data.token);
                alert('Enlace confirmado. Token guardado en localStorage.');
            } else{
                console.error("Rechazo de aduana:", data.error);
                alert(data.error ||  'Falla de autenticación');
            }
        } catch (error) {
            console.error('Falla térmica en la red:', error);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded shadow-md w-96">
                <h2 className="text-white text-2xl font-bold mb-6">Acceso Táctico</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          INICIAR IGNICIÓN
        </button>
            </form>
        </div>
    );
}
