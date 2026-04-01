import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { Briefcase, Gift, CreditCard, Coffee, Award, Ticket, Laptop, ScrollText, MessageCircle, Wifi } from 'lucide-react'

const PERKS = [
  {
    icon: Briefcase,
    title: 'Internship & Jobs',
    desc: 'Get exclusive access to internship opportunities and job offers from top companies.',
    gradient: 'from-[#00e5ff] to-[#0066ff]',
  },
  {
    icon: Gift,
    title: 'Free T-Shirts',
    desc: 'All participants receive a free Xinity T-shirt as a token of appreciation.',
    gradient: 'from-[#7c4dff] to-[#ff4081]',
  },
  {
    icon: CreditCard,
    title: '₹10K+ Credits',
    desc: 'Participants receive credits for cloud services, APIs, and developer tools.',
    gradient: 'from-[#ffd600] to-[#ff9100]',
  },
  {
    icon: Coffee,
    title: 'Complimentary Meals',
    desc: 'Enjoy free meals throughout the event to keep you energized and focused.',
    gradient: 'from-[#00e676] to-[#00b0ff]',
  },
  {
    icon: Award,
    title: 'Cool Swags & Goodies',
    desc: 'Exciting swags like backpacks, mugs, stickers, and more await our participants!',
    gradient: 'from-[#ff4081] to-[#7c4dff]',
  },
  {
    icon: Ticket,
    title: 'Monetary Prizes',
    desc: 'Win attractive monetary prizes for top-performing teams across categories.',
    gradient: 'from-[#0066ff] to-[#00e5ff]',
  },
  {
    icon: ScrollText,
    title: 'Verified Certificates',
    desc: 'Every participant receives a verified certificate to enhance their resume.',
    gradient: 'from-[#00e5ff] to-[#7c4dff]',
  },
  {
    icon: MessageCircle,
    title: 'Mentor Sessions',
    desc: 'Get guidance from industry experts and experienced developers throughout.',
    gradient: 'from-[#ff9100] to-[#ffd600]',
  },
  {
    icon: Wifi,
    title: 'High-Speed Internet',
    desc: 'Dedicated high-speed internet connection for uninterrupted hacking.',
    gradient: 'from-[#00b0ff] to-[#00e676]',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function PerksSection() {
  const { dark } = useTheme()

  return (
    <section className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>
            Perks & Benefits
          </p>
          <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            What You'll <span className="gradient-cyan">Get</span>
          </h2>
          <p className={`text-base max-w-2xl mx-auto ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
            Beyond the competition — we've curated an amazing experience with exclusive perks for all participants.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00e5ff] to-[#7c4dff] mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Perks Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PERKS.map((perk) => {
            const Icon = perk.icon
            return (
              <motion.div
                key={perk.title}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                className="perk-card relative z-10"
              >
                {/* Gradient icon */}
                <div className={`perk-icon bg-gradient-to-br ${perk.gradient}`}>
                  <Icon size={28} className="text-white" />
                </div>
                
                <h3 className={`font-heading font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {perk.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                  {perk.desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-14"
        >
          <a href="#events" className="btn-primary text-base px-8 py-4 btn-glow">
            View Upcoming Events
            <span className="ml-2">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
