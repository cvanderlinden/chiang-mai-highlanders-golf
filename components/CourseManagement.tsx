import { useState, useEffect } from 'react';
import Card from '@/components/Card';

interface Course {
    _id: string;
    name: string;
    slopeRating: number;
    courseRating: number;
    par: number;
    mapLink: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface CourseManagementProps {
    user: { role: string }; // Assuming role is passed to determine if the user is an admin
}

export default function CourseManagement() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [newCourse, setNewCourse] = useState({ name: '', slopeRating: '113', courseRating: '72', par: '72', mapLink: '' });
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showCourses, setShowCourses] = useState(false); // State to toggle course listing

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await fetch('/api/courses/list');
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                console.error('Failed to fetch courses');
            }
        };

        fetchCourses();
    }, []);

    const handleAddCourse = async () => {
        const response = await fetch("/api/courses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCourse),
        });

        if (response.ok) {
            const { course } = await response.json();
            setCourses((prev) => [...prev, course]);
            setNewCourse({ name: '', slopeRating: '113', courseRating: '72', par: '72', mapLink: '' });
            setShowForm(false); // Hide the form after adding the course
        } else {
            console.error("Failed to add course");
        }
    };

    const handleUpdateCourse = async (courseId: string | null) => {
        const response = await fetch(`/api/courses/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId, ...newCourse }),
        });

        if (response.ok) {
            const { course: updatedCourse } = await response.json();
            setCourses((prev) =>
                prev.map((course) =>
                    course._id === courseId ? updatedCourse : course,
                ),
            );
            setNewCourse({ name: '', slopeRating: '113', courseRating: '72', par: '72', mapLink: '' });
            setIsEditing(null);
        } else {
            console.error("Failed to update course");
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        const response = await fetch(`/api/courses/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId }),
        });

        if (response.ok) {
            setCourses((prev) => prev.filter((course) => course._id !== courseId));
        } else {
            console.error('Failed to delete course');
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-white">Manage Courses</h3>
                <button
                    className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                    onClick={() => setShowForm((prev) => !prev)}
                >
                    {showForm ? 'Cancel' : 'Add New Course'}
                </button>
            </div>

            {showForm && (
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white mb-4">
                        {isEditing ? 'Edit Course' : 'Add New Course'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-300">Course Name</label>
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={newCourse.name}
                                onChange={(e) => setNewCourse((prev) => ({...prev, name: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-300">Map Link</label>
                            <input
                                type="text"
                                placeholder="Map Link"
                                value={newCourse.mapLink}
                                onChange={(e) => setNewCourse((prev) => ({...prev, mapLink: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-300">Par</label>
                            <input
                                type="number"
                                placeholder="Par"
                                value={newCourse.par}
                                onChange={(e) => setNewCourse((prev) => ({...prev, par: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-300">Slope Rating</label>
                            <input
                                type="number"
                                placeholder="Slope Rating"
                                value={newCourse.slopeRating}
                                onChange={(e) => setNewCourse((prev) => ({...prev, slopeRating: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-300">Course Rating</label>
                            <input
                                type="number"
                                placeholder="Course Rating"
                                value={newCourse.courseRating}
                                onChange={(e) => setNewCourse((prev) => ({...prev, courseRating: e.target.value}))}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-gray-900"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={isEditing ? () => handleUpdateCourse(isEditing) : handleAddCourse}
                                className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300 w-full"
                            >
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <button
                    className="bg-gold text-darkGreen py-2 px-4 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                    onClick={() => setShowCourses((prev) => !prev)}
                >
                    {showCourses ? 'Hide Courses' : 'Show Courses'}
                </button>

                {showCourses && (
                    <div className="mt-4">
                        <div className="grid grid-cols-12 text-sm font-bold text-gray-300 p-2 rounded-md">
                            <div className="col-span-3">Course Name</div>
                            <div className="col-span-2">Slope Rating</div>
                            <div className="col-span-2">Course Rating</div>
                            <div className="col-span-2">Par</div>
                            <div className="col-span-3">Actions</div>
                        </div>
                        <div className="space-y-2">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="grid grid-cols-12 items-center text-sm text-white p-2 border-b border-gray-600"
                                >
                                    <div className="col-span-3">
                                        <a
                                            href={course.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gold hover:underline"
                                        >
                                            {course.name}
                                        </a>
                                    </div>
                                    <div className="col-span-2">{course.slopeRating}</div>
                                    <div className="col-span-2">{course.courseRating}</div>
                                    <div className="col-span-2">{course.par}</div>
                                    <div className="col-span-3 space-x-2">
                                        <button
                                            onClick={() => {
                                                setNewCourse({
                                                    name: course.name,
                                                    slopeRating: course.slopeRating.toString(),
                                                    courseRating: course.courseRating.toString(),
                                                    par: course.par.toString(),
                                                    mapLink: course.mapLink,
                                                });
                                                setIsEditing(course._id);
                                                setShowForm(true);
                                            }}
                                            className="bg-gold text-darkGreen py-1 px-3 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course._id)}
                                            className="bg-gold text-darkGreen py-1 px-3 rounded-md hover:bg-darkGreen hover:text-white transition-all duration-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </Card>
    );
}
