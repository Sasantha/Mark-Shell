"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import MessagePopup from "@/components/ui/MessagePopup";
import { Check, Info, Leaf, MessageSquare, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useQuote } from "@/contexts/QuoteContext";
import Link from "next/link";

const SingleProductPage = () => {
    const { openQuote } = useQuote();
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState<string | undefined>();

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Fetch main product
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const productData = await res.json();

                // Convert MongoDB _id to id if necessary
                const formattedProduct = {
                    ...productData,
                    id: productData._id || productData.id
                };

                setProduct(formattedProduct);
                setMainImage(formattedProduct.image);

                // Fetch related products (same category)
                if (formattedProduct.category) {
                    const relRes = await fetch(`/api/products?category=${encodeURIComponent(formattedProduct.category)}`);
                    if (relRes.ok) {
                        const relData = await relRes.json();
                        // Filter out current product and take up to 4
                        const filtered = relData
                            .filter((p: any) => (p._id || p.id) !== formattedProduct.id)
                            .map((p: any) => ({ ...p, id: p._id || p.id }))
                            .slice(0, 4);
                        setRelatedProducts(filtered);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching product:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    if (isLoading) {
        return (
            <main className="min-h-screen font-sans bg-[#f9fafb] flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen font-sans bg-[#f9fafb] flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-xl text-gray-700">{error || "Product not found."}</p>
                </div>
                <Footer />
            </main>
        );
    }

    // Default Images if extended field is missing
    const galleryImages = product.images?.length ? product.images : [product.image];
    const displayImage = mainImage || product.image;

    return (
        <main className="min-h-screen font-sans bg-[#f9fafb]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-green-900 py-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1584620583865-c3c43e87ea13?auto=format&fit=crop&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-green-950/60 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 w-[90%] md:w-[80%] mx-auto pt-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {product.name}
                    </h1>
                    <p className="text-green-100 max-w-2xl text-lg leading-relaxed opacity-90">
                        {product.subname || `${product.category}${product.grade ? ` (Grade ${product.grade})` : ""} - ${product.material}`}
                    </p>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="w-[90%] md:w-[80%] mx-auto text-sm text-gray-500">
                    <Link href="/" className="hover:text-green-600 cursor-pointer transition-colors">Home</Link> &gt;{" "}
                    <Link href="/products" className="hover:text-green-600 cursor-pointer transition-colors">Products</Link> &gt;{" "}
                    <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-green-600 cursor-pointer transition-colors">{product.category}</Link> &gt;{" "}
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
            </div>

            <Section className="py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Gallery */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-8 flex items-center justify-center aspect-square shadow-sm border border-gray-100 relative overflow-hidden">
                            {product.badge && (
                                <span className={`absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${product.badge === "Best Seller" ? "bg-green-500 text-white" : "bg-gray-800 text-white"
                                    }`}>
                                    {product.badge}
                                </span>
                            )}
                            {displayImage && (
                                <img
                                    src={displayImage}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                                />
                            )}
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {galleryImages.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`bg-white rounded-xl p-2 cursor-pointer border-2 transition-all ${displayImage === img ? "border-green-500" : "border-transparent hover:border-gray-200"
                                            }`}
                                        onClick={() => setMainImage(img)}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex flex-wrap items-center gap-2">
                            <span>{product.category}</span>
                            {product.grade && (
                                <>
                                    <span>•</span>
                                    <span className="text-green-600">Grade {product.grade}</span>
                                </>
                            )}
                            <span>•</span>
                            <span>{product.material}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Stock Badge */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check size={12} className="text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {product.isAvailable ? "In Stock & Ready to Ship" : "Currently Unavailable"}
                            </span>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-8">
                                {product.features.map((feature: string) => (
                                    <div key={feature} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                        <Check size={16} className="text-green-600" /> {feature}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                            {product.longDescription || product.subname || product.name}
                        </p>

                        {/* Specs Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">
                                Technical Specifications
                            </h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                {product.specs?.length && (
                                    <div>
                                        <span className="text-xs text-gray-400 block mb-1">Length</span>
                                        <span className="text-sm font-bold text-gray-900">{product.specs.length}</span>
                                    </div>
                                )}
                                {(product.weight || product.specs?.weight) && (
                                    <div>
                                        <span className="text-xs text-gray-400 block mb-1">Weight</span>
                                        <span className="text-sm font-bold text-gray-900">{product.weight || product.specs.weight}</span>
                                    </div>
                                )}
                                {product.material && (
                                    <div>
                                        <span className="text-xs text-gray-400 block mb-1">Material</span>
                                        <span className="text-sm font-bold text-gray-900">{product.material === "Birchwood" ? "100% White Birch" : product.material}</span>
                                    </div>
                                )}
                                {product.cartonQuantity && (
                                    <div>
                                        <span className="text-xs text-gray-400 block mb-1">Carton Quantity</span>
                                        <span className="text-sm font-bold text-gray-900">{product.cartonQuantity}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ordering Actions */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Estimated Order Volume</label>
                                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
                                    {(product.orderVolumes && product.orderVolumes.length > 0) ? (
                                        product.orderVolumes.map((vol: string) => (
                                            <option key={vol} value={vol}>{vol}</option>
                                        ))
                                    ) : (
                                        <>
                                            <option>1 - 5 Cartons (Trial)</option>
                                            <option>5 - 20 Cartons</option>
                                            <option>20+ Cartons (Bulk)</option>
                                            <option>Full Container Load (FCL)</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                                onClick={() => openQuote('product', product.name)}
                            >
                                <MessageSquare className="fill-current" /> Request Quote
                            </Button>
                            <p className="text-center text-xs text-gray-400">
                                Typically responds within 15 minutes during business hours.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complete the Set */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Complete the Set</h2>
                            <a href={`/products?category=${encodeURIComponent(product.category)}`} className="text-green-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                View All <ArrowRight size={16} />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    id={p.id}
                                    variant="default"
                                    image={p.image}
                                    title={p.name}
                                    description={p.category}
                                    tag={p.category}
                                    badge={p.badge}
                                    onQuoteClick={() => openQuote('product', p.name)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            <Footer />
            <MessagePopup />
        </main>
    );
};

export default SingleProductPage;
