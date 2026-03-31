import Hero from '../components/Hero'
import About from '../components/About'
import Events from '../components/Events'
import Challenges from '../components/Challenges'
import HallOfFame from '../components/HallOfFame'
import Team from '../components/Team'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Events />
      <Challenges />
      <HallOfFame />
      <Team />
      <Gallery />
      <Contact />
    </main>
  )
}
