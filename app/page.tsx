// app/page.tsx

"use client";

import { useState, useEffect } from 'react';
import '@/lib/fontAwesome';
import PageBackground from '@/components/PageBackground';
import LoggedInHome from '@/components/LoggedInHome';
import LoggedOutHome from '@/components/LoggedOutHome';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ userId: string; firstName: string; lastName: string; email: string; role: string; handicap: number } | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');

        fetch('/api/admin/init').then((res) => {
            if (!res.ok) {
                console.error('Admin init failed');
            } else {
                console.log('Admin init succeeded or already exists.');
            }
        });

        if (token) {
            try {
                const decodedToken = jwtDecode<{ userId: string; firstName: string; lastName: string; email: string; role: string; handicap: number }>(token);
                setUser({
                    userId: decodedToken.userId,
                    firstName: decodedToken.firstName,
                    lastName: decodedToken.lastName,
                    email: decodedToken.email,
                    role: decodedToken.role,
                    handicap: decodedToken.handicap
                });
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error decoding token:', error); // Debugging
                Cookies.remove('token');
            }
        }
    }, []);

    const handleLogin = (loggedInUser: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        handicap: number;
    }) => {
        console.log('User logged in:', loggedInUser);
        setUser(loggedInUser);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        console.log('User logged out'); // Debugging
        Cookies.remove('token');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <PageBackground>
            <div className="flex flex-col flex-grow">
                {isLoggedIn ? (
                    <LoggedInHome user={user!} onLogout={handleLogout} />
                ) : (
                    <LoggedOutHome onLogin={handleLogin} />
                )}
            </div>
        </PageBackground>
    );
}
