import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limitStr = searchParams.get('limit');

        let query: any = {};
        if (category) {
            query.category = category;
        }

        let productsQuery = Product.find(query);

        if (limitStr) {
            const limit = parseInt(limitStr);
            if (!isNaN(limit)) {
                productsQuery = productsQuery.limit(limit);
            }
        }

        const products = await productsQuery;

        const formattedProducts = products.map(p => {
            const pObj = p.toObject();
            return {
                ...pObj,
                id: pObj._id.toString(),
            };
        });

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Clean up empty strings in nested objects if needed
        if (body.specs) {
            Object.keys(body.specs).forEach(key => {
                if (body.specs[key] === "") {
                    delete body.specs[key];
                }
            });
        }

        const product = await Product.create(body);

        const pObj = product.toObject();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
