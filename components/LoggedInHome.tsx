// components/LoggedInHome.tsx

import { useState, useEffect } from 'react';
import HandicapCard from '@/components/HandicapCard';
import AdminPendingUsers from '@/components/AdminPendingUsers';
import UpcomingTeeOffs from '@/components/UpcomingTeeOffs';
import RecentScores from '@/components/RecentScores';
import Leaderboard from '@/components/Leaderboard';
import CourseManagement from '@/components/CourseManagement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface LoggedInHomeProps {
    user: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        handicap: number;
    };
    onLogout: () => void;
}

export const dynamic = 'force-dynamic';

export default function LoggedInHome({ user, onLogout }: LoggedInHomeProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    // Store the user in state so we can update the handicap locally
    const [currentUser, setCurrentUser] = useState(user);
    const [refresh, setRefresh] = useState(false);

    const triggerRefresh = () => setRefresh((prev) => !prev);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Bangkok',
        }).format(date);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Bangkok',
            hour12: false,
        }).format(date);
    };

    // Callback to update parent's handicap in state
    const handleHandicapUpdate = (newHandicap: number) => {
        // Merge the new handicap back into currentUser state
        setCurrentUser((prev) => ({
            ...prev,
            handicap: newHandicap,
        }));
    };

    return (
        <div className="max-w-screen-lg w-full mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <Image
                        src="/img/logo_2.png"
                        alt="Chiang Mai Highlanders Golf Logo"
                        width={56}
                        height={56}
                        priority
                    />
                    <h1
                        className="text-xl sm:text-2xl md:text-4xl font-bold text-white text-center"
                        style={{ fontFamily: "Great Vibes, cursive" }}
                    >
                        Chiang Mai Highlanders Golf
                    </h1>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-darkGreen text-white py-2 px-4 rounded-md hover:bg-gold transition-all duration-300 mt-4 sm:mt-0"
                >
                    Logout
                </button>
            </div>

            {/* Welcome Section */}
            <div className="text-white rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center sm:text-left">
                    <span style={{ fontFamily: "Great Vibes, cursive" }}>
                        Welcome, {user.firstName}
                    </span>
                </h2>
                <p className="text-sm sm:text-md md:text-lg text-gray-300 flex items-center mt-4 sm:mt-0">
                    <FontAwesomeIcon icon="calendar-alt" className="mr-2 text-gold" />
                    {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
                </p>
            </div>

            {/* Content */}
            <HandicapCard
                handicap={user.handicap}
                user={user}
                onScoreSubmit={() => {}}
                onHandicapUpdate={() => {}}
            />
            <UpcomingTeeOffs user={user} />
            <RecentScores userId={user.userId} isAdmin={user.role === "administrator"} refresh={false} onHandicapUpdate={() => {}} />
            <Leaderboard />
            {user.role === "administrator" && <CourseManagement />}
            <AdminPendingUsers />
        </div>
    );
}
