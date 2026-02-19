"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("admin_token");

            if (!token && !isLoginPage) {
                router.push("/admin/login");
            } else if (token && isLoginPage) {
                router.push("/admin/dashboard");
            } else {
                setIsLoading(false);
            }
        }
    }, [pathname, isLoginPage, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <AdminSidebar />
            <div className="flex flex-1 flex-col ml-64 transition-all">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
