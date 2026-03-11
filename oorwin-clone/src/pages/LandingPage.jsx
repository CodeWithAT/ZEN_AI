import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // IMPORTED HOOK
import { 
  ChevronDown, Sparkles, ShieldCheck, Star, Users, Menu, X, 
  Briefcase, HeartHandshake, Globe, Building, Puzzle, Award,
  Search, Bell, LayoutDashboard, MessageSquare, PieChart, Settings,
  ArrowRight, CheckCircle2, Bot, Rocket, LineChart, Target, Zap,
  Filter, Handshake, RefreshCw, Database, Webhook, Key, Lock,
  Slack, Chrome, Mail, Cloud, Trello, Figma, Plus, Minus,
  Play, Apple, Building2, Monitor, Stethoscope, CircleDollarSign,
  ShoppingCart, Factory, Shield, FileCheck, LockKeyhole
} from 'lucide-react';
import api from '../api';

// --- 1. HELPER COMPONENT ---
const AnimatedCounter = ({ end, duration = 2, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [end, duration, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// --- 2. HEADER SECTION ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // HOOK INITIALIZED

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <div className="bg-[#0a0d1a] text-gray-400 text-xs py-2 px-4 flex justify-center items-center gap-8 hidden md:flex border-b border-white/5">
        <div className="flex items-center gap-2"><Users size={14} className="text-accent-blue" /><span>Trusted by 1,000+ customers</span></div>
        <div className="flex items-center gap-2"><Star size={14} className="text-yellow-400 fill-yellow-400" /><span>G2 4.7 Star Rating</span></div>
        <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-400" /><span>Advanced Data Security</span></div>
      </div>
      <nav className={`transition-all duration-300 px-6 py-4 md:px-12 flex justify-between items-center ${isScrolled ? 'bg-primary-navy/90 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-pink flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-primary-navy rounded-full" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">ZEN AI</span>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          {['Product', 'Solution', 'Resources', 'Pricing', 'Company'].map((item) => (
            <div key={item} className="flex items-center gap-1 cursor-pointer group text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {item} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </div>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <span onClick={() => navigate('/login')} className="text-sm font-medium text-gray-300 hover:text-white cursor-pointer">Login</span>
          <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-accent-pink to-accent-purple hover:scale-105 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            Start for Free
          </button>
        </div>
        <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
    </header>
  );
};

// --- 3. HERO SECTION (WITH TEST BUTTON) ---
const Hero = () => {
  const navigate = useNavigate(); // HOOK INITIALIZED
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const runFullProjectTest = async () => {
    try {
      console.log("Testing connection to Backend...");
      const testUser = {
        name: "Abhay Tiwari",
        email: `test_${Math.floor(Math.random() * 1000)}@oorwin.com`,
        password: "password123"
      };

      const response = await api.post('/auth/register', testUser);

      if (response.data.success) {
        alert(`🚀 SUCCESS! \n\nUser "${testUser.name}" saved into your local dev.db database.\nEmail: ${testUser.email}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ CONNECTION FAILED: Make sure your backend terminal is running on port 8080!");
    }
  };

  return (
    <section className="relative pt-40 pb-32 px-6 flex flex-col items-center text-center overflow-hidden bg-hero-gradient">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div variants={fadeUp} className="mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 backdrop-blur-sm">
            <Sparkles size={16} className="text-accent-purple" />
            <span className="text-accent-purple text-xs font-bold tracking-wider uppercase">Hire Quality Talent Fast</span>
          </div>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[80px] font-extrabold text-white tracking-tight leading-[1.1]">
          AI-Powered <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-pink to-accent-purple bg-[length:200%_auto] animate-gradient">
            Talent Intelligence
          </span> <br className="hidden md:block" />
          Platform
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl font-medium">
          All-In-One ATS, HRMS and CRM in one Intelligent Platform.
        </motion.p>
        
        {/* BUTTONS CONTAINER */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
          <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-[#5B73E8] to-[#8B5CF6] text-white px-8 py-4 rounded-full font-semibold shadow-[0_0_20px_rgba(91,115,232,0.3)] hover:scale-105 transition-all">
            Start for Free
          </button>
          
          <button 
            onClick={runFullProjectTest}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all hover:scale-105"
          >
            RUN SYSTEM TEST ⚡
          </button>

          <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white px-8 py-4 rounded-full font-semibold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 transition-all">
            Book a Demo
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- 4. DASHBOARD PREVIEW ---
const DashboardPreview = () => (
  <section className="relative -mt-20 px-6 z-20 pb-20">
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex h-[600px]"
    >
      <div className="w-64 bg-slate-50 border-r border-gray-200 p-6 hidden md:flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent-purple flex items-center justify-center"><LayoutDashboard size={16} className="text-white"/></div>
          <span className="font-bold text-slate-800">Oorwin Workspace</span>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-3 p-3 bg-accent-purple/10 text-accent-purple rounded-xl"><LayoutDashboard size={18} /> Dashboard</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl"><Briefcase size={18} /> Jobs</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl"><Users size={18} /> Applicants</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl"><MessageSquare size={18} /> Messages</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl"><PieChart size={18} /> Reports</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl mt-auto"><Settings size={18} /> Settings</div>
        </nav>
      </div>
      <div className="flex-1 bg-white flex flex-col">
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Good Morning, John! 👋</h2>
            <p className="text-xs text-slate-500">Here is what's happening today.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-full text-sm outline-none focus:border-accent-purple" />
            </div>
            <div className="relative">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-pink rounded-full border-2 border-white"></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-blue to-accent-pink p-0.5">
              <div className="w-full h-full rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-hidden flex flex-col gap-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Jobs", val: "24", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active Applicants", val: "156", color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Interviews", val: "18", color: "text-pink-600", bg: "bg-pink-50" },
              { label: "Successful Hires", val: "8", color: "text-green-600", bg: "bg-green-50" }
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-4 rounded-xl border border-gray-100`}>
                <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
                <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h3>
              </div>
            ))}
          </div>
          <div className="flex-1 border border-gray-100 rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-700">Open Positions</h3>
              <button className="text-xs font-medium text-accent-purple">View All</button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                { pos: "Senior React Developer", rec: "Sarah Jenkins", status: "Active", app: "45", int: "4" },
                { pos: "Product Manager", rec: "Mike Ross", status: "Urgent", app: "12", int: "1" },
                { pos: "UX Designer", rec: "Sarah Jenkins", status: "Active", app: "28", int: "3" }
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                  <div className="w-1/3">
                    <p className="font-semibold text-sm text-slate-800">{row.pos}</p>
                    <p className="text-xs text-slate-500">{row.rec}</p>
                  </div>
                  <div className="w-1/4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${row.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{row.status}</span>
                  </div>
                  <div className="w-1/4 text-xs text-slate-500 flex gap-4">
                    <span><strong className="text-slate-700">{row.app}</strong> App</span>
                    <span><strong className="text-slate-700">{row.int}</strong> Int</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

// --- 5. STATS COUNTER ---
const StatsCounter = () => (
  <section className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { icon: <Building size={24} className="text-accent-blue" />, num: 2, suffix: "k+", label: "RECRUITERS", bg: "bg-blue-50" },
        { icon: <Users size={24} className="text-accent-pink" />, num: 7, suffix: "k+", label: "ACTIVE USERS", bg: "bg-pink-50" },
        { icon: <Puzzle size={24} className="text-accent-purple" />, num: 48, suffix: "+", label: "INTEGRATIONS", bg: "bg-purple-50" },
        { icon: <Award size={24} className="text-yellow-500" />, num: 12, suffix: "+", label: "INDUSTRY AWARDS", bg: "bg-yellow-50" }
      ].map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>{stat.icon}</div>
          <h3 className="text-4xl font-extrabold text-slate-900 mb-1">
            <AnimatedCounter end={stat.num} suffix={stat.suffix} />
          </h3>
          <p className="text-xs font-bold text-slate-500 tracking-widest">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

// --- 6. PRODUCT SECTION ---
const ProductSection = () => (
  <section className="py-24 bg-slate-50 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Integrated Platform</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to find, hire, and manage top talent in one unified system.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Applicant Tracking System", desc: "AI-driven candidate ranking & workflows.", icon: <Briefcase />, gradient: "from-blue-500 to-cyan-400", text: "from-blue-600 to-cyan-500" },
          { title: "Customer Relation Management", desc: "Manage clients & forecasting.", icon: <HeartHandshake />, gradient: "from-pink-500 to-rose-400", text: "from-pink-600 to-rose-500" },
          { title: "Human Resource Management", desc: "Automated onboarding & payroll.", icon: <Users />, gradient: "from-purple-600 to-indigo-500", text: "from-purple-600 to-indigo-600" },
          { title: "Talent Community Platform", desc: "Build private talent pools.", icon: <Globe />, gradient: "from-amber-400 to-orange-500", text: "from-amber-500 to-orange-600" }
        ].map((product, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 flex flex-col h-full transition-all"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-6 shadow-md text-white`}>{product.icon}</div>
            <h3 className={`text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${product.text}`}>{product.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">{product.desc}</p>
            <button className="group flex items-center gap-2 text-xs font-bold tracking-wider text-accent-purple uppercase">
              Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- 7. PARTNER LOGOS ---
const PartnerLogos = () => (
  <section className="py-12 bg-white border-t border-slate-100">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Seamlessly Integrates With</p>
      <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <span className="text-2xl font-black text-slate-800">MONSTER</span>
        <span className="text-2xl font-bold text-slate-800 italic">NPAworldwide</span>
        <span className="text-xl font-bold text-slate-800">LinkedIn Recruiter</span>
        <span className="text-2xl font-bold text-slate-800">Indeed</span>
      </div>
    </div>
  </section>
);

// --- 8. MIDDLE SECTIONS ---
const TestimonialsSection = () => {
  const testimonials = [
    { quote: "Highlights clean UI, unified ATS+CRM, and end-to-end visibility—from sourcing candidates to converting leads.", name: "Arvind K.", title: "Senior Talent Acquisition Specialist", company: "TechFlow Corp", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind" },
    { quote: "Praises seamless ATS integration, intuitive interface, and AI features like smart matching and automated postings, plus analytics.", name: "Sarah M.", title: "HR Director", company: "Global Systems Inc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { quote: "Oorwin has reduced our time-to-hire by 40%. The AI matching is incredibly accurate and saves us countless hours.", name: "Michael Chen", title: "Recruiting Manager", company: "Innovate Solutions", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" }
  ];
  return (
    <section className="py-24 bg-[#f9fafb] px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-slate-900">Loved by leading HR & Talent teams worldwide</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col">
              <div className="flex gap-1 mb-6">{[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">"{t.quote}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                <div><h4 className="font-bold text-slate-900">{t.name}</h4><p className="text-xs text-slate-500">{t.title}</p><p className="text-xs font-medium text-slate-400">{t.company}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AiFeaturesSection = () => {
  const features = [
    { icon: <Bot size={24} />, title: "Automate Hiring Tasks", desc: "Automate repetitive hiring tasks — from job posts to interviews — so your team can focus on what matters." },
    { icon: <Rocket size={24} />, title: "Boost Team Productivity", desc: "Unblock your team's time with smart automation and unified workflows." },
    { icon: <LineChart size={24} />, title: "Make Data-Driven Decisions", desc: "Get real-time insights to hire faster, better, and with confidence." }
  ];
  return (
    <section className="py-24 bg-primary-navy px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="inline-block px-4 py-1.5 rounded-full border border-accent-pink/30 bg-accent-pink/10 text-accent-pink text-xs font-bold tracking-wider mb-6">YOUR AI HIRING AGENT</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Smarter Talent <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">Acquisition</span></h2>
          <p className="text-gray-400 text-lg">Automate hiring tasks, boost team productivity, and make data-driven decisions — all powered by AI.</p>
        </motion.div>
        <div className="flex flex-col gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="group bg-white/5 border border-white/10 hover:border-accent-purple/50 p-6 rounded-2xl backdrop-blur-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white shrink-0">{f.icon}</div>
              <div><h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-pink transition-colors">{f.title}</h3><p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesGridSection = () => {
  const categories = [
    { title: "RECRUITMENT", icon: <Target className="text-accent-blue mb-4" size={28}/>, items: ["Candidate Matching", "Resume Parsing", "Smart Recommendations", "Talent Intelligence", "Workflow Automation"] },
    { title: "SALES / CRM", icon: <Building className="text-accent-pink mb-4" size={28}/>, items: ["Lead Management", "Contact Finder", "Client Tracking", "Sales Pipeline", "Revenue Tracking"] },
    { title: "HR MANAGEMENT", icon: <Users className="text-accent-purple mb-4" size={28}/>, items: ["Employee Management", "Digital Onboarding", "Timesheet Tracking", "Invoice Generation", "Performance Management", "Compliance Tracking", "Contract Staffing", "Expense Management"] },
    { title: "INTEGRATIONS", icon: <Zap className="text-yellow-500 mb-4" size={28}/>, items: ["API Connectivity", "Zapier Integration", "LinkedIn Integration", "VoIP Calling", "Bulk Messaging", "Team Collaboration", "Appointment Scheduling", "Real-time Dashboards"] }
  ];
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto"><h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">One Platform for Talent Intelligence & Workforce Success</h2><p className="text-slate-500">Empower recruiting, sales, and HR teams with unified talent data and real-time insights.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {categories.map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              {cat.icon}<h3 className="text-sm font-bold tracking-widest text-slate-900 mb-6 uppercase border-b border-slate-100 pb-4">{cat.title}</h3>
              <ul className="flex flex-col gap-4">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-slate-600 group"><CheckCircle2 size={18} className="text-accent-purple/50 group-hover:text-accent-purple shrink-0 transition-colors" /><span className="group-hover:text-slate-900 transition-colors">{item}</span></li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    { num: "1", title: "Source Top Talent", icon: <Search size={24} className="text-white" />, desc: "AI-powered sourcing across multiple channels. Find perfect candidates from your database and job boards." },
    { num: "2", title: "Intelligent Screening", icon: <Filter size={24} className="text-white" />, desc: "Automated resume parsing and AI matching. Rank candidates based on skills and experience." },
    { num: "3", title: "Hire with Confidence", icon: <Handshake size={24} className="text-white" />, desc: "Data-driven insights and collaboration tools. Make faster, better hiring decisions." }
  ];
  return (
    <section className="py-24 bg-slate-50 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Transform Your Hiring Process with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink">Intelligent Recruitment</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Efficiently source, screen, and hire top talent with our AI-driven recruitment tools.</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-accent-purple/20 via-accent-pink/20 to-accent-purple/20 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="flex flex-col items-center text-center">
                <div className="relative mb-8 group">
                  <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-slate-50 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-2 border-white z-20">{step.num}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3><p className="text-slate-600 leading-relaxed max-w-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const IntegrationsSection = () => {
  const integrationFeatures = [
    { icon: <RefreshCw size={18}/>, text: "Two-way sync" }, { icon: <Database size={18}/>, text: "Real-time data updates" },
    { icon: <Key size={18}/>, text: "Custom API access" }, { icon: <Webhook size={18}/>, text: "Webhook support" },
    { icon: <Lock size={18}/>, text: "Single sign-on (SSO)" },
  ];
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Seamlessly Connects with 160+ Tools</h2>
        <p className="text-slate-500 mb-16">Integrate with your favorite tools and platforms to keep your workflow uninterrupted.</p>
        <div className="flex flex-wrap justify-center items-center gap-12 mb-16">
          {[
            { icon: <Slack size={40} />, name: "Slack" }, { icon: <Chrome size={40} />, name: "Google Workspace" },
            { icon: <Mail size={40} />, name: "Outlook" }, { icon: <Cloud size={40} />, name: "Salesforce" },
            { icon: <Trello size={40} />, name: "Trello" }, { icon: <Figma size={40} />, name: "Figma" },
          ].map((tool, i) => (
            <motion.div key={i} whileHover={{ scale: 1.1 }} className="flex items-center gap-2 text-slate-400 hover:text-accent-purple grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all cursor-pointer">
              {tool.icon}<span className="font-bold text-xl hidden md:block">{tool.name}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {integrationFeatures.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-sm font-medium text-slate-700 shadow-sm"><span className="text-accent-blue">{feat.icon}</span>{feat.text}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => (
  <section className="py-24 bg-slate-50 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose the Right Plan for Your Team</h2><p className="text-slate-500">Flexible pricing that scales with your business.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">Get Started</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
          <div className="mb-6"><span className="text-4xl font-extrabold text-slate-900">$0</span> <span className="text-slate-500">/month</span></div>
          <button className="w-full py-3 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:border-accent-purple hover:text-accent-purple transition-colors mb-8">Start for Free</button>
          <ul className="flex flex-col gap-4 text-sm text-slate-600">
            {['Up to 5 active jobs', '100 candidate profiles', 'Basic ATS features', 'Email support', '7-day trial'].map((item, i) => (<li key={i} className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent-purple shrink-0" /> {item}</li>))}
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl border-2 border-accent-purple shadow-2xl relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-accent-purple to-accent-pink text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
          <div className="text-xs font-bold text-accent-purple tracking-widest uppercase mb-4 mt-2">Small & Medium Business</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
          <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">Custom Pricing</span></div>
          <button className="w-full py-3 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all mb-8">Contact Sales</button>
          <ul className="flex flex-col gap-4 text-sm text-slate-600">
            {['Unlimited jobs', 'Unlimited candidates', 'Full ATS + CRM', 'AI-powered matching', 'Advanced analytics', 'Priority support', 'Custom integrations'].map((item, i) => (<li key={i} className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent-pink shrink-0" /> <span className="font-medium text-slate-800">{item}</span></li>))}
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">For Large Teams</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
          <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">Custom Pricing</span></div>
          <button className="w-full py-3 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-900 hover:text-slate-900 transition-colors mb-8">Talk to Us</button>
          <ul className="flex flex-col gap-4 text-sm text-slate-600">
            {['Everything in SMB', 'Dedicated account manager', 'Custom workflows', 'API access', 'Advanced security', 'SLA guarantee', 'Onboarding & training'].map((item, i) => (<li key={i} className="flex items-center gap-3"><CheckCircle2 size={18} className="text-slate-800 shrink-0" /> {item}</li>))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: "What is ZEN AI?", a: "ZEN AI automates repetitive tasks like job posting, candidate screening, and interview scheduling. It uses AI to match candidates to roles based on skills, experience, and cultural fit — improving speed and quality of hire." },
    { q: "Can I integrate Oorwin with my existing ATS or HR tools?", a: "Yes! Oorwin integrates seamlessly with 160+ tools. You can sync data across platforms without manual work." },
    { q: "How does AI candidate matching work?", a: "Our AI analyzes job requirements and candidate profiles using deep learning. It considers skills, experience, cultural fit, and behavior patterns to provide highly accurate matches." },
    { q: "Is my data secure?", a: "Yes. Oorwin is ISO 27001 and GDPR compliant. We use enterprise-grade encryption and security protocols." },
    { q: "What kind of support do you offer?", a: "We provide email support for free users, priority support for SMB, and dedicated account managers for enterprise clients." }
  ];
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-accent-purple/50">
              <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-slate-50 transition-colors">
                <span className={`font-bold ${openIndex === i ? 'text-accent-purple' : 'text-slate-800'}`}>{faq.q}</span>
                {openIndex === i ? <Minus size={20} className="text-accent-purple shrink-0" /> : <Plus size={20} className="text-slate-400 shrink-0" />}
              </button>
              {openIndex === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-6 text-slate-600 leading-relaxed bg-white">{faq.a}</motion.div>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MobileAppSection = () => (
  <section className="py-24 bg-gradient-to-br from-[#f8f9ff] to-[#f0ebff] px-6 overflow-hidden">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="relative h-[600px] flex justify-center items-center">
        <div className="w-[280px] h-[580px] bg-white rounded-[3rem] shadow-2xl border-[8px] border-slate-900 relative overflow-hidden flex flex-col">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-20"></div>
          <div className="bg-accent-purple pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-md z-10"><p className="text-xs opacity-80 mb-1">Good morning</p><h3 className="font-bold text-xl">Arvind K.</h3></div>
          <div className="flex-1 bg-slate-50 p-4 flex flex-col gap-4 overflow-hidden">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div><p className="text-xs text-slate-500">Upcoming Interview</p><p className="font-bold text-sm text-slate-800">Sarah Jenkins • UI/UX</p></div>
              <div className="w-8 h-8 rounded-full bg-accent-pink/20 text-accent-pink flex items-center justify-center"><Play size={14} fill="currentColor"/></div>
            </div>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Applicants</p>
              {[1, 2, 3].map(i => (<div key={i} className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3"><div className="w-10 h-10 rounded-full bg-slate-200"></div><div><p className="text-sm font-bold text-slate-800">Candidate {i}</p><p className="text-xs text-slate-500">Matched: 94%</p></div></div>))}
            </div>
          </div>
        </div>
      </motion.div>
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 text-accent-purple text-xs font-bold tracking-wider mb-6">MOBILE APPS</div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Hire On the Go</h2>
        <p className="text-slate-600 text-lg mb-8">Access your entire recruitment workflow from anywhere. Stay connected with candidates and your team.</p>
        <ul className="flex flex-col gap-4 mb-10">
          {['Real-time notifications', 'One-tap candidate actions', 'Offline mode support', 'Secure mobile access', 'Video interview support'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 size={20} className="text-accent-purple"/> {item}</li>))}
        </ul>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"><Apple size={24}/> <div><p className="text-[10px] uppercase leading-none opacity-80">Download on the</p><p className="font-bold leading-none">App Store</p></div></button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"><Play size={20}/> <div><p className="text-[10px] uppercase leading-none opacity-80">GET IT ON</p><p className="font-bold leading-none">Google Play</p></div></button>
        </div>
      </div>
    </div>
  </section>
);

const UseCasesSection = () => {
  const industries = [
    { icon: <Building2 />, title: "Staffing Agencies", desc: "Manage multiple clients and candidates with powerful ATS + CRM." },
    { icon: <Monitor />, title: "Technology", desc: "Hire technical talent with AI-powered skill matching." },
    { icon: <Stethoscope />, title: "Healthcare", desc: "Streamline healthcare recruitment with compliance tracking." },
    { icon: <CircleDollarSign />, title: "Finance", desc: "Recruit financial professionals with advanced screening." },
    { icon: <ShoppingCart />, title: "Retail", desc: "High-volume hiring made easy with automation." },
    { icon: <Factory />, title: "Manufacturing", desc: "Manage seasonal workforce and contract staffing." }
  ];
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">Built for Every Industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-accent-purple mb-6 group-hover:bg-accent-purple group-hover:text-white transition-colors">{ind.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{ind.title}</h3><p className="text-slate-600">{ind.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaAndTrustSection = () => {
  const navigate = useNavigate(); // WIRED NAVIGATION
  return (
    <>
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-primary-navy via-secondary-purple to-accent-purple rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
              <p className="text-lg text-white/80 mb-8">Join 1,000+ companies using Oorwin to hire smarter and faster.</p>
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-bold border border-white/20">🚀 40% faster hiring</span>
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-bold border border-white/20">😊 90% recruiter satisfaction</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <button onClick={() => navigate('/register')} className="w-full md:w-auto bg-gradient-to-r from-accent-pink to-orange-400 hover:scale-105 text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all">Start for Free</button>
              <button className="w-full md:w-auto bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg transition-colors">Book a Demo</button>
              <p className="text-xs text-white/60 mt-2 text-center md:text-right">No credit card required • 7-day free trial</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white px-6 border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-10">Enterprise-Grade Security You Can Trust</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: <Shield size={32} className="text-blue-500 mb-3"/>, text: "ISO 27001", sub: "Info Security" },
              { icon: <Award size={32} className="text-purple-500 mb-3"/>, text: "ISO 9001", sub: "Quality Mgmt" },
              { icon: <LockKeyhole size={32} className="text-green-500 mb-3"/>, text: "GDPR", sub: "EU Compliant" },
              { icon: <FileCheck size={32} className="text-orange-500 mb-3"/>, text: "SOC 2 Type II", sub: "Security" }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center">
                {badge.icon}<p className="font-bold text-slate-800">{badge.text}</p><p className="text-xs text-slate-500 uppercase tracking-wider">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const Footer = () => (
  <footer className="bg-primary-navy pt-20 pb-10 px-6 border-t border-white/10">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
      <div className="lg:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-accent-pink flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-primary-navy rounded-full" />
          </div>
          <span className="text-xl font-bold text-white">ZEN AI</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">The AI-Powered Talent Intelligence Platform. Bringing ATS, CRM, and HRMS together to transform how you find and manage talent.</p>
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full"><ShieldCheck size={14} className="text-green-400"/> GDPR Compliant</div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full"><CheckCircle2 size={14} className="text-blue-400"/> ISO 27001</div>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Products</h4>
        <ul className="flex flex-col gap-3 text-sm text-gray-400">
          <li className="hover:text-white cursor-pointer transition-colors">ATS</li><li className="hover:text-white cursor-pointer transition-colors">CRM</li>
          <li className="hover:text-white cursor-pointer transition-colors">HRMS</li><li className="hover:text-white cursor-pointer transition-colors">Talent Community</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Resources</h4>
        <ul className="flex flex-col gap-3 text-sm text-gray-400">
          <li className="hover:text-white cursor-pointer transition-colors">Blog</li><li className="hover:text-white cursor-pointer transition-colors">Case Studies</li>
          <li className="hover:text-white cursor-pointer transition-colors">Help Center</li><li className="hover:text-white cursor-pointer transition-colors">API Docs</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Company</h4>
        <ul className="flex flex-col gap-3 text-sm text-gray-400">
          <li className="hover:text-white cursor-pointer transition-colors">About Us</li><li className="hover:text-white cursor-pointer transition-colors">Careers</li>
          <li className="hover:text-white cursor-pointer transition-colors">Contact</li><li className="hover:text-white cursor-pointer transition-colors">Partners</li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
      <p>© 2026 Oorwin Clone Project. All rights reserved.</p>
      <div className="flex gap-6"><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span><span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span></div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-dark font-sans selection:bg-accent-pink/30">
      <Header />
      <Hero />
      <DashboardPreview />
      <StatsCounter />
      <ProductSection />
      <PartnerLogos />
      <TestimonialsSection />
      <AiFeaturesSection />
      <FeaturesGridSection />
      <ProcessSection />
      <IntegrationsSection />
      <UseCasesSection />
      <MobileAppSection />
      <PricingSection />
      <FaqSection />
      <CtaAndTrustSection />
      <Footer /> 
    </div>
  );
}