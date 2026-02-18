export interface Product {
    id: string;
    name: string;
    subname?: string;
    category: string;
    material: string;
    image: string;
    price: number;
    badge?: "Best Seller" | "Eco Kit" | "Coming Soon" | "New Arrival" | "Bulk Deal";
    specs: {
        length?: string;
        pack: string;
        case: string;
        grade: string;
        waxFree?: boolean;
        splinterFree?: boolean;
        sharpEdge?: boolean;
    };
    isAvailable: boolean;
    // New fields for Single Product Page
    images?: string[];
    longDescription?: string;
    weight?: string;
    cartonQuantity?: string;
}

export const products: Product[] = [
    {
        id: "1",
        name: "160mm Heavy-Duty Spoon",
        subname: "Premium Birchwood • Wax-free",
        category: "Spoons",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.a1z8KVG-jQ5kU1v6htuZ-AHaE7?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        price: 45.00,
        badge: "Best Seller",
        specs: { length: "160mm", pack: "100/bag", case: "2000 pcs", grade: "A+", waxFree: true },
        isAvailable: true,
        images: [
            "https://th.bing.com/th/id/OIP.a1z8KVG-jQ5kU1v6htuZ-AHaE7?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
            "https://th.bing.com/th/id/OIP.Qj7g8h9i0j1k2l3m4n5o?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7", // Placeholder
            "https://th.bing.com/th/id/OIP.Rk8l9m0n1o2p3q4r5s?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7", // Placeholder
            "https://th.bing.com/th/id/OIP.Sm0n1o2p3q4r5s6t7u?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7"  // Placeholder
        ],
        longDescription: "Our 160mm Heavy-Duty Birchwood Spoon is engineered for strength and sustainability. Crafted from 100% renewable white birch, these spoons feature a reinforced handle and a deep bowl design, making them perfect for hot soups, heavy stews, and ice cream. The wax-free, splinter-free finish ensures a smooth mouthfeel without any woody aftertaste.",
        weight: "3.2g / unit",
        cartonQuantity: "2,000 pcs / ctn"
    },
    {
        id: "2",
        name: "160mm Reinforced Fork",
        subname: "Premium Birchwood • Splinter-free",
        category: "Forks",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.XQ7WPWYl6bz8Dw5DyAMvJAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        price: 45.00,
        specs: { length: "160mm", pack: "100/bag", case: "2000 pcs", grade: "A+", splinterFree: true },
        isAvailable: true,
        longDescription: "Designed to tackle tough foods, our Reinforced Birchwood Fork features sharp, sturdy tines that won't snap under pressure. Ideal for salads, meats, and pasta.",
        weight: "2.8g / unit",
        cartonQuantity: "2,000 pcs / ctn"
    },
    {
        id: "3",
        name: "165mm Serrated Knife",
        subname: "Premium Birchwood • Sharp Edge",
        category: "Knives",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.wz-ZU1-IXcsJpctkI4atBQHaE8?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        price: 42.50,
        specs: { length: "165mm", pack: "100/bag", case: "2000 pcs", grade: "A+", sharpEdge: true },
        isAvailable: true,
        longDescription: "A fully functional wooden knife with a serrated edge capable of cutting through steak and chicken. A sustainable alternative to single-use plastics.",
        weight: "2.5g / unit",
        cartonQuantity: "2,000 pcs / ctn"
    },
    {
        id: "4",
        name: "Complete Cutlery Kit 3-in-1",
        subname: "Spoon, Fork, Napkin + Kraft Paper Wrap",
        category: "Kits (Set of 3)",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        price: 125.00,
        badge: "Eco Kit",
        specs: { pack: "500 kits", case: "500 kits", grade: "A" },
        isAvailable: true,
        longDescription: "The ultimate hygienic solution for takeout and delivery. Each kit contains a heavy-duty spoon, fork, and napkin, sealed in an unbleached kraft paper wrapper.",
        weight: "12g / kit",
        cartonQuantity: "500 kits / ctn"
    },
    {
        id: "5",
        name: "140mm Dessert Spoon",
        subname: "Bamboo • Smooth Finish",
        category: "Spoons",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.2W2pL0A0NsL6vtKPqvGlGQHaGy?w=211&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        price: 55.00,
        badge: "Coming Soon",
        specs: { length: "140mm", pack: "100/bag", case: "2000 pcs", grade: "A" },
        isAvailable: false,
    },
    {
        id: "6",
        name: "110mm Mini Fork",
        subname: "Birchwood • For Fruits & Fries",
        category: "Forks",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.Ov4txxrkn6_B24NO2WflOgHaHY?w=179&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        price: 32.00,
        specs: { length: "110mm", pack: "500/bag", case: "5000 pcs", grade: "A" },
        isAvailable: true,
        weight: "1.2g / unit",
        cartonQuantity: "5,000 pcs / ctn"
    },
    {
        id: "7",
        name: "140mm Coffee Stirrer",
        subname: "Birchwood • Round Ends",
        category: "Stirrers",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.8v3Z4Y6b5X7c9Q8e1f2g3h?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 18.50,
        specs: { length: "140mm", pack: "1000/bag", case: "10000 pcs", grade: "A" },
        isAvailable: true,
    },
    {
        id: "8",
        name: "110mm Ice Cream Spoon",
        subname: "Birchwood • Flat Profile",
        category: "Spoons",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.9w4X5Y7c6Z8d0E1f2g3h?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 28.00,
        specs: { length: "110mm", pack: "100/bag", case: "2000 pcs", grade: "A" },
        isAvailable: true,
    },
    {
        id: "9",
        name: "180mm Long Handle Spoon",
        subname: "Bamboo • For Parfaits",
        category: "Spoons",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.0x5Y6Z7a8B9c1D2e3f4g?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 65.00,
        badge: "New Arrival",
        specs: { length: "180mm", pack: "50/bag", case: "1000 pcs", grade: "Premium" },
        isAvailable: true,
    },
    {
        id: "10",
        name: "Standard Cutlery Kit 2-in-1",
        subname: "Spoon, Napkin",
        category: "Kits (Set of 3)",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.1y6Z7a8B9c0D1e2f3g4h?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 95.00,
        specs: { pack: "500 kits", case: "500 kits", grade: "A" },
        isAvailable: true,
    },
    {
        id: "11",
        name: "160mm Compostable Knife",
        subname: "Bamboo • Enhanced Strength",
        category: "Knives",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.2z7A8b9C0d1E2f3g4H5i?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 58.00,
        specs: { length: "160mm", pack: "100/bag", case: "2000 pcs", grade: "A+" },
        isAvailable: true,
    },
    {
        id: "12",
        name: "140mm Chip Fork",
        subname: "Birchwood • Two Prong",
        category: "Forks",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.3a8B9c0D1e2F3g4H5i6j?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 25.00,
        badge: "Bulk Deal",
        specs: { length: "140mm", pack: "1000/bag", case: "5000 pcs", grade: "B" },
        isAvailable: true,
    },
    {
        id: "13",
        name: "200mm Salad Server Set",
        subname: "Bamboo • Spoon & Fork Pair",
        category: "Kits (Set of 3)",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.4b9C0d1E2f3G4h5I6j7k?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 150.00,
        specs: { length: "200mm", pack: "1 set", case: "100 sets", grade: "Premium" },
        isAvailable: true,
    },
    {
        id: "14",
        name: "110mm Coffee Stirrer",
        subname: "Bamboo • Square Ends",
        category: "Stirrers",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.5c0D1e2F3g4H5i6J7k8l?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 22.00,
        specs: { length: "110mm", pack: "1000/bag", case: "20000 pcs", grade: "A" },
        isAvailable: true,
    },
    {
        id: "15",
        name: "160mm Soup Spoon",
        subname: "Birchwood • Deep Bowl",
        category: "Spoons",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.6d1E2f3G4h5I6j7K8l9m?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 48.00,
        badge: "Best Seller",
        specs: { length: "160mm", pack: "100/bag", case: "2000 pcs", grade: "A+" },
        isAvailable: true,
    },
    {
        id: "16",
        name: "160mm Spork",
        subname: "Birchwood • Hybrid Design",
        category: "Spoons",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.7e2F3g4H5i6J7k8L9m0n?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 46.00,
        specs: { length: "160mm", pack: "100/bag", case: "2000 pcs", grade: "A" },
        isAvailable: true,
    },
    {
        id: "17",
        name: "Deluxe Cutlery Kit 4-in-1",
        subname: "Spoon, Fork, Knife, Napkin",
        category: "Kits (Set of 3)",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.8f3G4h5I6j7K8l9M0n1o?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 145.00,
        badge: "Eco Kit",
        specs: { pack: "250 kits", case: "250 kits", grade: "A+" },
        isAvailable: true,
    },
    {
        id: "18",
        name: "150mm Asian Soup Spoon",
        subname: "Bamboo • Traditional Shape",
        category: "Spoons",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.9g4H5i6J7k8L9m0N1o2p?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 60.00,
        specs: { length: "150mm", pack: "50/bag", case: "1000 pcs", grade: "Premium" },
        isAvailable: true,
    },
    {
        id: "19",
        name: "110mm Sample Fork",
        subname: "Bamboo • Two Prong",
        category: "Forks",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.0h5I6j7K8l9M0n1O2p3q?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 35.00,
        specs: { length: "110mm", pack: "500/bag", case: "5000 pcs", grade: "A" },
        isAvailable: true,
    },
    {
        id: "20",
        name: "190mm Steak Knife",
        subname: "Birchwood • Extra Strong",
        category: "Knives",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.1i6J7k8L9m0N1o2P3q4r?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 52.00,
        badge: "Coming Soon",
        specs: { length: "190mm", pack: "100/bag", case: "1500 pcs", grade: "A+" },
        isAvailable: false,
    },
    {
        id: "21",
        name: "140mm Teaspoon",
        subname: "Birchwood • Standard",
        category: "Spoons",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.2j7K8l9M0n1O2p3Q4r5s?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7",
        price: 38.00,
        specs: { length: "140mm", pack: "100/bag", case: "2000 pcs", grade: "A" },
        isAvailable: true,
    }
];
