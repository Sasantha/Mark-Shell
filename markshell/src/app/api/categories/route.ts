import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category from '@/models/Category';

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({});

        // Map _id to id for the frontend
        const formattedCategories = categories.map(cat => {
            const catObj = cat.toObject();
            return {
                ...catObj,
                id: catObj._id.toString(),
            };
        });

        return NextResponse.json(formattedCategories);
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const category = await Category.create(body);

        const catObj = category.toObject();
        return NextResponse.json({ ...catObj, id: catObj._id.toString() }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
