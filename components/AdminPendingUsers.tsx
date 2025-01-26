// components/AdminPendingUsers.tsx

import { useEffect, useState } from 'react';
import Card from '@/components/Card';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function AdminPendingUsers() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await fetch('/api/users/pending');
                if (response.ok) {
                    const data = await response.json();
                    setPendingUsers(data.users);
                } else {
                    console.error('Failed to fetch pending users');
                }
            } catch (error) {
                console.error('Error fetching pending users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingUsers();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            const response = await fetch('/api/users/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
            } else {
                console.error('Failed to approve user');
            }
        } catch (error) {
            console.error('Error approving user:', error);
        }
    };

    const handleDeny = async (userId: string) => {
        try {
            const response = await fetch('/api/users/deny', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
            } else {
                console.error('Failed to deny user');
            }
        } catch (error) {
            console.error('Error denying user:', error);
        }
    };

    if (loading) {
        return <p className="text-gray-300">Loading pending users...</p>;
    }

    return (
        <Card>
            <h3 className="text-2xl font-semibold text-white mb-4">Pending Users</h3>
            {pendingUsers.length === 0 ? (
                <p className="text-gray-300">No pending users.</p>
            ) : (
                <div className="space-y-4">
                    {pendingUsers.map((user) => (
                        <div key={user._id} className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-medium text-white">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-sm text-gray-300">{user.email}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300"
                                    onClick={() => handleApprove(user._id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300"
                                    onClick={() => handleDeny(user._id)}
                                >
                                    Deny
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
