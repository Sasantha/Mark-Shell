import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

// Helper to verify token and extract admin ID
const verifyAdmin = (request: Request) => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        if (decoded.role !== 'admin') return null;
        return decoded.id;
    } catch (error) {
        return null;
    }
};

export async function PUT(request: Request) {
    try {
        const adminId = verifyAdmin(request);
        if (!adminId) {
            return NextResponse.json({ message: 'Unauthorized / Invalid Token' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
        }

        // Hash and update new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;
        await admin.save();

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error: any) {
        console.error('Update password error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
