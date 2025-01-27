import { useState, useEffect } from 'react';
import Card from '@/components/Card';

export const dynamic = 'force-dynamic';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard');
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            } else {
                console.error('Failed to fetch leaderboard');
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <h3 className="text-2xl font-semibold text-white mb-4">Leaderboard</h3>
            {loading ? (
                <p className="text-gray-300">Loading...</p>
            ) : (
                <div>
                    <div className="grid grid-cols-[40px_1fr_1fr_1fr] md:grid-cols-[40px_1fr_1fr_1fr_1fr] gap-4 text-sm font-semibold text-gray-300 mb-2">
                        <div className="text-center">#</div>
                        <div>Name</div>
                        <div>Rounds Played</div>
                        {/* Hide Best Round on smaller screens */}
                        <div className="hidden md:block">Best Score</div>
                        <div>Handicap</div>
                    </div>
                    <div className="space-y-2">
                        {leaderboard.map((entry, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-[40px_1fr_1fr_1fr] md:grid-cols-[40px_1fr_1fr_1fr_1fr] gap-4 p-2 rounded-md ${
                                    index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : ''
                                }`}
                            >
                                <div className="text-gray-300 font-semibold text-center">{index + 1}</div>
                                <div className="text-gold font-semibold">{entry.name}</div>
                                <div className="text-gray-300">{entry.totalRounds}</div>
                                {/* Conditional Best Round display */}
                                <div className="hidden md:block text-gray-300">
                                    {entry.bestScore
                                        ? `${entry.bestScore} (${entry.bestCourseName ?? 'N/A'})`
                                        : 'N/A'}
                                </div>
                                <div className="text-gold font-bold text-xl">{entry.handicap}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
