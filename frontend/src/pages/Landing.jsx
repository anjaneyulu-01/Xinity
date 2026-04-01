import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import EventsSection from '../components/sections/EventsSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import HowItWorks from '../components/sections/HowItWorks'
import LeaderboardSection from '../components/sections/LeaderboardSection'
import PerksSection from '../components/sections/PerksSection'
import SponsorsMarquee from '../components/sections/SponsorsMarquee'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import FAQSection from '../components/sections/FAQSection'
import CTASection from '../components/sections/CTASection'
import TeamSection from '../components/sections/TeamSection'
import Footer from '../components/layout/Footer'
import PageTransition from '../components/ui/PageTransition'

export default function Landing() {
  return (
    <PageTransition>
      <Navbar />
      <Hero />
      <SponsorsMarquee />
      <EventsSection />
      <FeaturesSection />
      <HowItWorks />
      <PerksSection />
      <LeaderboardSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <TeamSection />
      <Footer />
    </PageTransition>
  )
}
