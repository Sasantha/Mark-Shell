"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, User } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

const AdminHeader = () => {
    const [newInquiryCount, setNewInquiryCount] = useState(0);

    useEffect(() => {
        const fetchNewInquiryCount = async () => {
            try {
                const response = await adminFetch('/api/inquiries');
                if (response.ok) {
                    const data = await response.json();
                    setNewInquiryCount(data.filter((i: any) => i.status === 'new').length);
                }
            } catch (error) {
                console.error("Failed to fetch inquiry notifications:", error);
            }
        };

        fetchNewInquiryCount();
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">
                Welcome back, Admin
            </div>
            <div className="flex items-center gap-4">
                <Link href="/admin/inquiries" className="relative text-gray-500 hover:text-gray-700" aria-label={`${newInquiryCount} new inquiries`}>
                    <Bell size={20} />
                    {newInquiryCount > 0 && (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                </Link>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={18} />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
