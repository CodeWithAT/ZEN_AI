import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, Building2, UserCheck, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col z-10 shrink-0 shadow-sm min-h-screen">
      <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center p-0.5">
          <div className="w-full h-full bg-emerald-600 rounded-sm" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-wide">ZEN AI</span>
      </div>
      
      <nav className="flex flex-col gap-1.5 flex-1 text-sm font-medium">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1 pl-2">Workspace</p>
        <div onClick={() => navigate('/dashboard')} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${path === '/dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          <LayoutDashboard size={18} /> ATS Pipeline
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 mb-1 pl-2">Enterprise</p>
        <div onClick={() => navigate('/crm')} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${path === '/crm' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          <Building2 size={18} /> CRM (Clients)
        </div>
        <div onClick={() => navigate('/hrms')} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${path === '/hrms' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          <UserCheck size={18} /> HRMS (Employees)
        </div>
      </nav>

      <button onClick={logout} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-auto font-bold w-full text-left">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}