import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Search, X, Bell, ChevronDown, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Crm() {
  const { user } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try { const { data } = await api.get('/clients'); setClients(data.data || []); } 
    catch (error) { console.error(error); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/clients', formData);
    setShowModal(false); fetchClients();
  };

  const filteredClients = clients.filter(c => c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()));

  const calculateDynamicIndustryData = () => {
    if (clients.length === 0) return [{ name: 'No Clients Yet', value: 1, color: '#e2e8f0' }];
    const industryCounts = clients.reduce((acc, client) => {
      const ind = client.industry || 'Other';
      acc[ind] = (acc[ind] || 0) + 1;
      return acc;
    }, {});
    const colors = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6'];
    return Object.entries(industryCounts).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  };

  const dynamicIndustryData = calculateDynamicIndustryData();
  const crmRevenueData = [{ month: 'Jan', rev: 45 }, { month: 'Feb', rev: 52 }, { month: 'Mar', rev: 48 }, { month: 'Apr', rev: 61 }, { month: 'May', rev: Object.keys(clients).length * 12 }, { month: 'Jun', rev: Object.keys(clients).length * 15 + 30 }];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input required placeholder="Company Name" onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500" />
              <input required placeholder="Industry" onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500" />
              <input required placeholder="Contact Name" onChange={(e) => setFormData({...formData, contactName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500" />
              <input type="email" required placeholder="Contact Email" onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500" />
              <button type="submit" className="w-full py-3 mt-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700">Save Client</button>
            </form>
          </div>
        </div>
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* UNIFIED EXACT NAVBAR */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50">
              Main Organization <ChevronDown size={14}/>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium hidden md:flex">
              <Calendar size={14}/> Mar 1 - Mar 31, 2026 <ChevronDown size={14}/>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-[250px] hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:border-emerald-500" />
            </div>
            <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} className="text-slate-600 hover:text-emerald-600" />
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden cursor-default text-center p-4">
                  <p className="text-xs text-slate-500">No new notifications</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Recruiter'}</p>
                <p className="text-[10px] text-slate-500 leading-tight">System Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200 uppercase">{user?.name?.charAt(0) || 'U'}</div>
            </div>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Client Directory</h2>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-emerald-700 transition-colors"><PlusCircle size={16} /> New Client</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Revenue Pipeline ($k)</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={crmRevenueData}>
                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="rev" stroke="#10b981" strokeWidth={3} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Clients by Industry (Live DB)</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dynamicIndustryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={5}>
                      {dynamicIndustryData.map((e, i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <div key={client.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100 uppercase">{client.companyName.charAt(0)}</div>
                  <div><h3 className="font-bold text-slate-900">{client.companyName}</h3><p className="text-xs text-slate-500">{client.industry}</p></div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{client.contactName}</p>
                    <p className="text-[10px] text-slate-500">{client.email}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">ACTIVE</span>
                </div>
              </div>
            ))}
            {filteredClients.length === 0 && <p className="text-center text-slate-400 py-10 col-span-3 text-sm">No clients found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}