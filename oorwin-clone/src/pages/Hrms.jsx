import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { 
  Search, ChevronDown, Download, UserCheck, Bell, MessageSquare, Calendar, SlidersHorizontal, ArrowUpRight, ArrowDownRight, MoreHorizontal, X, Loader2, Building, CheckCircle2, Menu 
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Hrms() {
  const { user } = useContext(AuthContext);
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [currentOrg, setCurrentOrg] = useState('Main Organization');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'message', 'meeting', or null
  const [heatmapData, setHeatmapData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const dateRangeString = `${currentMonthName} 1 - ${currentMonthName} ${daysInMonth}, ${currentYear}`;

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const [alerts, setAlerts] = useState([
    { id: 1, title: "Pending leave approval", desc: "5 leave requests require your review", time: "2 hours ago", color: "#10b981", action: "Review" }, 
    { id: 2, title: "Probation ending soon", desc: "3 employees complete probation in 7 days", time: "5 hours ago", color: "#ef4444", action: "Schedule Review" },
    { id: 3, title: "Contract expiration", desc: "2 contracts expire within 30 days", time: "1 day ago", color: "#3b82f6", action: "View Details" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => { 
    fetchEmployees(); 
  }, [currentOrg]);

  const fetchEmployees = async () => {
    setLoading(true);
    try { 
      const { data } = await api.get('/employees'); 
      setEmployees(data.data || []); 
      const newHeatmap = Array.from({ length: 4 }, () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 17) + 82));
      setHeatmapData(newHeatmap);
    } catch (error) { console.error("Failed to load employees:", error); } 
    finally { setLoading(false); }
  };

  const filteredEmployees = employees.filter(emp => {
    const safeName = emp.name || "";
    const safeRole = emp.jobTitle || "";
    const safeDept = emp.department || "General";
    
    const matchesSearch = safeName.toLowerCase().includes(searchQuery.toLowerCase()) || safeRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || safeDept === deptFilter;
    const matchesStatus = statusFilter === 'All Status' || (emp.status || 'ACTIVE').toUpperCase() === statusFilter.toUpperCase();
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) return alert("No employees to export.");
    const headers = ["Employee ID,Name,Role,Department,Status,Join Date"];
    const csvData = filteredEmployees.map(emp => `EMP-${emp.id?.substring(0,4) || '0000'},${emp.name},${emp.jobTitle},${emp.department},${emp.status||'ACTIVE'},${new Date(emp.joinDate).toLocaleDateString()}`);
    const blob = new Blob([headers.concat(csvData).join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.setAttribute('href', url); a.setAttribute('download', 'Oorwin_Employees.csv');
    a.click();
  };

  const totalHeadcount = employees.length;
  const activeToday = Math.floor(totalHeadcount * 0.94); 
  
  const calcDepts = () => {
    if (employees.length === 0) return [{n: 'No Data', v: 0, p: '0%', c: '#475569'}];
    const counts = employees.reduce((acc, emp) => { 
      const safeDept = emp.department || 'General';
      acc[safeDept] = (acc[safeDept] || 0) + 1; 
      return acc; 
    }, {});
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
    return Object.entries(counts).map(([name, count], i) => ({ 
      n: name, v: count, p: Math.round((count / employees.length) * 100) + '%', c: colors[i % colors.length]
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
    return (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
  };

  const getColor = (val) => { if (val >= 95) return '#10b981'; if (val >= 90) return '#34d399'; if (val >= 85) return '#fcd34d'; return '#ef4444'; };

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#080e1a', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#f1f5f9', overflow: 'hidden' }}>
      {/* Global CSS handled in index.css */}

      {activeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'linear-gradient(160deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 36, width: '100%', maxWidth: 500, position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', animation: 'fadeUp 0.35s ease' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={16} />
            </button>
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              {activeModal === 'message' ? 'Broadcast' : 'Calendar'}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>
              {activeModal === 'message' ? 'Unified Announcement' : 'Schedule Meeting'}
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              {activeModal === 'message' ? 'Send a broadcast message to all active employees.' : 'Create a calendar invite for specific departments.'}
            </p>
            <form onSubmit={e => { e.preventDefault(); alert('Action completed!'); setActiveModal(null); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeModal === 'message' ? (
                <>
                  <input required placeholder="Subject (e.g., Q3 Townhall Update)" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
                  <textarea required rows="4" placeholder="Type your message here..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#f1f5f9', outline: 'none', resize: 'none' }} />
                  <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', marginTop: 8 }}>Send Broadcast</button>
                </>
              ) : (
                <>
                  <input required placeholder="Meeting Title (e.g., Emergency Sync)" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: 16 }}>
                    <input type="date" required style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
                    <input type="time" required style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#f1f5f9', outline: 'none' }} />
                  </div>
                  <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', marginTop: 8 }}>Send Invites</button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Global Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <header className="app-header">
          <div className="app-header-left">
            <button className="mobile-header-menu" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowOrgDropdown(!showOrgDropdown)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, color: '#cbd5e1', cursor: 'pointer' }}>
                {currentOrg} <ChevronDown size={12} />
              </button>
              {showOrgDropdown && (
                <div style={{ position: 'absolute', top: 44, left: 0, width: 220, background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', zIndex: 200, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
                  {['Main Organization', 'Branch Office 1', 'Branch Office 2', 'Europe Division'].map(org => (
                    <div key={org} onClick={() => { setCurrentOrg(org); setShowOrgDropdown(false); }} style={{ padding: '12px 16px', fontSize: 12, cursor: 'pointer', color: currentOrg === org ? '#10b981' : '#94a3b8', fontWeight: currentOrg === org ? 700 : 500, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {org}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px', fontSize: 11, color: '#64748b', fontWeight: 500 }}>
              <Calendar size={12} color="#64748b" /> {dateRangeString}
            </div>
          </div>

          <div className="app-header-right">
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="text" placeholder="Search employees..." style={{ width: 240, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 14px 8px 36px', fontSize: 12, color: '#f1f5f9', outline: 'none' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', position: 'relative' }}>
                <Bell size={15} />
                {alerts.length > 0 && <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #080e1a' }} />}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', right: 0, top: 46, width: 320, background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Alerts</span>
                    <span onClick={() => setAlerts([])} style={{ fontSize: 11, color: '#10b981', cursor: 'pointer', fontWeight: 600 }}>Clear All</span>
                  </div>
                  {alerts.map(a => (
                    <div key={a.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${a.color}`, display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{a.desc}</div>
                      </div>
                      <button onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={12} /></button>
                    </div>
                  ))}
                  {alerts.length === 0 && <div style={{ padding: '30px 0', textAlign: 'center', fontSize: 12, color: '#475569' }}>No pending alerts.</div>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{user?.name || 'Recruiter'}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>System Admin</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #064e3b, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#10b981', border: '1.5px solid rgba(16,185,129,0.3)', fontFamily: "'Syne', sans-serif" }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="scroll-container" style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1600, margin: '0 auto' }}>
            
            <div className="page-title-row">
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9', letterSpacing: '-0.03em' }}>Intelligence Dashboard</h1>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>Real-time HR analytics for <span style={{ color: '#10b981', fontWeight: 700 }}>{currentOrg}</span></p>
              </div>
              <div className="action-buttons">
                <button onClick={() => setActiveModal('message')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600, color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <MessageSquare size={14} color="#64748b" /> Unified message
                </button>
                <button onClick={() => setActiveModal('meeting')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}>
                  <Calendar size={14} /> Schedule meeting
                </button>
              </div>
            </div>

            <div className="hrms-top-grid" style={{ animation: 'fadeUp 0.4s ease' }}>
              {[
                { label: 'Total Headcount', value: totalHeadcount, sub: 'Total active in database', isLive: true },
                { label: 'Active Today', value: activeToday, sub: '94% attendance rate', up: true, diff: '5%' },
                { label: 'Absentee Rate', value: '4.2%', sub: 'Below target threshold', up: false, diff: '2%' }
              ].map((kpi, i) => (
                <div key={i} className="card-hover" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, transition: 'all 0.4s' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{kpi.label}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 8 }}>
                    <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1 }}>{kpi.value}</div>
                    {kpi.isLive ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 4 }}><ArrowUpRight size={13} /> Live DB</span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>{kpi.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {kpi.diff}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="chart-grid" style={{ animation: 'fadeUp 0.45s ease' }}>
              <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}>Workforce Composition (Live)</h3>
                  <MoreHorizontal size={18} color="#475569" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {dynamicDepts.map(dept => (
                    <div key={dept.n}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>
                        <span>{dept.n}</span>
                        <div style={{ display: 'flex', gap: 16 }}><span>{dept.v}</span><span style={{ color: '#64748b', width: 30, textAlign: 'right' }}>{dept.p}</span></div>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', height: 6, borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: dept.c, width: dept.p, borderRadius: 6, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}>Attendance Pattern</h3>
                    <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Weekly distribution (%)</p>
                  </div>
                  <MoreHorizontal size={18} color="#475569" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(40px,1fr) repeat(5, 1fr)', gap: 10, textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748b', paddingBottom: 6 }}>
                    <div /><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
                  </div>
                  {heatmapData.map((week, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(40px,1fr) repeat(5, 1fr)', gap: 10, alignItems: 'center' }}>
                      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Wk {i+1}</div>
                      {week.map((val, j) => (
                        <div key={j} style={{ height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: getColor(val) + '20', color: getColor(val), border: `1px solid ${getColor(val)}30` }}>
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, animation: 'fadeUp 0.5s ease' }}>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}>Payroll Intelligence</h3>
                <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Allocations based on hired employee departments</p>
              </div>
              <div style={{ display: 'flex', gap: 48, marginBottom: 36 }}>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Total Payroll</div><div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9' }}>${grandTotal}K</div></div>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Base Salary</div><div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9' }}>${totalBase}K</div></div>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Benefits</div><div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9' }}>${totalBen}K</div></div>
              </div>
              <div style={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicPayrollData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={v => `$${v}K`} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="base" name="Base Salary" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                    <Bar dataKey="ben" name="Benefits" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                    <Bar dataKey="ot" name="Overtime" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1a2234, #0f172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', animation: 'fadeUp 0.55s ease' }}>
              <div className="card-header" style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}>Employee Directory</h3>
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Showing {currentEmployees.length} of {filteredEmployees.length} matching records</p>
                </div>
                <div className="filter-group" style={{ display: 'flex', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input type="text" placeholder="Search name, role..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ width: 220, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 12px 8px 34px', fontSize: 12, color: '#f1f5f9', outline: 'none' }} />
                  </div>
                  <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#cbd5e1', outline: 'none', cursor: 'pointer' }}>
                    <option>All Departments</option><option>Engineering</option><option>Marketing</option><option>Sales</option><option>Design</option><option>General</option>
                  </select>
                  <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#cbd5e1', outline: 'none', cursor: 'pointer' }}>
                    <option>All Status</option><option value="ONBOARDING">Onboarding</option><option value="ACTIVE">Active</option>
                  </select>
                  <button onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#10b981'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}><Download size={14} /> Export</button>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {['Employee ID', 'Name', 'Role', 'Department', 'Attendance', 'Performance', 'Tenure', 'Status'].map(h => (
                        <th key={h} style={{ padding: '14px 24px', fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="8" style={{ padding: '60px 0', textAlign: 'center' }}><Loader2 size={24} color="#10b981" /></td></tr>
                    ) : currentEmployees.length === 0 ? (
                      <tr><td colSpan="8" style={{ padding: '60px 0', textAlign: 'center', fontSize: 13, color: '#475569' }}>No matching employees.</td></tr>
                    ) : (
                      currentEmployees.map(emp => {
                        const att = 85 + ((emp.name?.length || 5) % 12); 
                        const perf = 98 - ((emp.name?.length || 5) % 8); 
                        const s = (emp.status || 'ACTIVE').toUpperCase();
                        const tagCfg = s === 'ONBOARDING' ? { bg: '#f59e0b20', col: '#f59e0b', label: 'Onboarding' } : { bg: '#10b98120', col: '#10b981', label: 'Active' };
                        return (
                          <tr key={emp.id} className="row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '16px 24px', fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>EMP-{emp.id?.substring(0,4).toUpperCase() || '0000'}</td>
                            <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{emp.name || 'Unknown'}</td>
                            <td style={{ padding: '16px 24px', fontSize: 12, color: '#cbd5e1' }}>{emp.jobTitle || 'N/A'}</td>
                            <td style={{ padding: '16px 24px', fontSize: 12, color: '#cbd5e1' }}>{emp.department || 'N/A'}</td>
                            <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                                  <div style={{ width: `${att}%`, height: '100%', background: '#10b981', borderRadius: 2 }} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>{att}%</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{perf}</td>
                            <td style={{ padding: '16px 24px', fontSize: 12, color: '#cbd5e1' }}>{calculateTenure(emp.joinDate)} yrs</td>
                            <td style={{ padding: '16px 24px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: tagCfg.bg, color: tagCfg.col, border: `1px solid ${tagCfg.col}40` }}>{tagCfg.label}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b' }}>
                <span>Showing {filteredEmployees.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} entries</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: currentPage === 1 ? '#475569' : '#cbd5e1', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                  <button disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: currentPage >= totalPages || totalPages === 0 ? '#475569' : '#cbd5e1', cursor: currentPage >= totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}>Next</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}