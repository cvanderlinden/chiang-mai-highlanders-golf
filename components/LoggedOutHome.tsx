// components/LoggedOutHome.tsx

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Image from 'next/image';

interface LoggedOutHomeProps {
    onLogin: (user: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        handicap: number;
    }) => void;
}

export default function LoggedOutHome({ onLogin }: LoggedOutHomeProps) {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setShowLogin(false);
            setShowRegister(false);
            setIsAnimating(false);
        }, 500); // Match the duration with the animation duration
    };

    return (
        <div className="flex flex-col items-center justify-center mt-40">
            <Image
                src="/img/logo_2.png"
                alt="Chiang Mai Highlanders Golf Logo"
                width={96} // Explicit width (24 * 4 since `w-24` equals 96px)
                height={96} // Adjust as needed (set `auto` height with `layout="intrinsic"` if proportions must be preserved)
                className="mb-12" // Retain the margin class
                priority // Loads the image faster since it's likely above the fold
            />
            <h1 className="text-white text-6xl font-bold mb-8" style={{ fontFamily: 'Great Vibes, cursive' }}>
                Chiang Mai Highlanders Golf
            </h1>
            {!showLogin && !showRegister && (
                <div className="mt-6">
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLoginClick}
                            className="bg-darkGreen text-white py-3 px-10 rounded-md shadow-md font-medium hover:bg-gold hover:text-white hover:shadow-lg transition-all duration-300"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleRegisterClick}
                            className="bg-darkGreen text-white py-3 px-10 rounded-md shadow-md font-medium hover:bg-gold hover:text-white hover:shadow-lg transition-all duration-300"
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div className={`bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-500 ease-out ${isAnimating ? 'animate-fade-out-scale' : 'animate-fade-in-scale'}`}>
                        <LoginForm onClose={handleClose} onLogin={onLogin} />
                    </div>
                </div>
            )}
            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div className={`bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-500 ease-out ${isAnimating ? 'animate-fade-out-scale' : 'animate-fade-in-scale'}`}>
                        <RegisterForm onClose={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}
