// components/RecentScores.tsx

import { useEffect, useState } from 'react';
import Card from '@/components/Card';

interface Score {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    course: string;
    score: number;
    handicap: number;
    netScore: number;
    holes: number;
    date: string;
    courseId: {
        _id: string;
        par: number;
    };
}

interface RecentScoresProps {
    userId: string;
    isAdmin: boolean;
    refresh: boolean;
    onHandicapUpdate?: (newHandicap: number) => void;
}

const calculateGrossScoreDifference = (score: number, par: number) => {
    const difference = score - par;
    return difference > 0 ? `+${difference}` : `${difference}`;
};

const calculateNetScoreDisplay = (netScore: number, par: number) => {
    const netScoreAdjusted = par + netScore; // Add netScore to par
    const difference = netScore > 0 ? `+${netScore}` : `${netScore}`; // Format difference
    return `${netScoreAdjusted} (${difference})`; // Final display value
};

export default function RecentScores({ userId, isAdmin, refresh, onHandicapUpdate }: RecentScoresProps) {
    const [scores, setScores] = useState<Score[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [totalScores, setTotalScores] = useState(0);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const limit = expanded ? 50 : 10;
                const response = await fetch(`/api/scores/list?limit=${limit}`);
                const { scores, totalScores } = await response.json();

                if (response.ok) {
                    setScores(scores);
                    setTotalScores(totalScores);
                } else {
                    console.error('Failed to fetch scores');
                }
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        };

        fetchScores();
    }, [refresh, expanded]);

    const handleDelete = async (scoreId: string) => {
        try {
            const response = await fetch('/api/scores/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scoreId, userId, isAdmin }),
            });

            const data = await response.json();
            if (response.ok) {
                setScores((prevScores) => prevScores.filter((score) => score._id !== scoreId));
                if (data.handicap !== undefined && onHandicapUpdate) {
                    onHandicapUpdate(data.handicap);
                }
                console.log(`Score ${scoreId} deleted successfully`);
            } else {
                console.error('Failed to delete score:', data.message);
            }
        } catch (error) {
            console.error('Error deleting score:', error);
        }
    };

    return (
        <Card>
            <h3 className="text-2xl font-semibold text-white mb-4">Recent Scores</h3>
            <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-gray-300 mb-2">
                <div>Name</div>
                <div>Course</div>
                <div>Score</div>
                <div>Handicap</div>
                <div>Net Score</div>
                <div>Holes</div>
                <div>Date</div>
                {isAdmin && <div>Action</div>}
            </div>
            <div className="space-y-2">
                {scores.map((score, index) => {
                    const adjustedPar =
                        score.holes === 9 ? Math.round(score.courseId.par / 2) : score.courseId.par;

                    const grossDifference = calculateGrossScoreDifference(score.score, adjustedPar);
                    const netScoreDisplay = calculateNetScoreDisplay(score.netScore, adjustedPar);

                    return (
                        <div
                            key={score._id}
                            className={`grid grid-cols-8 gap-4 p-2 rounded-md ${
                                index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : ''
                            } ${
                                score.userId._id === userId ? 'font-bold text-gold' : 'text-white'
                            }`}
                        >
                            <div>
                                {score.userId.firstName} {score.userId.lastName.charAt(0)}.
                            </div>
                            <div>{score.course}</div>
                            <div>
                                {score.score} ({grossDifference})
                            </div>
                            <div>{score.handicap}</div>
                            <div>{netScoreDisplay}</div>
                            <div>{score.holes}</div>
                            <div>
                                {new Date(score.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </div>
                            {(isAdmin || score.userId._id === userId) && (
                                <div>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDelete(score._id)}
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {totalScores > scores.length && (
                <div className="text-center mt-4">
                    <button
                        className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? 'Show Less' : 'Expand'}
                    </button>
                </div>
            )}
        </Card>
    );
}