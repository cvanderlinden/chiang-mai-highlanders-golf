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
      <div className="w-[64em] mx-auto p-8 space-y-6">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-4">
            <Image
              src="/img/logo_2.png"
              alt="Chiang Mai Highlanders Golf Logo"
              width={48}
              height={48}
              priority
            />
            <h1
              className="text-lg sm:text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              Chiang Mai Highlanders Golf
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="bg-darkGreen text-white py-2 px-4 rounded-md hover:bg-gold transition-all duration-300"
          >
            Logout
          </button>
        </div>

        <div className="text-white rounded-lg mb-8 flex justify-between items-baseline">
          <h2 className="text-5xl font-bold">
            <span style={{ fontFamily: "Great Vibes, cursive" }}>
              Welcome, {currentUser.firstName}
            </span>
          </h2>
          <p className="text-md text-gray-300 flex items-baseline ml-8">
            <FontAwesomeIcon icon="calendar-alt" className="mr-2 text-gold" />
            {formatDate(currentTime)}
            <FontAwesomeIcon icon="clock" className="ml-2 mr-2 text-gold" />
            {formatTime(currentTime)}
          </p>
        </div>

        <HandicapCard
          handicap={currentUser.handicap}
          user={currentUser}
          onScoreSubmit={triggerRefresh}
          onHandicapUpdate={handleHandicapUpdate}
        />

        <UpcomingTeeOffs user={currentUser} />
        <RecentScores
          userId={currentUser.userId}
          isAdmin={currentUser.role === "administrator"}
          refresh={refresh}
          onHandicapUpdate={handleHandicapUpdate}
        />
        <Leaderboard />
        {currentUser.role === "administrator" && <CourseManagement />}
        <AdminPendingUsers />
      </div>
    );
}
