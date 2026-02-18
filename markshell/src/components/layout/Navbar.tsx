"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "#" },
        { name: "About", href: "/about" },
        { name: "Products", href: "/products" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            )}
        >
            <div className="w-[90%] md:w-[80%] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-green-600 p-1.5 rounded-full text-white group-hover:scale-110 transition-transform">
                        <Leaf size={20} fill="currentColor" />
                    </div>
                    <span className={cn("text-xl font-bold tracking-tight", isScrolled ? "text-green-900" : "text-white")}>
                        MarkShell
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium hover:text-green-500 transition-colors",
                                isScrolled ? "text-gray-700" : "text-white/90"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link href="/contact">
                        <Button
                            className="rounded-full px-6"
                            variant={isScrolled ? "default" : "white"}
                        >
                            Get Quote / contact →
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className={isScrolled ? "text-gray-900" : "text-white"} />
                    ) : (
                        <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-700 font-medium hover:text-green-600 py-2 border-b border-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button className="w-full rounded-full">Get Started</Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
