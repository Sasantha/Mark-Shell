import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Partners from "@/components/sections/Partners";
import Features from "@/components/sections/Features";
import About from "@/components/sections/About";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Stats from "@/components/sections/Stats";
import Certifications from "@/components/sections/Certifications";
import CTA from "@/components/sections/CTA";
import MessagePopup from "@/components/ui/MessagePopup";
import { getCertifications, getFeaturedProducts, getPartners } from "@/lib/data";

// Pre-rendered with data from the database. Admin changes refresh it
// immediately (see lib/revalidate.ts); this hourly refresh is a fallback.
export const revalidate = 3600;

export default async function Home() {
  const [featuredProducts, partners, certifications] = await Promise.all([
    getFeaturedProducts(),
    getPartners(),
    getCertifications(),
  ]);

  return (
    <main className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Partners partners={partners} />
      <About />
      <FeaturedProducts products={featuredProducts} />
      <Stats />
      <Certifications certifications={certifications} />
      {/* <Testimonials /> */}
      <CTA />
      <Footer />
      <MessagePopup />
    </main>
  );
}
