import { useState, useEffect } from 'react';

interface AddTeeOffFormProps {
    onAdd: (teeOffData: { course: string; date: string; time: string }) => void;
    onCancel: () => void;
}

interface Course {
    _id: string;
    name: string;
}

export const dynamic = 'force-dynamic';

export default function AddTeeOffForm({ onAdd, onCancel }: AddTeeOffFormProps) {
    const [course, setCourse] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const [courses, setCourses] = useState<Course[]>([]);
    const [errors, setErrors] = useState<{ course?: string; date?: string; time?: string }>({});

    // Fetch available courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses/list');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                    setCourse(data[0]?._id || '');
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    // Calculate the default date as today plus two days
    useEffect(() => {
        const today = new Date();
        const defaultDate = new Date(today.setDate(today.getDate() + 2));
        const isoDate = defaultDate.toISOString().split('T')[0];
        setDate(isoDate);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form fields
        let formErrors = {};
        if (!course) formErrors = { ...formErrors, course: 'Course is required' };
        if (!date) {
            formErrors = { ...formErrors, date: 'Date is required' };
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            if (selectedDate < today) {
                formErrors = { ...formErrors, date: 'Date must be in the future' };
            }
        }
        if (!time) formErrors = { ...formErrors, time: 'Time is required' };

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Clear errors and submit the form
        setErrors({});
        onAdd({ course, date, time });
    };

    return (
        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">
                        Course
                    </label>
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                    >
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                    {errors.course && (
                        <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                    )}
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]} // Restrict to today and future dates
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                    />
                    {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">
                        Time
                    </label>
                    <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                    >
                        {Array.from({ length: 48 }, (_, i) => {
                            const hour = Math.floor(i / 4) + 6;
                            const minutes = (i % 4) * 15;
                            const timeValue = `${hour.toString().padStart(2, '0')}:${minutes
                                .toString()
                                .padStart(2, '0')}`;
                            return (
                                <option key={timeValue} value={timeValue}>
                                    {timeValue}
                                </option>
                            );
                        })}
                    </select>
                    {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    type="submit"
                    className="bg-gold text-darkGreen py-2 px-6 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                >
                    Add
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-all duration-300"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
