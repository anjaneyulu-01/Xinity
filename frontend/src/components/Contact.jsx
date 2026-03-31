import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Send, Github, Instagram, Linkedin, Twitter, MapPin, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react'

const SOCIALS = [
  { icon: Github,    href: '#', label: 'GitHub',    color: 'hover:bg-slate-800 hover:text-white' },
  { icon: Instagram, href: '#', label: 'Instagram',  color: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent' },
  { icon: Linkedin,  href: '#', label: 'LinkedIn',   color: 'hover:bg-blue-600   hover:text-white hover:border-transparent' },
  { icon: Twitter,   href: '#', label: 'Twitter',    color: 'hover:bg-sky-500     hover:text-white hover:border-transparent' },
]

const INFO = [
  { icon: MapPin, text: 'Marwadi University, Rajkot, Gujarat 360003' },
  { icon: Mail,   text: 'xinity@marwadiuniversity.ac.in' },
  { icon: Phone,  text: '+91 98765 43210' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Contact() {
  const { ref, isInView } = useScrollReveal()
  const [form,   setForm]   = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const fieldClass = (field) =>
    `w-full bg-white dark:bg-gray-800 border rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm
     placeholder:text-slate-400 dark:placeholder:text-gray-500
     focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500
     transition-all duration-200 ${
       errors[field]
         ? 'border-red-400 dark:border-red-500'
         : 'border-slate-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'
     }`

  return (
    <section id="contact" className="section-a py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">
            Get In Touch
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Contact <span className="gradient-text">Us</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto">
            Have a question, idea, or just want to say hi? We'd love to hear from you.
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Form — 3 cols */}
          <motion.div variants={fadeUp} className="lg:col-span-3">
            {status === 'sent' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                className="h-full flex flex-col items-center justify-center gap-4 py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Message Sent!</h3>
                <p className="text-slate-500 dark:text-gray-400">We'll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-full border-2 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all text-sm"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['name', 'email'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 capitalize">
                        {field} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={form[field]}
                        onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }) }}
                        className={fieldClass(field)}
                        placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                      />
                      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }) }}
                    className={`${fieldClass('message')} resize-none`}
                    placeholder="Tell us what's on your mind..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 px-4 py-3 rounded-xl border border-red-200 dark:border-red-500/30">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again.
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center gap-2
                    hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-gray-950
                    disabled:opacity-60 disabled:cursor-not-allowed
                    shadow-md hover:shadow-[0_4px_16px_theme('colors.brand.500/40')]
                    transition-all duration-200 text-base"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Info — 2 cols */}
          <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col gap-6">
            {/* Contact info */}
            <div className="card p-6 space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Contact Info</h3>
              {INFO.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed pt-1.5">{text}</p>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="card p-6">
              <h3 className="font-black text-slate-900 dark:text-white text-lg mb-4">Follow Xinity</h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 text-sm font-semibold transition-all duration-200 ${color}`}
                  >
                    <Icon size={16} />
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 shadow-sm h-48">
              <iframe
                title="Marwadi University"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.562017614742!2d70.77488661495922!3d22.272498785329545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca2c57e70b4b%3A0x49baf12ff1543f1!2sMarwadi%20University!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                className="dark:[filter:invert(90%)_hue-rotate(180deg)]"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400 dark:text-gray-600">
          <p>© 2025 Xinity — Marwadi University. All rights reserved.</p>
          <p>
            Built with{' '}
            <span className="text-brand-500 font-semibold">React + Vite + Tailwind</span>
            {' '}·{' '}
            <span className="text-brand-500 font-semibold">Framer Motion</span>
          </p>
        </div>
      </div>
    </section>
  )
}
