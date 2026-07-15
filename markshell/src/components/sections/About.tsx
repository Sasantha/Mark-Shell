import React from "react";
import Link from "next/link";
import Image from "next/image";
import Section from "../ui/section";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

const About = () => {
    return (
        <Section className="bg-[#fcfbf9]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Content */}
                <div className="space-y-8 order-2 lg:order-1">
                    <Image
                        src="/EcoMark_logo_transparent.svg"
                        alt="Ecomark"
                        width={180}
                        height={180}
                    />
                    <span className="text-green-600 font-semibold tracking-wider text-sm uppercase inline-flex items-center gap-1.5">
                        About
                        <span className="relative inline-block overflow-hidden align-middle w-26.25 h-5">
                            <Image
                                src="/Ecomark_logo_transparent.png"
                                alt=""
                                aria-hidden="true"
                                width={2000}
                                height={2000}
                                className="absolute max-w-none w-32.5 h-32.5 -top-11.25 -left-3.25"
                            />
                        </span>
                        <span className="sr-only">EcoMark</span>
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        <span className="inline-flex items-center gap-2 align-middle">
                            <span className="relative inline-block overflow-hidden align-middle w-31.5 h-6 md:w-42.25 md:h-8">
                                <Image
                                    src="/Ecomark_logo_transparent.png"
                                    alt=""
                                    aria-hidden="true"
                                    width={2000}
                                    height={2000}
                                    className="absolute max-w-none w-39 h-39 -top-13.5 -left-4 md:w-52.25 md:h-52.25 md:-top-18 md:-left-5.25"
                                />
                            </span>
                            <span className="sr-only">EcoMark</span>
                        </span> – The Sustainable Product Line by Mark-Shell Pvt Ltd <br />

                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Offering eco-conscious alternatives to conventional plastic cutlery.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        We specialize in supplying bulk wooden spoons, forks, and knives tailored for hotels, restaurants, catering services, supermarkets, and export clients.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["Sustainability First", "Responsibly sourced wooden materials", "Reduced plastic dependency where technically feasible", "Compliance-ready for commercial food service operations"].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <CheckCircle className="text-green-600 shrink-0" size={20} />
                                <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/about">
                        <Button size="lg" className="rounded-full px-8 mt-4">
                            Read More
                        </Button>
                    </Link>
                </div>

                {/* Image Placeholder */}
                <div className="order-1 lg:order-2 relative">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 relative z-10">
                        {/* Placeholder for About Image - e.g. wood logs/texture as in design */}
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full z-0 blur-2xl opacity-50"></div>
                </div>
            </div>
        </Section>
    );
};

export default About;
