import type { Metadata } from "next";
import ProductsCatalog from "./ProductsCatalog";
import { getCategories, getMaterials, getProducts } from "@/lib/data";

export const metadata: Metadata = {
    title: "Products",
    description: "MarkShell's catalog of FSC-certified wooden cutlery, straws and food-service disposables, supplied in bulk to hotels, restaurants, caterers and supermarkets across Sri Lanka.",
};

/**
 * Rendered on the server for each request (it depends on ?search=), with all
 * three lookups running in parallel, so the catalog is in the initial HTML
 * instead of appearing after the browser fetches the API.
 */
export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ search?: string | string[] }> }) {
    const { search } = await searchParams;
    const searchQuery = typeof search === "string" && search.trim() ? search : undefined;

    const [categories, materials, products] = await Promise.all([
        getCategories(),
        getMaterials(),
        getProducts(searchQuery),
    ]);

    return (
        <ProductsCatalog
            products={products}
            categories={categories}
            materials={materials}
            searchQuery={searchQuery}
        />
    );
}
