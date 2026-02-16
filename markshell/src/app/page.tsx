import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import About from "@/components/sections/About";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <FeaturedProducts />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
