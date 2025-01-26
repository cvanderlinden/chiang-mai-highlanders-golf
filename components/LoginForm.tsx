// components/LoginForm.tsx

import { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface LoginFormProps {
    onClose: () => void;
    onLogin: (user: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        handicap: number
    }) => void;
}

export default function LoginForm({ onClose, onLogin }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                console.log('Received token:', token); // Debugging

                Cookies.set('token', token, { expires: 7 });

                const decodedToken = jwtDecode<{
                    userId: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    role: string;
                    handicap: number;
                }>(token);
                console.log('Decoded user data:', decodedToken); // Debugging

                // Pass all fields to onLogin
                onLogin({
                    userId: decodedToken.userId,
                    firstName: decodedToken.firstName,
                    lastName: decodedToken.lastName,
                    email: decodedToken.email,
                    role: decodedToken.role,
                    handicap: decodedToken.handicap, // Include handicap
                });

                onClose();
            } else {
                setError('Invalid email or password.');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-center text-darkGreen">Login</h2>
            {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                />
                <button
                    type="submit"
                    className="bg-darkGreen text-white py-3 px-6 rounded-md w-full hover:bg-gold transition-all duration-300 flex justify-center items-center"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
            <button onClick={onClose} className="mt-4 text-gray-500 text-sm text-center w-full">Cancel</button>
        </div>
    );
}
