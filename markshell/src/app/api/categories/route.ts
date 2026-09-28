import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category, { CATEGORY_FIELDS } from '@/models/Category';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';
import { pick } from '@/lib/pick';

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
    } catch (error) {
        return apiError(error, "Error fetching categories");
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

        await dbConnect();
        const body = await request.json();
        const category = await Category.create(pick(body, CATEGORY_FIELDS));

        const catObj = category.toObject();
        revalidatePublicPages();
        return NextResponse.json({ ...catObj, id: catObj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating category");
    }
}
