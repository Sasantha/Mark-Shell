import React from "react";
import Link from "next/link";
import Section from "../ui/section";
import { Button } from "../ui/button";

const CTA = () => {
    return (
        <Section className="relative py-32 overflow-hidden">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 z-0 bg-green-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Ready to Upgrade <br /> Your Sustainable Supply Chain?
                </h2>
                <p className="text-white/80 text-xl leading-relaxed">
                    Streamline your procurement with a reliable, scalable partner focused on responsible production and operational practicality.
                </p>
                <Link href="/contact">
                    <Button size="lg" className="bg-yellow-400 text-green-900 hover:bg-yellow-300 rounded-full px-10 py-6 text-lg font-bold">
                        Contact Us Now
                    </Button>
                </Link>
            </div>
        </Section>
    );
};

export default CTA;
