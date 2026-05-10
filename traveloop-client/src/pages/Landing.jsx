import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { SocialProofSection } from '../components/sections/SocialProofSection';
import { ProblemSection } from '../components/sections/ProblemSection';
import { FlowSection } from '../components/sections/FlowSection';
import { ItineraryShowcaseSection } from '../components/sections/ItineraryShowcaseSection';
import { BudgetSection } from '../components/sections/BudgetSection';
import { ShareSection } from '../components/sections/ShareSection';
import { FeaturesGridSection } from '../components/sections/FeaturesGridSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { CTASection } from '../components/sections/CTASection';

const Landing = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-primary-bg min-h-screen font-body selection:bg-accent-blue selection:text-primary-bg overflow-x-hidden">
      <Navbar />
      
      <main>
        <HeroSection />
        <SocialProofSection />
        <ProblemSection />
        <FlowSection />
        <ItineraryShowcaseSection />
        <BudgetSection />
        <ShareSection />
        <FeaturesGridSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
