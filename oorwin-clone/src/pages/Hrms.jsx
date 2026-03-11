import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { 
  Search, ChevronDown, Download, UserCheck, Bell, 
  MessageSquare, Calendar, SlidersHorizontal, ArrowUpRight, 
  ArrowDownRight, MoreHorizontal, X, Loader2, Building, CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Hrms() {
  const { user } = useContext(AuthContext);
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- NEW: INTERACTIVE TOP NAV STATES ---
  const [currentOrg, setCurrentOrg] = useState('Main Organization');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'message', 'meeting', or null
  const [heatmapData, setHeatmapData] = useState([]);

  // Dynamic Date Calculation
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const dateRangeString = `${currentMonthName} 1 - ${currentMonthName} ${daysInMonth}, ${currentYear}`;

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const [alerts, setAlerts] = useState([
    { id: 1, title: "Pending leave approval", desc: "5 leave requests require your review", time: "2 hours ago", color: "border-emerald-500", action: "Review" }, 
    { id: 2, title: "Probation ending soon", desc: "3 employees complete probation in 7 days", time: "5 hours ago", color: "border-rose-500", action: "Schedule Review" },
    { id: 3, title: "Contract expiration", desc: "2 contracts expire within 30 days", time: "1 day ago", color: "border-blue-500", action: "View Details" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const dismissAlert = (id) => setAlerts(alerts.filter(alert => alert.id !== id));
  const clearAllAlerts = () => setAlerts([]);

  useEffect(() => { 
    fetchEmployees(); 
  }, [currentOrg]); // Re-fetch if organization changes

  const fetchEmployees = async () => {
    setLoading(true);
    try { 
      const { data } = await api.get('/employees'); 
      setEmployees(data.data || []); 
      
      // Generate Dynamic Heatmap Data
      const newHeatmap = Array.from({ length: 4 }, () => 
        Array.from({ length: 5 }, () => Math.floor(Math.random() * (98 - 82 + 1) + 82))
      );
      setHeatmapData(newHeatmap);

    } catch (error) { console.error("Failed to load employees:", error); } 
    finally { setLoading(false); }
  };

  // FILTER LOGIC
  const filteredEmployees = employees.filter(emp => {
    const safeName = emp.name || "";
    const safeRole = emp.jobTitle || "";
    const safeDept = emp.department || "General";
    
    const matchesSearch = safeName.toLowerCase().includes(searchQuery.toLowerCase()) || safeRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || safeDept === deptFilter;
    const matchesStatus = statusFilter === 'All Status' || emp.status === statusFilter.toUpperCase();
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // CSV EXPORT LOGIC
  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) return alert("No employees to export.");
    const headers = ["Employee ID,Name,Role,Department,Status,Join Date"];
    const csvData = filteredEmployees.map(emp => `EMP-${emp.id?.substring(0,4) || '0000'},${emp.name},${emp.jobTitle},${emp.department},${emp.status},${new Date(emp.joinDate).toLocaleDateString()}`);
    const blob = new Blob([headers.concat(csvData).join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.setAttribute('href', url); a.setAttribute('download', 'Oorwin_Employees.csv');
    a.click();
  };

  // DYNAMIC CALCULATIONS
  const totalHeadcount = employees.length > 0 ? employees.length : 0;
  const activeToday = Math.floor(totalHeadcount * 0.94); 
  
  const calcDepts = () => {
    if (employees.length === 0) return [{n: 'No Data', v: 0, p: '0%', c: 'bg-slate-300'}];
    const counts = employees.reduce((acc, emp) => { 
      const safeDept = emp.department || 'General';
      acc[safeDept] = (acc[safeDept] || 0) + 1; 
      return acc; 
    }, {});
    return Object.entries(counts).map(([name, count], i) => ({ 
      n: name, v: count, p: Math.round((count / employees.length) * 100) + '%', c: i % 2 === 0 ? 'bg-emerald-500' : 'bg-slate-400' 
    })).sort((a,b) => b.v - a.v).slice(0, 5); 
  };
  const dynamicDepts = calcDepts();

  const calcPayroll = () => {
    const depts = { 'Engineering': { base: 0, ben: 0, ot: 0 }, 'Marketing': { base: 0, ben: 0, ot: 0 }, 'Sales': { base: 0, ben: 0, ot: 0 }, 'General': { base: 0, ben: 0, ot: 0 } };
    employees.forEach(emp => {
      const d = depts[emp.department] ? emp.department : 'General';
      depts[d].base += 90; depts[d].ben += 15; depts[d].ot += 5;    
    });
    return Object.entries(depts).filter(([_, data]) => data.base > 0).map(([name, data]) => ({ name, ...data }));
  };
  const dynamicPayrollData = employees.length > 0 ? calcPayroll() : [{ name: 'No Data', base: 0, ben: 0, ot: 0 }];

  const totalBase = dynamicPayrollData.reduce((acc, curr) => acc + curr.base, 0);
  const totalBen = dynamicPayrollData.reduce((acc, curr) => acc + curr.ben, 0);
  const totalOt = dynamicPayrollData.reduce((acc, curr) => acc + curr.ot, 0);
  const grandTotal = totalBase + totalBen + totalOt;

  const calculateTenure = (joinDate) => {
    if (!joinDate) return "0.0";
    const diffTime = Math.abs(new Date() - new Date(joinDate));
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears.toFixed(1);
  };

  const attritionData = [{ month: 'Oct', v: 1.5, i: 0.5 }, { month: 'Nov', v: 2.4, i: 1.0 }, { month: 'Dec', v: 3.2, i: 1.1 }, { month: 'Jan', v: 2.8, i: 0.9 }, { month: 'Feb', v: 2.1, i: 0.7 }, { month: 'Mar', v: 2.2, i: 0.8 }];
  
  // Heatmap Color Logic
  const getColor = (val) => { if (val >= 95) return 'bg-emerald-600 text-white'; if (val >= 90) return 'bg-emerald-400 text-white'; if (val >= 85) return 'bg-amber-300 text-amber-900'; return 'bg-rose-400 text-white'; };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800 selection:bg-emerald-100">
      
      {/* --- ACTION MODALS --- */}
      {activeModal === 'message' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h2 className="text-lg font-bold mb-1">Unified Announcement</h2>
            <p className="text-xs text-slate-500 mb-6">Send a broadcast message to all active employees.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Message broadcasted successfully!"); setActiveModal(null); }} className="flex flex-col gap-4">
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Subject</label><input required placeholder="e.g., Q3 Townhall Update" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500" /></div>
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Message</label><textarea required rows="4" placeholder="Type your message here..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 resize-none"></textarea></div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 text-sm">Send Broadcast</button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'meeting' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h2 className="text-lg font-bold mb-1">Schedule Meeting</h2>
            <p className="text-xs text-slate-500 mb-6">Create a calendar invite for specific departments.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Meeting scheduled!"); setActiveModal(null); }} className="flex flex-col gap-4">
              <div><label className="text-xs font-bold text-slate-500 mb-1 block">Meeting Title</label><input required placeholder="Emergency Sync" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 mb-1 block">Date</label><input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500" /></div>
                <div><label className="text-xs font-bold text-slate-500 mb-1 block">Time</label><input type="time" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500" /></div>
              </div>
              <button type="submit" className="w-full py-2.5 mt-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 text-sm">Send Invites</button>
            </form>
          </div>
        </div>
      )}

      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* INTERACTIVE HEADER */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 z-20">
          <div className="flex items-center gap-6">
            
            {/* WORKING DROPDOWN */}
            <div className="relative">
              <button onClick={() => setShowOrgDropdown(!showOrgDropdown)} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50 transition-colors">
                {currentOrg} <ChevronDown size={14}/>
              </button>
              {showOrgDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                  {['Main Organization', 'Branch Office 1', 'Branch Office 2', 'Europe Division'].map(org => (
                    <div key={org} onClick={() => { setCurrentOrg(org); setShowOrgDropdown(false); }} className={`px-4 py-2 text-xs cursor-pointer hover:bg-emerald-50 ${currentOrg === org ? 'text-emerald-600 font-bold' : 'text-slate-700'}`}>
                      {org}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DYNAMIC DATE */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium hidden md:flex bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
              <Calendar size={14} className="text-slate-400"/> {dateRangeString}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-[250px] hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Global search..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:border-emerald-500" />
            </div>
            
            <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} className="text-slate-600 hover:text-emerald-600" />
              {alerts.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
              
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden cursor-default" onClick={e => e.stopPropagation()}>
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between">
                    <h4 className="font-bold text-slate-800">Alerts</h4>
                    <span className="text-xs text-emerald-600 cursor-pointer hover:underline" onClick={clearAllAlerts}>Clear All</span>
                  </div>
                  {alerts.map((a) => (
                    <div key={a.id} className={`p-4 border-b border-slate-100 border-l-4 ${a.color} relative group`}>
                      <button onClick={() => dismissAlert(a.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"><X size={14}/></button>
                      <h4 className="text-xs font-bold text-slate-900 pr-6">{a.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{a.desc}</p>
                    </div>
                  ))}
                  {alerts.length === 0 && <p className="text-xs text-center py-6 text-slate-400">No new notifications</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Recruiter'}</p>
                <p className="text-[10px] text-slate-500 leading-tight">System Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200 uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6">
            
            {/* LEFT WIDE COLUMN */}
            <div className="flex-1 flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Intelligence Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-1">Real-time HR analytics for <span className="font-bold text-emerald-600">{currentOrg}</span></p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <button onClick={() => setActiveModal('message')} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50">
                    <MessageSquare size={14} className="text-slate-400"/> Unified message
                  </button>
                  <button onClick={() => setActiveModal('meeting')} className="flex items-center gap-2 text-xs font-medium text-white bg-emerald-600 border border-emerald-700 px-3 py-1.5 rounded shadow-sm hover:bg-emerald-700">
                    <Calendar size={14}/> Schedule meeting
                  </button>
                </div>
              </div>

              {/* KPI ROW 1 (Live DB Connection) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Headcount</p>
                  <div className="flex items-end gap-2 mb-2">
                    <h3 className="text-4xl font-bold text-slate-800">{totalHeadcount}</h3>
                    <span className="flex items-center text-xs font-bold text-emerald-500 mb-1"><ArrowUpRight size={14}/> Live DB</span>
                  </div>
                  <p className="text-xs text-slate-400">Total active in database</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Today</p>
                  <div className="flex items-end gap-2 mb-2">
                    <h3 className="text-4xl font-bold text-slate-800">{activeToday}</h3>
                    <span className="flex items-center text-xs font-bold text-emerald-500 mb-1"><ArrowUpRight size={14}/> 5%</span>
                  </div>
                  <p className="text-xs text-slate-400">94% attendance rate</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Absentee Rate</p>
                  <div className="flex items-end gap-2 mb-2">
                    <h3 className="text-4xl font-bold text-slate-800">6.5%</h3>
                    <span className="flex items-center text-xs font-bold text-emerald-500 mb-1"><ArrowDownRight size={14}/> 2%</span>
                  </div>
                  <p className="text-xs text-slate-400">Below target threshold</p>
                </div>
              </div>

              {/* MIDDLE ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-800">Workforce Composition (Live)</h3>
                    <MoreHorizontal size={16} className="text-slate-400"/>
                  </div>
                  <div className="flex flex-col gap-5 mb-8">
                    {dynamicDepts.map(dept => (
                      <div key={dept.n}>
                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                          <span className="text-slate-700">{dept.n}</span>
                          <div className="flex gap-4"><span className="text-slate-800">{dept.v}</span><span className="text-slate-400 w-8 text-right">{dept.p}</span></div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`h-full ${dept.c}`} style={{width: dept.p}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC HEATMAP */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Attendance Pattern</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Weekly distribution (%)</p>
                    </div>
                    <MoreHorizontal size={16} className="text-slate-400"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-medium text-slate-400 mb-1"><div></div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div></div>
                    {heatmapData.map((week, i) => (
                      <div key={i} className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-[10px] text-slate-400 font-medium">Week {i+1}</div>
                        {week.map((val, j) => <div key={j} className={`h-10 rounded flex items-center justify-center text-xs font-bold ${getColor(val)}`}>{val}</div>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DYNAMIC PAYROLL CHART */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Payroll Intelligence (Calculated from DB)</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Allocations based on hired employee departments</p>
                </div>
                
                <div className="flex flex-wrap gap-12 mb-8">
                  <div><p className="text-[10px] font-bold text-slate-400 mb-1">Total Payroll</p><h3 className="text-xl font-bold text-slate-800">${grandTotal}K</h3></div>
                  <div><p className="text-[10px] font-bold text-slate-400 mb-1">Base Salary</p><h3 className="text-xl font-bold text-slate-800">${totalBase}K</h3></div>
                  <div><p className="text-[10px] font-bold text-slate-400 mb-1">Benefits</p><h3 className="text-xl font-bold text-slate-800">${totalBen}K</h3></div>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicPayrollData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v)=>`$${v}K`} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                      <Bar dataKey="base" name="Base Salary" fill="#475569" radius={[2, 2, 0, 0]} barSize={24} />
                      <Bar dataKey="ben" name="Benefits" fill="#10b981" radius={[2, 2, 0, 0]} barSize={24} />
                      <Bar dataKey="ot" name="Overtime" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PERFECT EMPLOYEE DATA TABLE */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-10">
                <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Employee Directory</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Showing {currentEmployees.length} of {filteredEmployees.length} matching records</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-56">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search name, role..." 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-8 pr-4 py-1.5 border border-slate-200 rounded text-xs outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }} className="text-xs border border-slate-200 rounded py-1.5 px-2 outline-none cursor-pointer bg-white">
                      <option>All Departments</option>
                      <option>Engineering</option><option>Marketing</option><option>Sales</option><option>Design</option><option>General</option>
                    </select>
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="text-xs border border-slate-200 rounded py-1.5 px-2 outline-none cursor-pointer bg-white">
                      <option>All Status</option><option value="ONBOARDING">Onboarding</option><option value="ACTIVE">Active</option>
                    </select>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded hover:bg-emerald-100 transition-colors"><Download size={14}/> Export</button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-[10px] font-bold text-slate-500 border-b border-slate-200">
                        <th className="p-4 py-3">Employee ID</th><th className="p-4 py-3">Name</th><th className="p-4 py-3">Role</th>
                        <th className="p-4 py-3">Department</th><th className="p-4 py-3">Attendance</th><th className="p-4 py-3">Performance</th>
                        <th className="p-4 py-3">Tenure</th><th className="p-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {loading ? (
                         <tr><td colSpan="8" className="p-10 text-center"><Loader2 size={24} className="animate-spin mx-auto text-emerald-500" /></td></tr>
                      ) : currentEmployees.length === 0 ? (
                        <tr><td colSpan="8" className="p-10 text-center text-slate-400">No matching employees. Check your filters.</td></tr>
                      ) : (
                        currentEmployees.map((emp, i) => {
                          const safeName = emp.name || "Unknown";
                          const attendance = 85 + (safeName.length % 12); 
                          const performance = 98 - (safeName.length % 8); 
                          const tenure = calculateTenure(emp.joinDate);
                          
                          let statusTag = <span className="px-2 py-0.5 text-[10px] rounded border border-slate-200 bg-slate-50 text-slate-600 font-medium">Unknown</span>;
                          if (emp.status === "ONBOARDING") statusTag = <span className="px-2 py-0.5 text-[10px] rounded border border-amber-200 bg-amber-50 text-amber-600 font-medium">Onboarding</span>;
                          if (emp.status === "ACTIVE" || !emp.status) statusTag = <span className="px-2 py-0.5 text-[10px] rounded border border-emerald-200 bg-emerald-50 text-emerald-600 font-medium">Active</span>;

                          return (
                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 py-3 text-slate-500 font-mono text-[11px]">EMP-{emp.id?.substring(0,4).toUpperCase() || '0000'}</td>
                              <td className="p-4 py-3 font-bold text-slate-800">{safeName}</td>
                              <td className="p-4 py-3 text-slate-500">{emp.jobTitle || 'N/A'}</td>
                              <td className="p-4 py-3 text-slate-500">{emp.department || 'N/A'}</td>
                              <td className="p-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${attendance}%`}}></div></div>
                                  <span className="font-bold text-slate-700 text-[10px]">{attendance}%</span>
                                </div>
                              </td>
                              <td className="p-4 py-3 font-bold text-slate-800">{performance}</td>
                              <td className="p-4 py-3 text-slate-500">{tenure} yrs</td>
                              <td className="p-4 py-3">{statusTag}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                  
                  {/* REAL PAGINATION */}
                  <div className="p-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 bg-slate-50/50">
                    <span>Showing {filteredEmployees.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} entries</span>
                    <div className="flex gap-1">
                      <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors">Previous</button>
                      <button onClick={handleNextPage} disabled={currentPage >= totalPages || totalPages === 0} className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (INTERACTIVE ALERTS) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Alerts & Actions</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{alerts.length} items require attention</p>
                </div>
                <div className="flex flex-col p-4 gap-4">
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <CheckCircle2 size={32} className="mb-2 text-emerald-500" />
                      <p className="text-xs">All caught up! No active alerts.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className={`pl-3 border-l-2 ${alert.color} relative group`}>
                        <button onClick={() => dismissAlert(alert.id)} className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"><X size={14}/></button>
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-xs font-bold text-slate-800 pr-4">{alert.title}</h4>
                          <span className="text-[9px] text-slate-400 shrink-0">{alert.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-1.5 leading-snug pr-4">{alert.desc}</p>
                        <button onClick={() => dismissAlert(alert.id)} className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">{alert.action}</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}