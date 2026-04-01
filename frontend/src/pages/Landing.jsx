import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import EventsSection from '../components/sections/EventsSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import HowItWorks from '../components/sections/HowItWorks'
import LeaderboardSection from '../components/sections/LeaderboardSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import TeamSection from '../components/sections/TeamSection'
import Footer from '../components/layout/Footer'
import PageTransition from '../components/ui/PageTransition'

export default function Landing() {
  return (
    <PageTransition>
      <Navbar />
      <Hero />
      <EventsSection />
      <FeaturesSection />
      <HowItWorks />
      <LeaderboardSection />
      <TestimonialsSection />
      <TeamSection />
      <Footer />
    </PageTransition>
  )
}
