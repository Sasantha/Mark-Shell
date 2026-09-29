import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { setSessionCookie } from '@/lib/session';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Slow down password guessing: at most 10 attempts per IP every 15 minutes.
        const { allowed, retryAfterSeconds } = await rateLimit(`login:${getClientIp(request)}`, 10, 15 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json(
                { message: 'Too many login attempts. Please try again later.' },
                { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
            );
        }

        const body = await request.json();
        const { email, password } = body;

        // Must be plain strings: an object like {"$ne": null} would otherwise be
        // treated as a MongoDB query operator and match any admin (NoSQL injection).
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
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

        const response = NextResponse.json({
            message: 'Login successful',
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });
        // The token goes in an httpOnly cookie, never in the response body, so page scripts can't read it.
        setSessionCookie(response, admin);
        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
