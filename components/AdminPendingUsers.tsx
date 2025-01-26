import Card from '@/components/Card';

export default function AdminPendingUsers() {
    return (
        <Card>
            <h3 className="text-2xl font-semibold text-white mb-4">Pending Users</h3>
            {/* Placeholder for list of pending users */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-medium text-white">John Doe</p>
                        <p className="text-sm text-gray-300">johndoe@example.com</p>
                    </div>
                    <div className="space-x-2">
                        <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300">Approve</button>
                        <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300">Deny</button>
                    </div>
                </div>
                {/* Repeat for more users */}
            </div>
        </Card>
    );
}
