import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { categories, products } from '@/lib/dummy-data';

export async function GET(request: Request) {
    // Basic protection: only allow in development or with a secret
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        await dbConnect();

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Map dummy data to match our schema (removing string IDs so MongoDB generates them)
        const categoriesToInsert = categories.map(({ id, ...rest }) => rest);
        const productsToInsert = products.map(({ id, ...rest }) => rest);

        const insertedCategories = await Category.insertMany(categoriesToInsert);
        const insertedProducts = await Product.insertMany(productsToInsert);

        return NextResponse.json({
            message: 'Database seeded successfully',
            categoriesInserted: insertedCategories.length,
            productsInserted: insertedProducts.length
        });
    } catch (error: any) {
        console.error("Error seeding database:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
