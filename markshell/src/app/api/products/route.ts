import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product, { PRODUCT_FIELDS } from '@/models/Product';
import { verifyAdmin, unauthorized, escapeRegex } from '@/lib/auth';
import { apiError } from '@/lib/apiError';
import { revalidatePublicPages } from '@/lib/revalidate';
import { pick } from '@/lib/pick';

const MAX_LIMIT = 500;

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limitStr = searchParams.get('limit');
        const q = searchParams.get('q');
        const featured = searchParams.get('featured');
        const pageStr = searchParams.get('page');

        const query: Record<string, unknown> = {};
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

        // Never return more than MAX_LIMIT products in one response, whatever ?limit= says.
        const requested = parseInt(limitStr ?? '', 10);
        const limit = requested > 0 ? Math.min(requested, MAX_LIMIT) : MAX_LIMIT;
        // Optional 1-based ?page= for callers that want the catalog in chunks.
        const page = Math.max(1, parseInt(pageStr ?? '', 10) || 1);

        // lean() returns plain objects, skipping Mongoose document overhead for read-only data.
        const products = await Product.find(query).skip((page - 1) * limit).limit(limit).lean();

        const formattedProducts = products.map(p => ({ ...p, id: String(p._id) }));

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
        revalidatePublicPages();
        return NextResponse.json({ ...pObj, id: pObj._id.toString() }, { status: 201 });
    } catch (error) {
        return apiError(error, "Error creating product");
    }
}
