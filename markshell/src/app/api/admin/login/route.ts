import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { getJwtSecret } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
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
            getJwtSecret(),
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
