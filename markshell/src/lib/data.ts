import { cache } from 'react';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import { escapeRegex } from '@/lib/auth';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';
import MaterialModel from '@/models/Material';
import PartnerModel from '@/models/Partner';
import CertificationModel from '@/models/Certification';
import AboutGalleryImageModel from '@/models/AboutGalleryImage';
import type { AboutGalleryImage, Category, Certification, Material, Partner, Product } from '@/types';

// Server-side data access for the public pages. Pages render with this data
// on the server (so the HTML already contains the products, for visitors and
// search engines alike) instead of fetching the API from the browser.
// React's cache() dedupes calls within one render, e.g. generateMetadata + page.

/** Converts lean Mongo documents to plain JSON (ObjectIds and Dates become strings) with an `id`. */
function serialize<T>(docs: unknown[]): T[] {
    return (JSON.parse(JSON.stringify(docs)) as Array<Record<string, unknown>>)
        .map(({ _id, ...rest }) => {
            delete rest.__v; // Mongoose's internal version key
            return { ...rest, id: _id } as T;
        });
}

// Only the fields each view renders, to keep the page payload small.
const PRODUCT_CARD_FIELDS = 'name subname category material image price badge specs isAvailable pack case grade';
const FEATURED_FIELDS = 'name subname category image badge isAvailable';
const RELATED_FIELDS = 'name category image badge';

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
    await dbConnect();
    return serialize(await ProductModel.find({ isFeatured: true }).select(FEATURED_FIELDS).limit(6).lean());
});

/** All products for the catalog, optionally matching a search term. */
export const getProducts = cache(async (search?: string): Promise<Product[]> => {
    await dbConnect();
    const term = search?.trim();
    const query = term
        ? { $or: ['name', 'longDescription', 'subname'].map(field => ({ [field]: { $regex: escapeRegex(term), $options: 'i' } })) }
        : {};
    return serialize(await ProductModel.find(query).select(PRODUCT_CARD_FIELDS).lean());
});

export const getProduct = cache(async (id: string): Promise<Product | null> => {
    if (!mongoose.isValidObjectId(id)) return null;
    await dbConnect();
    const doc = await ProductModel.findById(id).lean();
    return doc ? serialize<Product>([doc])[0] : null;
});

/** Up to 4 other products from the same category ("Complete the Set"). */
export const getRelatedProducts = cache(async (category: string, excludeId: string): Promise<Product[]> => {
    await dbConnect();
    return serialize(await ProductModel.find({ category, _id: { $ne: excludeId } }).select(RELATED_FIELDS).limit(4).lean());
});

export async function getProductIds(): Promise<string[]> {
    await dbConnect();
    const docs = await ProductModel.find({}).select('_id').lean();
    return docs.map(doc => String(doc._id));
}

export const getCategories = cache(async (): Promise<Category[]> => {
    await dbConnect();
    return serialize(await CategoryModel.find({}).lean());
});

export const getMaterials = cache(async (): Promise<Material[]> => {
    await dbConnect();
    return serialize(await MaterialModel.find({}).sort({ name: 1 }).lean());
});

export const getPartners = cache(async (): Promise<Partner[]> => {
    await dbConnect();
    return serialize(await PartnerModel.find({}).lean());
});

export const getCertifications = cache(async (): Promise<Certification[]> => {
    await dbConnect();
    return serialize(await CertificationModel.find({}).lean());
});

export const getGalleryImages = cache(async (): Promise<AboutGalleryImage[]> => {
    await dbConnect();
    return serialize(await AboutGalleryImageModel.find({}).sort({ createdAt: 1 }).limit(6).lean());
});
