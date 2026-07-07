/**
 * One-time admin bootstrap script.
 *
 * Usage (from the markshell/ directory):
 *   node --env-file=.env scripts/seed-admin.mjs <email> <password> [name]
 *
 * Example:
 *   node --env-file=.env scripts/seed-admin.mjs admin@markshell.com "a-strong-password" "Administrator"
 *
 * Replaces the old behavior where the login API silently created a
 * default admin (admin@markshell.com / admin123) on first login.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const [, , email, password, name = 'Administrator'] = process.argv;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Run with: node --env-file=.env scripts/seed-admin.mjs <email> <password> [name]');
    process.exit(1);
}

if (!email || !password) {
    console.error('Usage: node --env-file=.env scripts/seed-admin.mjs <email> <password> [name]');
    process.exit(1);
}

if (password.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
}

const AdminSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

try {
    await mongoose.connect(MONGODB_URI);

    const existing = await Admin.findOne({ email });
    if (existing) {
        console.error(`An admin with email ${email} already exists. Nothing to do.`);
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword, name });
    console.log(`Admin account created for ${email}.`);
} catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
} finally {
    await mongoose.disconnect();
}
