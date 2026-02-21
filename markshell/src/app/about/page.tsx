"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MessagePopup from "@/components/ui/MessagePopup";
import Section from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, TreePine, Droplets, CheckCircle, Truck, Utensils, ShieldCheck } from "lucide-react";

const AboutPage = () => {
    return (
        <main className="min-h-screen font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
                {/* Wood Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'url("https://tse3.mm.bing.net/th/id/OIP.NN-4NoZ4FczVoDAf794-twHaEK?rs=1&pid=ImgDetMain&o=7&rm=3")', // Dark wood texture
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        Crafted from Nature, <br />
                        <span className="text-green-400">Built for Business</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        The MarkShell story: Redefining B2B cutlery with organic materials,
                        artisanal quality, and a commitment to the planet.
                    </p>
                    <div className="pt-8">
                        <Button className="rounded-full px-8 py-6 text-lg bg-green-600 hover:bg-green-700 text-white border-none shadow-lg hover:shadow-green-900/20 transition-all">
                            Explore Our Journey ↓
                        </Button>
                    </div>
                </div>
            </div>

            {/* From Forest to Fork Section */}
            <Section className="bg-white py-24">
                <div className="text-center mb-16">
                    <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-3 block">Our Origins</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">From Forest to Fork</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Our journey begins in sustainably managed forests. We select the finest birch and bamboo,
                        ensuring that every piece of cutlery we manufacture respects the raw material's natural beauty and strength.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Large Left Image - Sustainable Sourcing */}
                        <div className="md:col-span-7 relative rounded-[2.5rem] overflow-hidden group min-h-[400px]">
                            <img
                                src="https://tse4.mm.bing.net/th/id/OIP.uRXPczcS2Ax9cqdnVIUwIwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
                                alt="Sustainable Forest"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">Sustainable Sourcing</h3>
                                <p className="text-gray-200 text-sm max-w-md">Only mature timber from certified regrowth areas.</p>
                            </div>
                        </div>

                        {/* Right Column Stack */}
                        <div className="md:col-span-5 flex flex-col gap-6">
                            {/* Top Card - Artisanal Craft */}
                            <div className="bg-[#fcfbf9] p-8 rounded-[2.5rem] flex-grow flex flex-col justify-center relative overflow-hidden group min-h-[220px]">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Utensils size={100} className="text-green-800" />
                                </div>
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-green-700">
                                    <Leaf size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Artisanal Craft</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Combining traditional woodworking techniques with modern precision machinery to ensure smooth finishes without chemicals.
                                </p>
                            </div>

                            {/* Middle Image - Workshop Detail */}
                            <div className="h-48 rounded-[2.5rem] overflow-hidden relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop"
                                    alt="Woodworking Detail"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left Image - Spoons (New) */}
                        <div className="md:col-span-5 relative rounded-[2.5rem] overflow-hidden group min-h-[300px]">
                            <img
                                src="https://th.bing.com/th/id/OIP.a1z8KVG-jQ5kU1v6htuZ-AHaE7?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                                alt="Wooden Spoons"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* Right Card - Biodegradable (Moved here) */}
                        <div className="md:col-span-7 bg-[#1a2e1a] p-12 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[300px]">
                            <div className="relative z-10">
                                <span className="text-6xl md:text-7xl font-bold text-green-500 block mb-4">100%</span>
                                <span className="text-xl md:text-2xl font-medium opacity-90 block mb-2">Biodegradable & Compostable</span>
                                <span className="text-sm opacity-60 uppercase tracking-[0.2em] block">Returning to the earth within 90 days.</span>
                            </div>
                            {/* Decorative blur */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-900/40 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-900/40 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Mission & Vision Section */}
            <Section className="bg-white py-20 border-t border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Mission */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-1 bg-green-600 rounded-full" />
                            <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Our Mission</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">Responsibly Supplying Everyday Essentials</h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                            <p>
                                Our mission is to responsibly supply everyday essentials that meet practical needs today, while steadily moving towards more sustainable and environmentally responsible alternatives.
                            </p>
                            <p>
                                We focus on offering reliable, high-quality products and continuously improving our range by introducing eco-friendly options wherever possible—without compromising affordability, performance, or customer trust.
                            </p>
                            <p className="font-medium text-gray-900">
                                At EcoMark, we are committed to making progress, encouraging better choices, and supporting a gradual shift towards a more sustainable future.
                            </p>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="bg-[#fcfbf9] p-10 rounded-3xl border border-gray-100 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-green-100 p-3 rounded-xl text-green-700">
                                <TreePine size={28} />
                            </div>
                            <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Our Vision</span>
                        </div>
                        <blockquote className="text-2xl font-medium text-gray-900 leading-relaxed">
                            "To become a trusted and dynamic trading company, supplying high-quality products that meet the evolving needs of businesses and households, while promoting responsible and sustainable practices."
                        </blockquote>
                    </div>
                </div>
            </Section>

            {/* Rooted In Responsibility Section */}
            <Section className="bg-[#fcfbf9] py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Rooted In Responsibility</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        We don't just make cutlery; we steward resources. Our core values define every step of our production line.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Zero Waste Policy */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Recycle size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Waste Policy</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Every scrap of sawdust is repurposed for energy or compost. Nothing goes to landfill in our facilities.
                        </p>
                    </div>

                    {/* Ethically Sourced */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <TreePine size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Ethically Sourced</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We partner exclusively with FSC-certified suppliers to prioritize reforestation and fair labor practices.
                        </p>
                    </div>

                    {/* Chemical Free */}
                    <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Droplets size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Chemical Free</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            No coatings. No bleaches. No dyes. Just pure, heat-pressed wood sanitized by nature's own methods.
                        </p>
                    </div>
                </div>
            </Section>

            <div className="bg-white border-y border-gray-100 py-12">
                <div className="w-[90%] md:w-[80%] mx-auto">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by Industry Leaders & Certifications</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos using Lucide + Text for now as placeholders */}
                        <div className="flex items-center gap-2 font-bold text-gray-800"><ShieldCheck /> ISO 9001</div>
                        <div className="flex items-center gap-2 font-bold text-gray-800"><TreePine /> FSC Certified</div>
                        <div className="flex items-center gap-2 font-bold text-gray-800"><Utensils /> HoReCa Pro</div>
                        <div className="flex items-center gap-2 font-bold text-gray-800"><Leaf /> EcoAlliance</div>
                        <div className="flex items-center gap-2 font-bold text-gray-800"><Truck /> GlobalLogistics</div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <Section className="bg-[#ebe9e4] py-24">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Switch to Sustainable?</h2>
                    <p className="text-gray-600 mb-10 text-lg">
                        Join the movement towards a plastic-free future. Request our catalog today and see how MarkShell can elevate your dining experience naturally.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="rounded-full px-8 py-6 text-base bg-gray-900 text-white hover:bg-black">
                            Request a Catalog 📖
                        </Button>
                        <Button variant="outline" className="rounded-full px-8 py-6 text-base border-gray-400 hover:bg-white hover:border-gray-900 text-gray-900">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </Section>

            <Footer />
            <MessagePopup />
        </main>
    );
};

export default AboutPage;
