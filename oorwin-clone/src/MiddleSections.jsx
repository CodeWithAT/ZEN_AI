import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Bot, Rocket, LineChart, CheckCircle2, 
  Target, Users, Building, Zap 
} from 'lucide-react';

// --- SECTION 7: TESTIMONIALS ---
export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Highlights clean UI, unified ATS+CRM, and end-to-end visibility—from sourcing candidates to converting leads.",
      name: "Arvind K.",
      title: "Senior Talent Acquisition Specialist",
      company: "TechFlow Corp",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind"
    },
    {
      quote: "Praises seamless ATS integration, intuitive interface, and AI features like smart matching and automated postings, plus analytics.",
      name: "Sarah M.",
      title: "HR Director",
      company: "Global Systems Inc",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      quote: "Oorwin has reduced our time-to-hire by 40%. The AI matching is incredibly accurate and saves us countless hours.",
      name: "Michael Chen",
      title: "Recruiting Manager",
      company: "Innovate Solutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    }
  ];

  return (
    <section className="py-24 bg-[#f9fafb] px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Loved by leading HR & Talent teams worldwide
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">"{t.quote}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.title}</p>
                  <p className="text-xs font-medium text-slate-400">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SECTION 8: AI FEATURES SHOWCASE ---
export const AiFeaturesSection = () => {
  const features = [
    { icon: <Bot size={24} />, title: "Automate Hiring Tasks", desc: "Automate repetitive hiring tasks — from job posts to interviews — so your team can focus on what matters." },
    { icon: <Rocket size={24} />, title: "Boost Team Productivity", desc: "Unblock your team's time with smart automation and unified workflows." },
    { icon: <LineChart size={24} />, title: "Make Data-Driven Decisions", desc: "Get real-time insights to hire faster, better, and with confidence." }
  ];

  return (
    <section className="py-24 bg-primary-navy px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side: Text */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent-pink/30 bg-accent-pink/10 text-accent-pink text-xs font-bold tracking-wider mb-6">
            YOUR AI HIRING AGENT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Smarter Talent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">Acquisition</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Automate hiring tasks, boost team productivity, and make data-driven decisions — all powered by AI.
          </p>
        </motion.div>

        {/* Right Side: Stacked Cards */}
        <div className="flex flex-col gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-white/5 border border-white/10 hover:border-accent-purple/50 p-6 rounded-2xl backdrop-blur-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all flex gap-6 items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-pink transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SECTION 9: FEATURES GRID ---
export const FeaturesGridSection = () => {
  const categories = [
    {
      title: "RECRUITMENT", icon: <Target className="text-accent-blue mb-4" size={28}/>,
      items: ["Candidate Matching", "Resume Parsing", "Smart Recommendations", "Talent Intelligence", "Workflow Automation"]
    },
    {
      title: "SALES / CRM", icon: <Building className="text-accent-pink mb-4" size={28}/>,
      items: ["Lead Management", "Contact Finder", "Client Tracking", "Sales Pipeline", "Revenue Tracking"]
    },
    {
      title: "HR MANAGEMENT", icon: <Users className="text-accent-purple mb-4" size={28}/>,
      items: ["Employee Management", "Digital Onboarding", "Timesheet Tracking", "Invoice Generation", "Performance Management", "Compliance Tracking", "Contract Staffing", "Expense Management"]
    },
    {
      title: "INTEGRATIONS", icon: <Zap className="text-yellow-500 mb-4" size={28}/>,
      items: ["API Connectivity", "Zapier Integration", "LinkedIn Integration", "VoIP Calling", "Bulk Messaging", "Team Collaboration", "Appointment Scheduling", "Real-time Dashboards"]
    }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            One Platform for Talent Intelligence & Workforce Success
          </h2>
          <p className="text-slate-500">
            Empower recruiting, sales, and HR teams with unified talent data and real-time insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {cat.icon}
              <h3 className="text-sm font-bold tracking-widest text-slate-900 mb-6 uppercase border-b border-slate-100 pb-4">
                {cat.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-slate-600 group">
                    <CheckCircle2 size={18} className="text-accent-purple/50 group-hover:text-accent-purple shrink-0 transition-colors" />
                    <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};