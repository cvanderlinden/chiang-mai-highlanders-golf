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
    const [currentUser, setCurrentUser] = useState(user); // User state for updated handicap
    const [scores, setScores] = useState<any[]>([]); // State to hold the recent scores
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchInitialScores = async () => {
            try {
                const response = await fetch('/api/scores/list?limit=10'); // Default limit
                if (response.ok) {
                    const data = await response.json();
                    setScores(data.scores); // Populate initial scores
                } else {
                    console.error('Failed to fetch initial scores');
                }
            } catch (error) {
                console.error('Error fetching initial scores:', error);
            }
        };

        fetchInitialScores(); // Call on mount
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const triggerRefresh = () => setRefresh((prev) => !prev);

    const handleHandicapUpdate = (newHandicap: number) => {
        setCurrentUser((prev) => ({
            ...prev,
            handicap: newHandicap,
        }));
    };

    const addNewScore = async (newScoreId: string) => {
        try {
            // Fetch the newly created score with populated user and course data
            const response = await fetch(`/api/scores/get?id=${newScoreId}`);
            const { score } = await response.json();

            if (response.ok && score) {
                setScores((prevScores) => [score, ...prevScores]); // Prepend the populated score
            } else {
                console.error('Failed to fetch populated score:', score);
            }
        } catch (error) {
            console.error('Error fetching populated score:', error);
        }
    };

    const deleteScore = (scoreId: string) => {
        setScores((prevScores) => prevScores.filter((score) => score._id !== scoreId));
    };

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
                        style={{fontFamily: "Great Vibes, cursive"}}
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
                    <span style={{fontFamily: "Great Vibes, cursive"}}>
                        Welcome, {user.firstName}
                    </span>
                </h2>
                <p className="text-sm sm:text-md md:text-lg text-gray-300 flex items-center mt-4 sm:mt-0">
                    <FontAwesomeIcon icon="calendar-alt" className="mr-2 text-gold"/>
                    {new Date().toLocaleDateString("en-US", {dateStyle: "full"})}
                </p>
            </div>

            {/* Content */}
            <HandicapCard
                handicap={currentUser.handicap}
                user={currentUser}
                onScoreSubmit={triggerRefresh}
                onHandicapUpdate={handleHandicapUpdate}
                addNewScore={addNewScore}
            />
            <UpcomingTeeOffs user={currentUser}/>
            <RecentScores
                userId={currentUser.userId}
                isAdmin={currentUser.role === "administrator"}
                refresh={refresh}
                scores={scores} // Pass scores to RecentScores
                onHandicapUpdate={handleHandicapUpdate}
                onDeleteScore={deleteScore}
            />
            <Leaderboard/>
            {currentUser.role === "administrator" && <CourseManagement/>}
            <AdminPendingUsers/>
        </div>
    );
}