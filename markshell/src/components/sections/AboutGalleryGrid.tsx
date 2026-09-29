"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { AboutGalleryImage } from "@/types";

/** Gallery images are loaded on the server by the About page and passed in. */
const AboutGalleryGrid = ({ images }: { images: AboutGalleryImage[] }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Visitors who prefer reduced motion see the tiles immediately via the
        // motion-reduce: classes below, so the observer only drives the animation.
        if (images.length === 0 || isRevealed) return;

        const el = containerRef.current;
        if (!el) return;

        // On mobile the stacked 1-column grid is taller than the viewport, so a
        // fixed 35% visibility ratio would never be reached — cap the threshold
        // so the reveal fires once the grid fills ~40% of the viewport instead.
        const threshold = Math.min(0.35, (window.innerHeight * 0.4) / el.offsetHeight);

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [images.length, isRevealed]);

    // Render nothing until images exist — no placeholder boxes
    if (images.length === 0) return null;

    return (
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.slice(0, 6).map((image, index) => (
                <div
                    key={image.id}
                    className={`relative aspect-square rounded-2xl overflow-hidden group transition-[transform,opacity] duration-450 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100 motion-reduce:translate-y-0 ${isRevealed
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-[0.85] translate-y-4"
                        }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                >
                    <Image
                        src={image.image}
                        alt={image.alt || "MarkShell craftsmanship"}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
};

export default AboutGalleryGrid;
