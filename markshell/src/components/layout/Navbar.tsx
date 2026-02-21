"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Menu, X, Leaf, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuote } from "@/contexts/QuoteContext";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const router = useRouter();
    const { openQuote } = useQuote();

    // Close suggestions if clicked outside (simplified by onblur/submission)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length === 0) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Categories", href: "/categories" },
        { name: "About", href: "/about" },
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
                <div className="hidden md:flex items-center gap-6">
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

                    {/* Search Bar */}
                    <div className="relative search-container">
                        <form onSubmit={handleSearchSubmit} className={`flex items-center rounded-full px-3 py-2 transition-colors border ${isScrolled ? 'bg-gray-50 border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20' : 'bg-black/20 border-white/20 focus-within:bg-black/40'}`}>
                            <Search size={16} className={cn("flex-shrink-0", isScrolled ? 'text-gray-400' : 'text-white/70')} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
                                className={cn(
                                    "ml-2 bg-transparent text-sm w-36 lg:w-48 focus:outline-none focus:w-48 lg:focus:w-64 transition-all",
                                    isScrolled ? "text-gray-900 placeholder:text-gray-400" : "text-white placeholder:text-white/60"
                                )}
                            />
                        </form>

                        {/* Dropdown Suggestions */}
                        {showSuggestions && searchQuery.trim() !== "" && (
                            <div className="absolute top-full mt-2 w-80 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2">
                                {isSearching ? (
                                    <div className="p-6 text-center text-gray-400 flex justify-center">
                                        <Loader2 size={24} className="animate-spin text-green-600" />
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <>
                                        <div className="max-h-96 overflow-y-auto">
                                            {suggestions.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                                                    onClick={() => { setShowSuggestions(false); router.push(`/products/${item.id}`); setSearchQuery(""); }}
                                                >
                                                    <div className="flex gap-3 items-center flex-1 min-w-0">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{item.category}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="h-8 text-[11px] px-3 bg-green-600 hover:bg-green-700 font-bold whitespace-nowrap"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowSuggestions(false);
                                                            openQuote('product', item.name);
                                                        }}
                                                    >
                                                        Get Quote
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setShowSuggestions(false); router.push(`/products?search=${encodeURIComponent(searchQuery)}`); setSearchQuery(""); }}
                                            className="w-full py-3 px-4 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors text-center border-t border-green-100"
                                        >
                                            See all results for "{searchQuery}" →
                                        </button>
                                    </>
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        No products match "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
