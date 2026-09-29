import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { setSessionCookie } from '@/lib/session';
import { MIN_PASSWORD_LENGTH } from '@/lib/passwordPolicy';

export async function PUT(request: Request) {
    try {
        const adminId = await verifyAdmin(request);
        if (!adminId) {
            return unauthorized();
        }

        await dbConnect();

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || !currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 });
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

        // Hash the new password and bump the token version, which signs out
        // every existing session (e.g. one on a lost or shared device).
        admin.password = await bcrypt.hash(newPassword, 10);
        admin.tokenVersion = (admin.tokenVersion ?? 0) + 1;
        // Validate only what changed: an email saved under an older, stricter rule
        // (e.g. the 2-3 letter TLD pattern rejects .info) must not block a password change.
        await admin.save({ validateModifiedOnly: true });

        // Keep the admin who made the change signed in with a fresh token.
        const response = NextResponse.json({ message: 'Password updated successfully' });
        setSessionCookie(response, admin);
        return response;

    } catch (error) {
        console.error('Update password error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
