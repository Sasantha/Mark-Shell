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

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Partners />
      <About />
      <FeaturedProducts />
      <Stats />
      <Certifications />
      {/* <Testimonials /> */}
      <CTA />
      <Footer />
      <MessagePopup />
    </main>
  );
}
