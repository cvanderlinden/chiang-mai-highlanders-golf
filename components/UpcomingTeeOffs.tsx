import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/Card';
import AddTeeOffForm from '@/components/AddTeeOffForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

interface UpcomingTeeOffsProps {
    user: { userId: string; firstName: string; lastName: string | undefined };
}

export const dynamic = 'force-dynamic';

export default function UpcomingTeeOffs({ user }: UpcomingTeeOffsProps) {
    const [showForm, setShowForm] = useState(false);
    const [teeOffs, setTeeOffs] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTeeOffs = useCallback(async () => {
        try {
            const response = await fetch(`/api/tee-offs/list?page=${page}&limit=10`);
            if (response.ok) {
                const { teeOffs, totalPages } = await response.json();
                setTeeOffs(teeOffs);
                setTotalPages(totalPages);
            } else {
                console.error('Failed to fetch tee-off times');
            }
        } catch (error) {
            console.error('Error fetching tee-off times:', error);
        }
    }, [page]);

    useEffect(() => {
        fetchTeeOffs();
    }, [fetchTeeOffs]);

    const handleAddTeeOff = async (teeOffData: { course: string; date: string; time: string }) => {
        const lastNameInitial = user.lastName ? `${user.lastName.charAt(0).toUpperCase()}.` : '';
        const golferName = `${user.firstName} ${lastNameInitial}`.trim();

        try {
            const response = await fetch('/api/tee-offs/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...teeOffData,
                    createdBy: user.userId,
                    golfers: [
                        {
                            userId: user.userId,
                            name: golferName,
                        },
                    ],
                }),
            });

            if (response.ok) {
                await fetchTeeOffs();
                setShowForm(false);
            } else {
                console.error('Failed to add new tee-off time');
            }
        } catch (error) {
            console.error('Error adding tee-off time:', error);
        }
    };

    const handleAddSelf = async (teeOffId: string) => {
        const lastNameInitial = user.lastName ? `${user.lastName.charAt(0).toUpperCase()}.` : '';
        const golferName = `${user.firstName} ${lastNameInitial}`.trim();

        setTeeOffs((prev) =>
            prev.map((teeOff) =>
                teeOff._id === teeOffId
                    ? { ...teeOff, golfers: [...teeOff.golfers, { userId: user.userId, name: golferName }] }
                    : teeOff
            )
        );

        try {
            const response = await fetch(`/api/tee-offs/add-golfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teeOffId,
                    golfer: {
                        userId: user.userId,
                        name: golferName,
                    },
                }),
            });

            if (!response.ok) {
                console.error('Failed to add self to tee-off time');
                await fetchTeeOffs();
            }
        } catch (error) {
            console.error('Error adding self to tee-off time:', error);
        }
    };

    const handleRemoveGolfer = async (teeOffId: string, userId: string) => {
        setTeeOffs((prev) =>
            prev.map((teeOff) =>
                teeOff._id === teeOffId
                    ? { ...teeOff, golfers: teeOff.golfers.filter((golfer: any) => golfer.userId !== userId) }
                    : teeOff
            )
        );

        try {
            const response = await fetch(`/api/tee-offs/remove-golfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teeOffId, userId }),
            });

            if (!response.ok) {
                console.error('Failed to remove golfer');
                await fetchTeeOffs();
            }
        } catch (error) {
            console.error('Error removing golfer:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = dayjs.tz(dateString, 'Asia/Bangkok');
        return date.format('dddd, MMMM D, YYYY');
    };

    return (
        <Card>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="text-2xl font-semibold text-white">Upcoming Tee Off Times</h3>
                <button
                    className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                    onClick={() => setShowForm((prev) => !prev)}
                >
                    {showForm ? 'Cancel' : 'Add Tee Off Time'}
                </button>
            </div>

            {showForm && <AddTeeOffForm onAdd={handleAddTeeOff} onCancel={() => setShowForm(false)} />}

            <div className="space-y-4 mt-4">
                {teeOffs.length === 0 ? (
                    <p className="text-gray-400 text-center">No upcoming tee-offs. Be the first to schedule one!</p>
                ) : (
                    teeOffs.map((teeOff, index) => {
                        const isUserInTeeOff = (teeOff.golfers || []).some(
                            (golfer: any) => golfer.userId._id === user.userId
                        );

                        return (
                            <div key={index} className="pb-4 border-b border-gray-600">
                                <p className="text-2xl font-bold text-white">{teeOff.courseId?.name || teeOff.course}</p>
                                <p className="text-gray-300 mt-2">
                                    <FontAwesomeIcon icon="calendar-alt" className="mr-2 text-gold"/>
                                    {formatDate(teeOff.date)}
                                    <FontAwesomeIcon icon="clock" className="ml-2 mr-2 text-gold"/>
                                    {teeOff.time}
                                </p>
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 items-stretch">
                                    {(teeOff.golfers || []).map((golfer: any, golferIndex: number) => (
                                        <div
                                            key={golferIndex}
                                            className="flex items-center space-x-2 bg-[#ffffff24] rounded-md p-3 sm:p-2 min-w-0"
                                        >
                                            <FontAwesomeIcon icon="golf-ball-tee" className="text-gold"/>
                                            <p className="text-gray-300 truncate">{golfer.name}</p>
                                            {golfer.userId._id === user.userId && (
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleRemoveGolfer(teeOff._id, golfer.userId._id)}
                                                >
                                                    <FontAwesomeIcon icon="times"/>
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {!isUserInTeeOff && (
                                        <div
                                            className="flex items-center space-x-2 bg-[#ffffff24] rounded-md p-3 sm:p-2 min-w-0">
                                            <FontAwesomeIcon icon="golf-ball-tee" className="text-gold"/>
                                            <button
                                                className="bg-gold text-darkGreen py-1 w-full rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                                                onClick={() => handleAddSelf(teeOff._id)}
                                            >
                                                Join
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>


            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        className="px-4 py-2 bg-gray-700 text-white rounded-l-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-800 text-white">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        className="px-4 py-2 bg-gray-700 text-white rounded-r-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </Card>
    );
}
