import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Certification, { CERTIFICATION_FIELDS } from '@/models/Certification';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

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
        return apiError(error, "Error fetching certifications");
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        await dbConnect();
        const body = await request.json();
        const certification = await Certification.create(pick(body, CERTIFICATION_FIELDS));

        const obj = certification.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating certification");
    }
}
