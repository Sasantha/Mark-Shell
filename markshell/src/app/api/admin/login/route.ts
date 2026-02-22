import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Check if ANY admin exists. If not, we create the default one.
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            console.log("No admin found in DB. Creating default admin...");
            const defaultHashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                email: 'admin@markshell.com',
                password: defaultHashedPassword,
                name: 'Administrator'
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
