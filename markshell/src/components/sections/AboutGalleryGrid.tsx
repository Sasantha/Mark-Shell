"use client";

import React, { useState, useEffect, useRef } from "react";
import type { AboutGalleryImage } from "@/types";

const AboutGalleryGrid = () => {
    const [images, setImages] = useState<AboutGalleryImage[]>([]);
    const [isRevealed, setIsRevealed] = useState(false);
    const [skipAnimation, setSkipAnimation] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/about-gallery');
                if (!response.ok) throw new Error('Failed to fetch gallery images');
                setImages(await response.json());
            } catch (err) {
                console.error("Error fetching about gallery images:", err);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length === 0 || isRevealed) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setSkipAnimation(true);
            setIsRevealed(true);
            return;
        }

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
                    className={`aspect-square rounded-2xl overflow-hidden group ${skipAnimation
                        ? ""
                        : `transition-[transform,opacity] duration-450 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100 motion-reduce:translate-y-0 ${isRevealed
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-[0.85] translate-y-4"
                        }`
                        }`}
                    style={skipAnimation ? undefined : { transitionDelay: `${index * 100}ms` }}
                >
                    <img
                        src={image.image}
                        alt={image.alt || "MarkShell craftsmanship"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
};

export default AboutGalleryGrid;
