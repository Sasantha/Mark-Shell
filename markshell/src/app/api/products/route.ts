import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product, { PRODUCT_FIELDS } from '@/models/Product';
import { verifyAdmin, unauthorized, escapeRegex } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { pick } from '@/lib/pick';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limitStr = searchParams.get('limit');
        const q = searchParams.get('q');
        const featured = searchParams.get('featured');

        let query: any = {};
        if (category) {
            query.category = category;
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }
        if (q) {
            const safeQuery = escapeRegex(q);
            query.$or = [
                { name: { $regex: safeQuery, $options: 'i' } },
                { longDescription: { $regex: safeQuery, $options: 'i' } },
                { subname: { $regex: safeQuery, $options: 'i' } }
            ];
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
    } catch (error) {
        return apiError(error, "Error fetching products");
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return unauthorized();
        }

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

        const product = await Product.create(pick(body, PRODUCT_FIELDS));

        const pObj = product.toObject();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating product");
    }
}
