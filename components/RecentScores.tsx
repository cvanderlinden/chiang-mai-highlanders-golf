// components/RecentScores.tsx

import { useState } from 'react';
import Card from '@/components/Card';

interface RecentScoresProps {
    userId: string;
    isAdmin: boolean;
    refresh: boolean;
    scores: any[];
    onHandicapUpdate?: (newHandicap: number) => void;
    onDeleteScore: (scoreId: string) => void;
}

export default function RecentScores({
                                        userId,
                                        isAdmin,
                                        refresh,
                                        scores,
                                        onHandicapUpdate,
                                         onDeleteScore,
                                    }: RecentScoresProps) {
    const [expanded, setExpanded] = useState(false);

    const handleDelete = async (scoreId: string) => {
        try {
            const response = await fetch('/api/scores/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scoreId, userId, isAdmin }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Score ${scoreId} deleted successfully`);
                onDeleteScore(scoreId); // Call the callback to update the parent state
                if (data.handicap !== undefined && onHandicapUpdate) {
                    onHandicapUpdate(data.handicap);
                }
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
            <div className="space-y-4">
                {scores.map((score, index) => {
                    const adjustedPar = score.holes === 9 ? Math.round(score.courseId.par / 2) : score.courseId.par;
                    const grossDifference = score.score - adjustedPar > 0
                        ? `+${score.score - adjustedPar}`
                        : `${score.score - adjustedPar}`;
                    const netDifference = score.netScore > 0 ? `+${score.netScore}` : `${score.netScore}`;
                    const netScoreDisplay = `${adjustedPar + score.netScore} (${netDifference})`;

                    return (
                        <div
                            key={score._id}
                            className={`p-4 rounded-md ${index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-700'} ${
                                score.userId?._id === userId ? 'font-bold text-gold' : 'text-white'
                            }`}
                        >
                            <p className="text-lg">
        <span className="font-semibold">
            {score.userId?.firstName || 'Unknown'} {score.userId?.lastName?.charAt(0) || ''}.
        </span>{' '}
                                @ <span className="italic">{score.course}</span> on{' '}
                                {new Date(score.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                            <p className="text-sm text-gray-300">
                                Shot a{' '}
                                <span className="text-gold font-bold">
                                    {score.score} ({grossDifference})
                                </span>{' '}
                                on {score.holes} holes with a handicap of{' '}
                                <span className="text-gold font-bold">{score.handicap}</span>, resulting in a net score of{' '}
                                <span className="text-gold font-bold">{netScoreDisplay}</span>.
                            </p>
                            {(isAdmin || score.userId?._id === userId) && (
                                <div className="mt-2">
                                    <button
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        onClick={() => handleDelete(score._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {scores.length > 10 && (
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