import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/sections/AboutSection";
import HowItWorksSection from "@/sections/HowItWorksSection";
import PredictionSection from "@/sections/PredictionSection";
import FooterSection from "@/sections/FooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-alabaster text-charcoal">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <PredictionSection />
      <FooterSection />
    </main>
  );
}
