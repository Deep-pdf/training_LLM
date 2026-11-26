import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/sections/AboutSection";
import HowItWorksSection from "@/sections/HowItWorksSection";
import PredictionSection from "@/sections/PredictionSection";
import FooterSection from "@/sections/FooterSection";
import SmoothScroll from "@/components/ui/smooth-scroll";

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen w-full bg-alabaster text-charcoal">
        <Navbar />
        <HeroSection />
        <div className="relative z-10">
          <AboutSection />
          <HowItWorksSection />
          <PredictionSection />
          <FooterSection />
        </div>
      </main>
    </SmoothScroll>
  );
}
