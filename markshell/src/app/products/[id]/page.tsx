"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/dummy-data";
import { Check, Info, Leaf, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

const SingleProductPage = () => {
    const params = useParams();
    const id = params.id as string;
    const product = products.find((p) => p.id === id);
    const [mainImage, setMainImage] = useState(product?.image);

    // Fallback if product not found (should handle 404 properly in real app)
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Product not found.</p>
            </div>
        );
    }

    // Default Images if extended field is missing
    const galleryImages = product.images || [product.image, product.image, product.image];
    // Ensure main image syncs if product changes or state is initially empty
    const displayImage = mainImage || product.image;

    // Filter related products (same category or material, excluding self)
    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

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
                        {product.subname || `${product.category} - ${product.material}`}
                    </p>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="w-[90%] md:w-[80%] mx-auto text-sm text-gray-500">
                    <a href="/" className="hover:text-green-600 cursor-pointer transition-colors">Home</a> &gt;{" "}
                    <a href="/products" className="hover:text-green-600 cursor-pointer transition-colors">Products</a> &gt;{" "}
                    <span className="hover:text-green-600 cursor-pointer">{product.category}</span> &gt;{" "}
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
            </div>

            <Section className="py-12">
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
                            <img
                                src={displayImage}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {galleryImages.map((img, idx) => (
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
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Variant 1 • Standard Finish
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Stock Badge */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check size={12} className="text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">In Stock & Ready to Ship</span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                <ShieldCheck size={16} className="text-green-600" /> Food Grade
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                <Leaf size={16} className="text-green-600" /> Biodegradable
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                <Leaf size={16} className="text-green-600" /> Sustainable
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.longDescription || product.subname || product.name}
                        </p>

                        {/* Specs Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">
                                Technical Specifications
                            </h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Length</span>
                                    <span className="text-sm font-bold text-gray-900">{product.specs.length || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Material</span>
                                    <span className="text-sm font-bold text-gray-900">{product.material === "Birchwood" ? "100% White Birch" : "Natural Bamboo"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Carton Quantity</span>
                                    <span className="text-sm font-bold text-gray-900">{product.cartonQuantity || product.specs.case}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Weight</span>
                                    <span className="text-sm font-bold text-gray-900">{product.weight || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ordering Actions */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Estimated Order Volume</label>
                                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
                                    <option>1 - 5 Cartons (Trial)</option>
                                    <option>5 - 20 Cartons</option>
                                    <option>20+ Cartons (Bulk)</option>
                                    <option>Full Container Load (FCL)</option>
                                </select>
                            </div>
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                                onClick={() => window.open(`https://wa.me/1234567890?text=Hi, I'm interested in ${product.name}`, '_blank')}
                            >
                                <MessageSquare className="fill-current" /> Request Quote via WhatsApp
                            </Button>
                            <p className="text-center text-xs text-gray-400">
                                Typically responds within 15 minutes during business hours.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complete the Set */}
                <div className="border-t border-gray-100 pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Complete the Set</h2>
                        <a href="/products" className="text-green-600 font-bold text-sm flex items-center gap-1 hover:underline">
                            View All <ArrowRight size={16} />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                variant="default" // Use default variant for related products as per design image
                                image={p.image}
                                title={p.name}
                                description={p.category} // Simplified description
                                tag={p.category}
                                badge={p.badge}
                                onQuoteClick={() => console.log("Quote clicked")}
                            />
                        ))}
                    </div>
                </div>
            </Section>

            <Footer />
        </main>
    );
};

export default SingleProductPage;
