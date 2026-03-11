import React, { useEffect, useState, useContext, useRef } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import {
  PlusCircle, Search, X, Bell, ChevronDown, Calendar, Users, TrendingUp,
  DollarSign, Briefcase, Mail, Phone, MapPin, Star, MoreVertical, Activity,
  ArrowUpRight, ArrowDownRight, Filter, Download, Eye, Edit2, Trash2,
  CheckCircle, Clock, AlertCircle, Zap, BarChart2, Globe, Shield, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar, Legend
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45, target: 50, deals: 8 },
  { month: 'Feb', revenue: 52, target: 55, deals: 11 },
  { month: 'Mar', revenue: 48, target: 52, deals: 9 },
  { month: 'Apr', revenue: 61, target: 58, deals: 14 },
  { month: 'May', revenue: 73, target: 65, deals: 17 },
  { month: 'Jun', revenue: 68, target: 70, deals: 15 },
  { month: 'Jul', revenue: 82, target: 75, deals: 19 },
  { month: 'Aug', revenue: 91, target: 80, deals: 22 },
];

const PIPELINE_DATA = [
  { stage: 'Lead', count: 24, value: 240 },
  { stage: 'Qualified', count: 16, value: 480 },
  { stage: 'Proposal', count: 9, value: 270 },
  { stage: 'Negotiation', count: 5, value: 200 },
  { stage: 'Closed', count: 3, value: 150 },
];

const ACTIVITY_FEED = [
  { id: 1, type: 'deal', text: 'New deal closed with Stratum Energy', time: '2m ago', icon: CheckCircle, color: '#10b981' },
  { id: 2, type: 'call', text: 'Follow-up call scheduled with Meridian Capital', time: '14m ago', icon: Phone, color: '#3b82f6' },
  { id: 3, type: 'email', text: 'Proposal sent to Luminary Health', time: '1h ago', icon: Mail, color: '#f59e0b' },
  { id: 4, type: 'alert', text: 'Orbital Logistics contract renewal due', time: '3h ago', icon: AlertCircle, color: '#ef4444' },
  { id: 5, type: 'new', text: 'New lead: Apex Manufacturing added', time: '5h ago', icon: Zap, color: '#8b5cf6' },
];

