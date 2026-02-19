"use client";

import React from "react";
import { Package, Grid, DollarSign, TrendingUp } from "lucide-react";
import { products, categories } from "@/lib/dummy-data";

const AdminDashboard = () => {
    const stats = [
        {
            name: "Total Products",
            value: products.length,
            icon: Package,
            change: "+12%",
            changeType: "positive",
        },
        {
            name: "Total Categories",
            value: categories.length,
            icon: Grid,
            change: "+0%",
            changeType: "neutral",
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className="rounded-full bg-green-50 p-3 text-green-600">
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span
                                className={`text-xs font-medium ${stat.changeType === "positive"
                                    ? "text-green-600"
                                    : stat.changeType === "negative"
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }`}
                            >
                                {stat.change}
                            </span>
                            <span className="text-xs text-gray-400">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Products */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Recent Products</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Product Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.slice(0, 5).map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isAvailable
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {product.isAvailable ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
