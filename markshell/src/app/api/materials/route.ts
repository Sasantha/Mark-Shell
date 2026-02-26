import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Material from '@/models/Material';
import Product from '@/models/Product'; // We might need to check if a material is used later

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
    } catch (error: any) {
        console.error("Error fetching materials:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Check for uniqueness
        const existingMaterial = await Material.findOne({ name: { $regex: new RegExp(`^${body.name}$`, 'i') } });
        if (existingMaterial) {
            return NextResponse.json({ error: 'A material with this name already exists' }, { status: 400 });
        }

        const material = await Material.create(body);

        const mObj = material.toObject();
        return NextResponse.json({ ...mObj, id: mObj._id.toString() }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating material:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
