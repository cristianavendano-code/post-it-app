import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PostIt from './PostIt';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [viewNewUser, setViewNewUser] = useState(false);
    const [viewLogin, setViewLogin] = useState(false);

    const handleLogin = async () => {

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
                navigate('/dashboard');
            } else {
                console.error("Rechazo de aduana:", data.error);
                alert(data.error || 'Falla de autenticación');
            }
        } catch (error) {
            console.error('Falla térmica en la red:', error);
        }
    };

    const handleNewUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuario registrado exitosamente. Por favor, inicia sesión.');
                setViewNewUser(false);
            } else {
                console.error("Error:", data.error);
                alert(data.error || 'Falla de registro');
            }
        } catch (error) {
            console.error('Falla térmica en la red:', error);
            alert('Falla de red. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-cover bg-[url(./assets/whitewall.jpg)] bg-green-700 p-4">
            <div className="flex w-full max-w-6xl aspect-video flex-col items-center justify-center bg-cover bg-[url(./assets/wooden-background.jpg)] p-6 md:p-10 shadow-xl/50">
                <div className="flex justify-center w-full h-full gap-20 items-center  bg-cover bg-[url(./assets/cork-board.jpg)] inset-shadow-sm inset-shadow-black">
                    <PostIt onClick={() => setViewLogin(true)} text="Log In" />
                    <PostIt onClick={() => setViewNewUser(true)} text="New User" />
                </div>
            </div>

            {viewLogin && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-yellow-400 p-8 shadow-xl/50 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] w-96 h-96 relative">
                        <button onClick={() => setViewLogin(false)} className="absolute top-2 right-4 text-red-400 font-bold">X</button>
                        <h2 className="text-black text-2xl font-bold mb-6">Log In</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 p-2 bg-yellow-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-6 p-2 bg-yellow-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button onClick={handleLogin} className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-4">
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {viewNewUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-yellow-400 p-8 shadow-xl/50 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] w-96 h-96 relative">
                        <button onClick={() => setViewNewUser(false)} className="absolute top-2 right-4 text-red-400 font-bold">X</button>
                        <h2 className="text-black text-2xl font-bold mb-6">Sign Up</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full mb-4 p-2 bg-yellow-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 p-2 bg-yellow-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-6 p-2 bg-yellow-400 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button onClick={handleNewUser} className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-4">
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
