export interface Product {
    id: string;
    name: string;
    subname?: string;
    category: string;
    material: string;
    image: string;
    badge?: "Best Seller" | "Eco Kit" | "Coming Soon";
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
}

export const products: Product[] = [
    {
        id: "1",
        name: "160mm Heavy-Duty Spoon",
        subname: "Premium Birchwood • Wax-free",
        category: "Spoons",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.a1z8KVG-jQ5kU1v6htuZ-AHaE7?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        badge: "Best Seller",
        specs: {
            length: "160mm",
            pack: "100/bag",
            case: "2000 pcs",
            grade: "A+",
            waxFree: true,
        },
        isAvailable: true,
    },
    {
        id: "2",
        name: "160mm Reinforced Fork",
        subname: "Premium Birchwood • Splinter-free",
        category: "Forks",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.XQ7WPWYl6bz8Dw5DyAMvJAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        specs: {
            length: "160mm",
            pack: "100/bag",
            case: "2000 pcs",
            grade: "A+",
            splinterFree: true,
        },
        isAvailable: true,
    },
    {
        id: "3",
        name: "165mm Serrated Knife",
        subname: "Premium Birchwood • Sharp Edge",
        category: "Knives",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.wz-ZU1-IXcsJpctkI4atBQHaE8?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        specs: {
            length: "165mm",
            pack: "100/bag",
            case: "2000 pcs",
            grade: "A+",
            sharpEdge: true,
        },
        isAvailable: true,
    },
    {
        id: "4",
        name: "Complete Cutlery Kit 3-in-1",
        subname: "Spoon, Fork, Napkin + Kraft Paper Wrap",
        category: "Kits (Set of 3)",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.cReDVrYrRmr1FfSbtumvcAHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        badge: "Eco Kit",
        specs: {
            pack: "500 kits",
            case: "500 kits",
            grade: "A",
        },
        isAvailable: true,
    },
    {
        id: "5",
        name: "140mm Dessert Spoon",
        subname: "Bamboo • Smooth Finish",
        category: "Spoons",
        material: "Bamboo",
        image: "https://th.bing.com/th/id/OIP.2W2pL0A0NsL6vtKPqvGlGQHaGy?w=211&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        badge: "Coming Soon",
        specs: {
            length: "140mm",
            pack: "100/bag",
            case: "2000 pcs",
            grade: "A",
        },
        isAvailable: false,
    },
    {
        id: "6",
        name: "110mm Mini Fork",
        subname: "Birchwood • For Fruits & Fries",
        category: "Forks",
        material: "Birchwood",
        image: "https://th.bing.com/th/id/OIP.Ov4txxrkn6_B24NO2WflOgHaHY?w=179&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        specs: {
            length: "110mm",
            pack: "500/bag",
            case: "5000 pcs",
            grade: "A",
        },
        isAvailable: true,
    },
];
