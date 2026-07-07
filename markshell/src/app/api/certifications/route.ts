import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Certification from '@/models/Certification';
import { verifyAdmin, unauthorized } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        const certifications = await Certification.find({});

        const formatted = certifications.map(c => {
            const obj = c.toObject();
            return { ...obj, id: obj._id.toString() };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching certifications:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!verifyAdmin(request)) {
            return unauthorized();
        }

        await dbConnect();
        const body = await request.json();
        const certification = await Certification.create(body);

        const obj = certification.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error) {
        console.error("Error creating certification:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
    }
}
