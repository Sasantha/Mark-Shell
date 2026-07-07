// Shared client-side shapes for API responses (Mongo documents serialized to
// JSON: _id becomes a string `id`, Dates become ISO strings).

export interface Product {
    id: string;
    name: string;
    subname?: string;
    category: string;
    material: string;
    image: string;
    price: number;
    badge?: string;
    specs?: {
        length?: string;
        case?: string;
    };
    isAvailable: boolean;
    images?: string[];
    longDescription?: string;
    weight?: string;
    cartonQuantity?: string;
    isFeatured?: boolean;
    features?: string[];
    pack?: string;
    case?: string;
    grade?: string;
    orderVolumes?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    itemCount: number;
    slug: string;
}

export interface Material {
    id: string;
    name: string;
    description?: string;
}

export interface Partner {
    id: string;
    name: string;
    logo: string;
    websiteUrl?: string;
}

export interface Certification {
    id: string;
    name: string;
    image: string;
    description?: string;
}

export interface Inquiry {
    id: string;
    name: string;
    company?: string;
    contactMethod: "email" | "phone";
    contactValue: string;
    contextType: "general" | "product" | "category";
    contextValue?: string;
    source: "popup" | "contact_page";
    message: string;
    status: "new" | "read" | "resolved";
    createdAt: string;
    updatedAt?: string;
}
