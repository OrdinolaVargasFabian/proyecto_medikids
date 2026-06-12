import { Hero, ImpactSection, ServicesSection, TechPortalSection, SpecialistsSection, TestimonialsSection, FAQSection, Chatbot } from './components';

export const LandingPage = () => {
  return (
    <main className="w-full relative">
      <Hero />
      <ImpactSection />
      <ServicesSection />
      <SpecialistsSection />
      <TechPortalSection />
      <TestimonialsSection />
      <FAQSection />
      <Chatbot />
    </main>
  );
};

