// components/RegisterForm.tsx

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FormProps {
    onClose: () => void;
}

export default function RegisterForm({ onClose }: FormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required.');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setError(null);
        setLoading(true);

        const newUser = { firstName, lastName, email, password, status: 'pending' };

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(onClose, 5000); // Automatically close the form after 5 seconds
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred during registration.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setError('An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <FontAwesomeIcon icon="check-circle" className="text-green-500 text-6xl mb-4" />
                <h2 className="text-2xl font-semibold text-darkGreen">Application Received</h2>
                <p className="mt-4 text-gray-700">
                    You will receive an email with further instructions once your account has been approved. Thank you.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-center text-darkGreen">Register</h2>
            {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                />
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
                    {loading ? <FontAwesomeIcon icon="spinner" spin /> : 'Register'}
                </button>
            </form>
            <button onClick={onClose} className="mt-4 text-gray-500 text-sm text-center w-full">Cancel</button>
        </div>
    );
}
