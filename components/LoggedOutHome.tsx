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
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 space-y-6 relative">
            <Image
                src="/img/logo_2.png"
                alt="Chiang Mai Highlanders Golf Logo"
                width={96}
                height={96}
                className="mb-8"
                priority
            />
            <h1
                className="text-3xl sm:text-4xl md:text-5xl text-white text-center"
                style={{ fontFamily: "Great Vibes, cursive" }}
            >
                Chiang Mai Highlanders Golf
            </h1>
            {/* Always render the buttons */}
            <div
                className={`mt-6 transition-opacity duration-300 ${
                    showLogin || showRegister ? 'opacity-50 pointer-events-none' : 'opacity-100'
                }`}
            >
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={handleLoginClick}
                        className="bg-darkGreen text-white py-3 px-6 rounded-md shadow-md font-medium hover:bg-gold hover:text-white hover:shadow-lg transition-all duration-300"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleRegisterClick}
                        className="bg-darkGreen text-white py-3 px-6 rounded-md shadow-md font-medium hover:bg-gold hover:text-white hover:shadow-lg transition-all duration-300"
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Modal for Login */}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div
                        className={`bg-white p-8 mx-4 sm:mx-6 md:mx-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-500 ease-out ${
                            isAnimating ? "animate-fade-out-scale" : "animate-fade-in-scale"
                        }`}
                    >
                        <LoginForm onClose={handleClose} onLogin={onLogin} />
                    </div>
                </div>
            )}

            {/* Modal for Register */}
            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div
                        className={`bg-white p-8 mx-4 sm:mx-6 md:mx-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-500 ease-out ${
                            isAnimating ? "animate-fade-out-scale" : "animate-fade-in-scale"
                        }`}
                    >
                        <RegisterForm onClose={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}
