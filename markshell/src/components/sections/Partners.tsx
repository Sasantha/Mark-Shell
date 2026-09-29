import React from "react";
import Image from "next/image";
import Section from "../ui/section";
import type { Partner } from "@/types";

/** Partner logos, loaded on the server by the home page and passed in. */
const Partners = ({ partners }: { partners: Partner[] }) => {
    // Hide the section entirely until there's real content to show.
    if (partners.length === 0) return null;

    return (
        <Section className="pb-96 md:pt-8 md:pb-8 bg-white border-b border-gray-100">
            <div className="flex flex-col items-center">
                <span className="text-gray-400 font-semibold tracking-widest text-xs uppercase mb-6">
                    Trusted By Our Business Partners
                </span>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 w-full">
                    {partners.map((partner) => {
                        const logo = (
                            <div className="relative h-12 w-32">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    sizes="128px"
                                    className="object-contain"
                                />
                            </div>
                        );

                        return partner.websiteUrl ? (
                            <a
                                key={partner.id}
                                href={partner.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={partner.name}
                            >
                                {logo}
                            </a>
                        ) : (
                            <div key={partner.id} aria-label={partner.name}>
                                {logo}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};

export default Partners;
