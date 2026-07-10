"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Grid, LogOut, Settings, Leaf, Star, Layers, Mail, Handshake, Award, Images } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Categories", href: "/admin/categories", icon: Grid },
        { name: "Materials", href: "/admin/materials", icon: Layers },
        { name: "Featured", href: "/admin/featured", icon: Star },
        { name: "Partners", href: "/admin/partners", icon: Handshake },
        { name: "Certifications", href: "/admin/certifications", icon: Award },
        { name: "About Gallery", href: "/admin/about-gallery", icon: Images },
        { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
        { name: "Profile", href: "/admin/profile", icon: Settings },
    ];

    const handleLogout = () => {
        // Clear mock token
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0f172a] text-white transition-transform">
            <div className="flex h-full flex-col justify-between py-6 px-4">
                <div>
                    {/* Logo */}
                    <Link href="/admin/dashboard" className="mb-10 flex items-center gap-2 px-2">
                        <div className="rounded-full bg-green-600 p-1.5 text-white">
                            <Leaf size={20} fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">MarkShell Admin</span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-green-600 text-white shadow-md shadow-green-900/20"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    <Icon size={18} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/10 hover:text-red-300"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