const INDUSTRY_COLORS = {
  Technology: '#10b981', Finance: '#3b82f6', Healthcare: '#ec4899',
  Creative: '#f59e0b', Logistics: '#8b5cf6', Energy: '#06b6d4', Other: '#94a3b8'
};

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!ref.current) ref.current = timestamp;
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return () => { ref.current = null; };
  }, [value]);
  return <span>{prefix}{decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toLocaleString()}{suffix}</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px' }}>
        <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 700 }}>{p.name}: {p.value}{p.name === 'revenue' || p.name === 'target' ? 'k' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

function StatusBadge({ status }) {
  const safeStatus = status || 'active';
  const cfg = {
    active: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981', label: 'Active' },
    prospect: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', dot: '#3b82f6', label: 'Prospect' },
    inactive: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', dot: '#94a3b8', label: 'Inactive' },
  }[safeStatus.toLowerCase()] || { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', dot: '#94a3b8', label: status };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }}></span>
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, trend, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, [delay]);
  const up = trend >= 0;
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '24px',
      transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
      opacity: visible ? 1 : 0,
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.borderColor = color + '40'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: color + '15', filter: 'blur(20px)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: up ? '#10b981' : '#ef4444' }}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>
        {visible ? <AnimatedNumber value={typeof value === 'number' ? value : parseFloat(value)} prefix={typeof value === 'string' && value.startsWith('$') ? '$' : ''} suffix={typeof value === 'string' && value.endsWith('k') ? 'k' : ''} /> : '0'}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ClientCard({ client, index, onDelete }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Safe defaults
  const avatarCol = client.avatar || '#3b82f6';
  const cName = client.companyName || 'Unknown Company';
  const initial = cName.charAt(0).toUpperCase();

  useEffect(() => { setTimeout(() => setVisible(true), index * 80 + 200); }, [index]);
  
  return (
    <div style={{
      background: hovered ? 'linear-gradient(135deg, #1e293b 0%, #162032 100%)' : 'linear-gradient(135deg, #1a2234 0%, #0f172a 100%)',
      border: `1px solid ${hovered ? avatarCol + '40' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 20,
      padding: '24px',
      transition: 'all 0.35s cubic-bezier(0.34,1.1,0.64,1)',
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
      opacity: visible ? 1 : 0,
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: avatarCol + '08', filter: 'blur(25px)', transition: 'all 0.4s' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: avatarCol + '20',
            border: `1.5px solid ${avatarCol}40`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, fontWeight: 800, color: avatarCol,
            fontFamily: "'Syne', sans-serif",
          }}>
            {initial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{cName}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{client.industry || 'Unknown'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <StatusBadge status={client.status || 'active'} />
          <button onClick={() => onDelete(client.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>
            <Trash2 size={12} color="#ef4444" />
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Contact</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{client.contactName || 'N/A'}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{client.contactEmail || client.email || 'N/A'}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Revenue</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: avatarCol, fontFamily: "'Syne', sans-serif" }}>${((client.revenue || 0) / 1000).toFixed(0)}k</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{client.deals || 0} active deals</div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MapPin size={11} color="#475569" />
        <span style={{ fontSize: 11, color: '#475569' }}>{client.location || 'Unknown'}</span>
      </div>

      {/* Revenue bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: `linear-gradient(90deg, ${avatarCol}80, ${avatarCol})`,
            borderRadius: 4, width: `${Math.min(((client.revenue || 0) / 600000) * 100, 100)}%`,
            transition: 'width 1s cubic-bezier(0.34,1.2,0.64,1)',
          }} />
        </div>
      </div>
    </div>
  );
}

export default function Crm() {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({ companyName: '', industry: '', contactName: '', contactEmail: '', phone: '', location: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notification, setNotification] = useState(null);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try { 
      const { data } = await api.get('/clients'); 
      const remoteClients = data.data || [];
      const colors = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4'];
      const enriched = remoteClients.map((c, i) => ({
        ...c,
        avatar: colors[i % colors.length],
        revenue: c.revenue || Math.floor(Math.random() * 200000) + 30000,
        deals: c.deals || Math.floor(Math.random() * 5) + 1,
        status: (c.status || 'active').toLowerCase(),
      }));
      setClients(enriched);
    } catch (error) { console.error(error); }
  };

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clients', formData);
      setShowModal(false);
      setFormData({ companyName: '', industry: '', contactName: '', contactEmail: '', phone: '', location: '' });
      notify('Client added successfully!');
      fetchClients();
    } catch (err) {
      notify('Failed to add client', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      notify('Client removed.', 'warning');
      fetchClients();
    } catch (err) {
      notify('Failed to delete client', 'error');
    }
  };

  const filtered = clients.filter(c => {
    const safeCompany = c.companyName || '';
    const safeContact = c.contactName || '';
    const matchSearch = safeCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeContact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || (c.status && c.status.toLowerCase() === filterStatus);
    return matchSearch && matchFilter;
  });

  const industryData = Object.entries(
    clients.reduce((acc, c) => { const k = c.industry || 'Other'; acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value, color: INDUSTRY_COLORS[name] || '#94a3b8' }));

  const totalRevenue = clients.reduce((s, c) => s + (c.revenue || 0), 0);
  const activeClients = clients.filter(c => !c.status || c.status.toLowerCase() === 'active').length;
  const totalDeals = clients.reduce((s, c) => s + (c.deals || 0), 0);

  const tabs = ['overview', 'clients', 'pipeline', 'activity'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#080e1a', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#f1f5f9', overflowX: 'hidden' }}>
      {/* Global CSS handled in index.css */}

      {notification && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: notification.type === 'success' ? 'linear-gradient(135deg, #064e3b, #065f46)' : 'linear-gradient(135deg, #451a03, #78350f)',
          border: `1px solid ${notification.type === 'success' ? '#10b98140' : '#f59e0b40'}`,
          borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', animation: 'slideIn 0.4s ease',
          backdropFilter: 'blur(20px)',
        }}>
          <CheckCircle size={16} color={notification.type === 'success' ? '#10b981' : '#f59e0b'} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{notification.msg}</span>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(160deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '36px', width: '100%', maxWidth: 460, position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', animation: 'fadeIn 0.35s cubic-bezier(0.34,1.4,0.64,1)' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
              <X size={16} />
            </button>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>New Record</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}>Add Client</h2>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'companyName', placeholder: 'Company Name', icon: Briefcase },
                { key: 'industry', placeholder: 'Industry', icon: Globe },
                { key: 'contactName', placeholder: 'Contact Name', icon: Users },
                { key: 'contactEmail', placeholder: 'Email Address', icon: Mail, type: 'email' },
                { key: 'phone', placeholder: 'Phone Number', icon: Phone },
                { key: 'location', placeholder: 'Location (City, State)', icon: MapPin },
              ].map(({ key, placeholder, icon: Icon, type = 'text' }) => (
                <div key={key} style={{ position: 'relative' }}>
                  <Icon size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                  <input required type={type} placeholder={placeholder} value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px 12px 38px', fontSize: 13, color: '#f1f5f9', outline: 'none', transition: 'all 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#10b981'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              ))}
              <button type="submit" style={{ width: '100%', padding: '14px', marginTop: 8, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.3)'; }}>
                Save Client
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Sidebar Component */}
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <header style={{
          height: 60, borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', background: 'rgba(8,14,26,0.95)', backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>CRM Portal</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>March 2026 · Main Organization</div>
            </div>
            <div style={{ height: 24, width: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', gap: 4 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: activeTab === tab ? 'rgba(16,185,129,0.12)' : 'transparent',
                  color: activeTab === tab ? '#10b981' : '#475569',
                  border: activeTab === tab ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                }}>{tab}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="text" placeholder="Search clients..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: 220, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '7px 12px 7px 34px', fontSize: 12, color: '#f1f5f9', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#10b981'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', position: 'relative', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <Bell size={15} />
                <span style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', border: '1px solid #080e1a' }} className="glow-dot" />
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', right: 0, top: 46, width: 300, background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>Notifications</div>
                  {ACTIVITY_FEED.slice(0, 3).map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'default' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={13} color={item.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500 }}>{item.text}</div>
                          <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{item.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button onClick={() => setShowModal(true)} style={{
              display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700,
              color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.35)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.35)'; }}>
              <PlusCircle size={14} /> New Client
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #064e3b, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#10b981', border: '1.5px solid rgba(16,185,129,0.3)', fontFamily: "'Syne', sans-serif" }}>
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>Dashboard Overview</h1>
                <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>Track performance, revenue, and client relationships</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <StatCard icon={Users} label="Total Clients" value={clients.length} sub={`${activeClients} active`} trend={12} color="#10b981" delay={0} />
                <StatCard icon={DollarSign} label="Total Revenue" value={Math.floor(totalRevenue / 1000)} sub="thousands USD" trend={18} color="#3b82f6" delay={100} />
                <StatCard icon={Briefcase} label="Active Deals" value={totalDeals} sub="across all clients" trend={-4} color="#f59e0b" delay={200} />
                <StatCard icon={TrendingUp} label="Avg Deal Value" value={Math.floor(totalRevenue / Math.max(totalDeals, 1) / 1000)} sub="thousands USD" trend={9} color="#8b5cf6" delay={300} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Revenue Pipeline</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}>$<AnimatedNumber value={totalRevenue / 1000} decimals={0} />k</div>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {[{ label: 'Revenue', color: '#10b981' }, { label: 'Target', color: '#3b82f6' }].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                          <span style={{ width: 20, height: 2, background: l.color, borderRadius: 2, display: 'inline-block' }} />
                          {l.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gTgt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" name="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gRev)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="target" name="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 4" fill="url(#gTgt)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                  <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Industry Mix</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>{clients.length} Clients</div>
                  <div style={{ height: 160 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={industryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={4} startAngle={90} endAngle={-270}>
                          {industryData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {industryData.map(d => (
                      <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{d.name}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
                <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                  <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Monthly Deals Closed</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Deal Velocity</div>
                  <div style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={REVENUE_DATA} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="deals" name="deals" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                          {REVENUE_DATA.map((_, i) => (
                            <Cell key={i} fill={`rgba(139,92,246,${0.4 + (i / REVENUE_DATA.length) * 0.6})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                  <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Live Feed</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Recent Activity</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {ACTIVITY_FEED.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: i < ACTIVITY_FEED.length - 1 ? 14 : 0, marginBottom: i < ACTIVITY_FEED.length - 1 ? 14 : 0, borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: item.color + '15', border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={13} color={item.color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500, lineHeight: 1.4 }}>{item.text}</div>
                            <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{item.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>Client Directory</h1>
                  <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{filtered.length} of {clients.length} clients shown</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['all', 'active', 'prospect', 'inactive'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: filterStatus === f ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                      border: filterStatus === f ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      color: filterStatus === f ? '#10b981' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                    }}>{f}</button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#475569' }}>
                  <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontSize: 15, fontWeight: 600 }}>No clients found</p>
                  <p style={{ fontSize: 12, marginTop: 6 }}>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {filtered.map((client, i) => (
                    <ClientCard key={client.id} client={client} index={i} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>Sales Pipeline</h1>
                <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>Track deals from lead to close</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
                {PIPELINE_DATA.map((stage, i) => {
                  const stageColors = ['#64748b', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'];
                  const color = stageColors[i];
                  const pct = (stage.count / PIPELINE_DATA[0].count) * 100;
                  return (
                    <div key={stage.stage} style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: `1px solid ${color}25`, borderRadius: 20, padding: 20, transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '50'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = color + '25'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{stage.stage}</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: color, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{stage.count}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>${stage.value}k value</div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Client Revenue Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {clients.sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).map((client, i) => (
                    <div key={client.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 120, fontSize: 12, fontWeight: 600, color: '#94a3b8', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.companyName}</div>
                      <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${((client.revenue || 0) / Math.max(1, ...clients.map(c => c.revenue || 0))) * 100}%`,
                          background: `linear-gradient(90deg, ${client.avatar || '#3b82f6'}60, ${client.avatar || '#3b82f6'})`,
                          borderRadius: 10,
                          transition: 'width 1.2s cubic-bezier(0.34,1.1,0.64,1)',
                        }} />
                      </div>
                      <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: client.avatar || '#3b82f6', textAlign: 'right', flexShrink: 0 }}>${((client.revenue || 0) / 1000).toFixed(0)}k</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>Activity Log</h1>
                <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>All team interactions and updates</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Timeline</div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.04)' }} />
                    {[...ACTIVITY_FEED, ...ACTIVITY_FEED.map(a => ({ ...a, id: a.id + 10, time: '1d ago' }))].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={`${item.id}-${i}`} style={{ display: 'flex', gap: 16, marginBottom: 20, paddingLeft: 4 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: item.color + '20', border: `2px solid ${item.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                            <Icon size={13} color={item.color} />
                          </div>
                          <div style={{ flex: 1, paddingTop: 4 }}>
                            <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{item.text}</div>
                            <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{item.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Emails Sent', value: 47, color: '#3b82f6', icon: Mail },
                    { label: 'Calls Made', value: 23, color: '#10b981', icon: Phone },
                    { label: 'Deals Closed', value: totalDeals, color: '#f59e0b', icon: CheckCircle },
                    { label: 'New Leads', value: 12, color: '#8b5cf6', icon: Star },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={16} color={s.color} />
                          </div>
                          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{s.label}</span>
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}