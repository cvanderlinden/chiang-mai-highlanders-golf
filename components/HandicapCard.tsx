// components/HandicapCard.tsx

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from "js-cookie";

interface Course {
    _id: string;
    name: string;
    par: number;
}

interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    handicap: number;
}

interface HandicapCardProps {
    handicap: number;
    user: User;
    onScoreSubmit: () => void;
    onHandicapUpdate?: (newHandicap: number) => void;
}

export default function HandicapCard({
                                         handicap,
                                         user,
                                         onScoreSubmit,
                                         onHandicapUpdate,
                                     }: HandicapCardProps) {
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState('');
    const [course, setCourse] = useState('');
    const [par, setPar] = useState(72);
    const [score, setScore] = useState('');
    const [netScore, setNetScore] = useState('');
    const [holes, setHoles] = useState(18);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses/list');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);

                    if (data.length > 0) {
                        setCourse(data[0]._id);
                        setPar(data[0].par || 72);
                        setScore(((data[0].par || 72) + handicap).toString());
                    }
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
        setDate(new Date().toISOString().split('T')[0]);
    }, [handicap]);

    useEffect(() => {
        if (score) {
            const gross = parseInt(score, 10);
            setNetScore((gross - handicap).toString());
        } else {
            setNetScore('');
        }
    }, [score, handicap]);

    useEffect(() => {
        const selectedCourse = courses.find((c) => c._id === course);
        const basePar = selectedCourse?.par || 72;
        const adjustedPar = holes === 9 ? basePar / 2 : basePar;

        setPar(adjustedPar);
        setScore((adjustedPar + handicap).toString());
    }, [course, holes, courses, handicap]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedCourse = courses.find((c) => c._id === course);

        if (!selectedCourse) {
            alert('Invalid course selected.');
            return;
        }

        const { par, courseRating, slopeRating } = selectedCourse;

        const grossScore = parseInt(score, 10);
        const netScoreValue = Math.round(grossScore - courseRating - (handicap * slopeRating / 113));

        const scoreData = {
            userId: user.userId,
            courseId: course,
            course: selectedCourse.name,
            date,
            score: grossScore,
            handicap: Number(handicap),
            netScore: netScoreValue,
            holes,
        };

        try {
            const response = await fetch('/api/scores/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreData),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log('Score created:', responseData.score);
                resetForm(true); // Reset and close the form
                await updateHandicap();
                onScoreSubmit();
            } else {
                console.error('Failed to create score:', responseData.message);
            }
        } catch (error) {
            console.error('Error during score creation:', error);
        }
    };

    const resetForm = (closeForm = false) => {
        setDate(new Date().toISOString().split('T')[0]);
        setCourse('');
        setScore('');
        setNetScore('');
        setPar(72);
        setHoles(18);

        if (closeForm) {
            setShowForm(false); // Close the form
        }
    };


    async function updateHandicap() {
        try {
            const response = await fetch('/api/users/update-handicap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Handicap updated:', data.handicap);
                Cookies.set('token', data.token, { expires: 30 });
                onHandicapUpdate?.(data.handicap);
            } else {
                console.error('Failed to update handicap:', data.message);
            }
        } catch (error) {
            console.error('Error updating handicap:', error);
        }
    }

    const calculateParDifference = (scoreVal: number, parVal: number) => {
        const difference = scoreVal - parVal;
        return difference > 0 ? `+${difference}` : `${difference}`;
    };

    return (
        <Card>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Current Handicap</h2>
                <button
                    className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                    onClick={() => {
                        if (showForm) {
                            resetForm(); // Reset the form if it's open
                        }
                        setShowForm((prev) => !prev); // Toggle the form
                    }}
                >
                    {showForm ? 'Cancel' : 'Add Score'}
                </button>
            </div>

            <p className="text-6xl text-gold font-bold">{handicap}</p>

            {showForm && (
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    {/* Course and Date Row */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-gray-300">Course</label>
                            <select
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                                required
                            >
                                <option value="">Select course...</option>
                                {courses.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="text-sm font-semibold text-gray-300">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                                required
                            />
                        </div>
                    </div>

                    {/* Conditional Fields After Course Selection */}
                    {course && (
                        <>
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-gray-300">Hole Selection</label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        type="button"
                                        className={`py-2 px-4 rounded-md focus:outline-none ${
                                            holes === 9 ? 'bg-gold text-darkGreen' : 'bg-gray-700 text-white'
                                        }`}
                                        onClick={() => setHoles(9)}
                                    >
                                        9 Holes
                                    </button>
                                    <button
                                        type="button"
                                        className={`py-2 px-4 rounded-md focus:outline-none ${
                                            holes === 18 ? 'bg-gold text-darkGreen' : 'bg-gray-700 text-white'
                                        }`}
                                        onClick={() => setHoles(18)}
                                    >
                                        18 Holes
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {/* Score Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-center text-gray-300">Score</label>
                                    <div className="relative flex items-center">
                                        <button
                                            type="button"
                                            className="absolute left-0 text-gold px-3 hover:text-white"
                                            onClick={() =>
                                                setScore((prev) => {
                                                    const curr = parseInt(prev || '0', 10);
                                                    return curr > 1 ? (curr - 1).toString() : '1';
                                                })
                                            }
                                        >
                                            <FontAwesomeIcon icon="minus"/>
                                        </button>
                                        <input
                                            type="number"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                            className="w-full h-14 text-center bg-transparent text-gold font-bold text-4xl focus:outline-none mx-12"
                                            placeholder="Score"
                                            required
                                            min={1}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-0 text-gold px-3 hover:text-white"
                                            onClick={() =>
                                                setScore((prev) => {
                                                    const curr = parseInt(prev || '0', 10);
                                                    return (curr + 1).toString();
                                                })
                                            }
                                        >
                                            <FontAwesomeIcon icon="plus"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Course Par */}
                                <div>
                                    <label className="block text-sm font-semibold text-center text-gray-300">Course Par</label>
                                    <p className="h-14 flex items-center justify-center text-4xl font-bold text-gold">{par}</p>
                                </div>

                                {/* +/- Par */}
                                <div>
                                    <label className="block text-sm font-semibold text-center text-gray-300">+/- Par</label>
                                    <p className="h-14 flex items-center justify-center text-4xl font-bold text-gold">
                                        {score ? calculateParDifference(parseInt(score, 10), par) : '-'}
                                    </p>
                                </div>

                                {/* Net Score */}
                                <div>
                                    <label className="block text-sm font-semibold text-center text-gray-300">Net Score</label>
                                    <p className="h-14 flex items-center justify-center text-4xl text-gold font-bold">
                                        {netScore || '-'}
                                    </p>
                                </div>
                            </div>

                        </>
                    )}

                    {/* Submit Button */}
                    {course && (
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </form>
            )}
        </Card>
    );
}


