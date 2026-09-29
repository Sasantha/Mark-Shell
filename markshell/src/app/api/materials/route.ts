import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Material, { MATERIAL_FIELDS } from '@/models/Material';
import Product from '@/models/Product'; // We might need to check if a material is used later
import { verifyAdmin, unauthorized, escapeRegex } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';
import { pick } from '@/lib/pick';

export async function GET(request: Request) {
    try {
        await dbConnect();

        // Optional: add a 'usedInProductsCount' aggregation later if needed,
        // but for now just fetch all materials and sort alphabetically
        const materials = await Material.find({}).sort({ name: 1 });

        const formattedMaterials = materials.map(m => {
            const mObj = m.toObject();
            return {
                ...mObj,
                id: mObj._id.toString(),
            };
        });

        return NextResponse.json(formattedMaterials);
    } catch (error) {
        return apiError(error, "Error fetching materials");
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        await dbConnect();
        const body = await request.json();

        if (typeof body?.name !== 'string' || !body.name.trim()) {
            return NextResponse.json({ error: 'Material name is required' }, { status: 400 });
        }

        // Check for uniqueness
        const existingMaterial = await Material.findOne({ name: { $regex: new RegExp(`^${escapeRegex(body.name)}$`, 'i') } });
        if (existingMaterial) {
            return NextResponse.json({ error: 'A material with this name already exists' }, { status: 400 });
        }

        const material = await Material.create(pick(body, MATERIAL_FIELDS));

        const mObj = material.toObject();
        revalidatePublicPages();
        return NextResponse.json({ ...mObj, id: mObj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating material");
    }
}
