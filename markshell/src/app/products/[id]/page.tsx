import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { getProduct, getProductIds, getRelatedProducts } from "@/lib/data";

// Every product page is pre-rendered at build time. Products added later are
// rendered on their first visit and then cached. Admin changes refresh them
// immediately (lib/revalidate.ts); this hourly refresh is a fallback.
export const revalidate = 3600;

export async function generateStaticParams() {
    const ids = await getProductIds();
    return ids.map(id => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

/** A unique title, description and share image per product (previously every product page shared the site title). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) return { title: "Product not found" };

    const description = (product.subname || product.longDescription || `${product.name}: ${product.category} made from ${product.material}.`)
        .replace(/\s+/g, " ")
        .slice(0, 160);

    return {
        title: product.name,
        description,
        openGraph: { title: product.name, description, images: [product.image] },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) notFound(); // a real 404 instead of a 200 page saying "Product not found"

    const relatedProducts = await getRelatedProducts(product.category, product.id);

    // key: reset the gallery's selected image when moving to another product.
    return <ProductDetail key={product.id} product={product} relatedProducts={relatedProducts} />;
}
