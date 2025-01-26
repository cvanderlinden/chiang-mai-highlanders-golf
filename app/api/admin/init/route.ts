// app/api/admin/init/route.ts

import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/initializeAdmin';

export async function GET() {
    await initializeAdmin();
    return NextResponse.json({ message: 'Admin check completed' });
}
