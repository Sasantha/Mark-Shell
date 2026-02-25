import React from "react";
import Link from "next/link";
import Section from "../ui/section";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

const About = () => {
    return (
        <Section className="bg-[#fcfbf9]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div className="space-y-8 order-2 lg:order-1">
                    <span className="text-green-600 font-semibold tracking-wider text-sm uppercase">About Ecomark</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Ecomark is the sustainability-focused product line of Mark-Shell Pvt Ltd, <br />
                        created to serve corporate buyers seeking eco-conscious alternatives to conventional plastic cutlery. <br />
                        
                    </h2>
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
