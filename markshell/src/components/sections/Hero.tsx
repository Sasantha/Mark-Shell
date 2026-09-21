"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import Section from "../ui/section";
import { useQuote } from "@/contexts/QuoteContext";

const Hero = () => {
    const { openQuote } = useQuote();

    return (
        <div className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden bg-[#f3f0ea]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.jpg"
                    alt="Bamboo Forest"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <Section className="relative z-10 w-full py-0">
                <div className="max-w-3xl space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
                        <span className="inline-flex items-center gap-2 md:gap-3 align-middle">
                            <span className="relative inline-block overflow-hidden align-middle w-51.25 h-11 md:w-74.5 md:h-16">
                                <Image
                                    src="/Ecomark_logo_glow.png"
                                    alt=""
                                    aria-hidden="true"
                                    width={2000}
                                    height={2000}
                                    className="absolute max-w-none w-67.5 h-67.5 -top-23.25 -left-7.75 md:w-98.25 md:h-98.25 md:-top-33.75 md:-left-11.5"
                                />
                            </span>
                            <span className="sr-only">EcoMark</span>
                            by
                        </span><br />
                        <span className="text-green-400">Mark-Shell (Pvt) Ltd.</span>
                    </h1>

                    <p className="text-base md:text-lg text-gray-100 max-w-xl md:max-w-2xl leading-relaxed drop-shadow-md">
                        Sustainable Cutlery & Packaging Solutions for Your Business
                    </p>

                    <p className="text-base md:text-lg text-gray-100 max-w-xl md:max-w-2xl leading-relaxed drop-shadow-md">
                        At Mark-Shell (Pvt) Ltd., we supply high-quality, responsibly sourced wooden cutlery and sustainable packaging products for hotels, restaurants, cafés, supermarkets, catering companies, and food service businesses.
                    </p>

                    <p className="text-base md:text-lg text-gray-100 max-w-xl md:max-w-2xl leading-relaxed drop-shadow-md">
                        We are committed to delivering reliable, hygienic, and environmentally responsible products that help businesses serve with confidence.
                    </p>

                    <p className="text-base md:text-lg text-gray-100 max-w-xl md:max-w-2xl leading-relaxed drop-shadow-md">
                        Premium Quality • Competitive Prices • Reliable Supply
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="rounded-full text-base px-8 py-6 bg-green-600 hover:bg-green-700 border-none transition-transform hover:scale-105"
                            onClick={() => openQuote('general', 'Bulk Quotation')}
                        >
                            Request Bulk Quotation
                        </Button>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="rounded-full text-base px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-green-900 transition-colors">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default Hero;
