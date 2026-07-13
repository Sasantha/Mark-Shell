"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Section from "../ui/section";
import type { Certification } from "@/types";

const Certifications = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await fetch('/api/certifications');
                if (response.ok) {
                    setCertifications(await response.json());
                }
            } catch (error) {
                console.error("Failed to fetch certifications:", error);
            }
        };

        fetchCertifications();
    }, []);

    // Hide the section entirely until there's real content to show.
    if (certifications.length === 0) return null;

    return (
        <Section className="bg-[#fcfbf9] py-24">
            <div className="flex flex-col items-center mb-16 text-center">
                <span className="text-green-600 font-semibold tracking-wider text-sm uppercase mb-3">Quality You Can Trust</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Certifications</h2>
                <div className="w-24 h-1.5 bg-yellow-400 rounded-full"></div>
                <p className="mt-6 text-gray-600 max-w-2xl text-lg">
                    Independently verified standards for sustainable sourcing, manufacturing quality, and food-safety compliance.
                </p>
            </div>

            {/* auto-fit + justify-center: leftover tracks collapse instead of
                stretching, so 1-2 items center as a group rather than
                left-aligning with empty space to the right. */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,280px))] justify-center gap-6">
                {certifications.map((cert) => (
                    <div
                        key={cert.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center"
                    >
                        <div className="relative h-40 w-40 mb-4">
                            <Image
                                src={cert.image}
                                alt={cert.name}
                                fill
                                sizes="160px"
                                className="object-contain"
                            />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1">{cert.name}</h3>
                        {cert.description && (
                            <p className="text-gray-500 text-xs leading-relaxed">{cert.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Certifications;
