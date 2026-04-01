import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const FAQS = [
  {
    question: 'What is Xinity?',
    answer: 'Xinity is a hackathon community platform where students can participate in coding competitions, showcase their projects, and connect with industry mentors. We organize regular hackathons, workshops, and networking events.',
  },
  {
    question: 'Who can participate in Xinity hackathons?',
    answer: 'Our hackathons are open to all college students (undergraduate and postgraduate). Whether you\'re a beginner or an experienced developer, there\'s a place for you. Teams typically consist of 2-4 members.',
  },
  {
    question: 'Is there a registration fee?',
    answer: 'Most of our hackathons are completely free to participate in. For premium events with exclusive perks (accommodation, meals, swag), there may be a nominal registration fee which is mentioned on the event page.',
  },
  {
    question: 'What is the format of hackathons?',
    answer: 'Our hackathons typically run for 24-48 hours. You\'ll receive problem statements, build your solution, and present to judges. We provide mentorship, workshops, and networking sessions throughout the event.',
  },
  {
    question: 'How are projects judged?',
    answer: 'Projects are evaluated by industry experts based on Innovation (25%), Technical Implementation (30%), Presentation (20%), Impact/Usefulness (15%), and Code Quality (10%). Detailed feedback is provided to all participants.',
  },
  {
    question: 'What prizes can I win?',
    answer: 'Winners receive cash prizes (up to ₹1L for grand prize), internship opportunities with partner companies, premium subscriptions (GitHub Pro, cloud credits), exclusive swag, and certificates recognized by industry partners.',
  },
  {
    question: 'Can I participate solo?',
    answer: 'While we encourage teamwork, solo participation is allowed in most events. You can also use our team formation feature to find teammates based on skills and interests.',
  },
  {
    question: 'How do I prepare for a hackathon?',
    answer: 'Brush up on your technical skills, prepare a development environment, and review past winning projects. Join our Discord community for tips, past problem statements, and to connect with experienced hackers.',
  },
]

function FAQItem({ faq, index, isOpen, onToggle, dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="faq-item"
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-4 p-5 text-left transition-colors ${
          isOpen 
            ? dark ? 'bg-white/5' : 'bg-gray-50' 
            : ''
        }`}
      >
        <span className={`font-semibold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 text-sm leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const { dark } = useTheme()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#080818]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
            dark 
              ? 'border-[#00e5ff]/30 bg-[#00e5ff]/5' 
              : 'border-[#0066ff]/30 bg-[#0066ff]/5'
          }`}>
            <HelpCircle size={16} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
            <span className={`text-sm font-medium ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Got Questions?</span>
          </div>
          
          <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Frequently <span className="gradient-cyan">Asked</span> Questions
          </h2>
          <p className={`text-base max-w-xl mx-auto ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
            Everything you need to know about participating in Xinity hackathons.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              dark={dark}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`mt-12 p-6 rounded-2xl text-center border ${
            dark 
              ? 'bg-gradient-to-r from-[#00e5ff]/5 to-[#7c4dff]/5 border-white/10' 
              : 'bg-gradient-to-r from-[#0066ff]/5 to-[#7c4dff]/5 border-gray-200'
          }`}
        >
          <p className={`text-base mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Still have questions? We're here to help!
          </p>
          <a 
            href="mailto:support@xinity.dev" 
            className="btn-ghost text-sm px-6 py-2.5"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  )
}
