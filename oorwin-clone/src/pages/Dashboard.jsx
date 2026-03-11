import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { UploadCloud, Loader2, Search, Target, PlusCircle, Sparkles, X, RefreshCw, Bell, ChevronDown, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null); 
  
  const [showModal, setShowModal] = useState(false);
  const [isMatchMode, setIsMatchMode] = useState(false); 
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('oorwin_jobs');
    return saved ? JSON.parse(saved) : [{ id: 1, title: 'Senior React Developer', dept: 'Engineering', type: 'Full-time' }];
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({});

  // --- INTERACTIVE TOP NAV STATES ---
  const [currentOrg, setCurrentOrg] = useState('Main Organization');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, title: "New application received", desc: "John Doe applied for Senior React Developer", time: "10 mins ago", color: "border-emerald-500" },
    { id: 2, title: "Interview reminder", desc: "Interview with Sarah Jenkins at 2:00 PM", time: "1 hour ago", color: "border-blue-500" }
  ]);

  // Dynamic Date
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const dateRangeString = `${currentMonthName} 1 - ${currentMonthName} ${daysInMonth}, ${currentYear}`;

  const dismissAlert = (id) => setAlerts(alerts.filter(alert => alert.id !== id));
  const clearAllAlerts = () => setAlerts([]);

  useEffect(() => { fetchCandidates(); }, [currentOrg]);
  useEffect(() => { localStorage.setItem('oorwin_jobs', JSON.stringify(jobs)); }, [jobs]);

  const fetchCandidates = async () => {
    setLoading(true); setIsMatchMode(false); 
    try { const { data } = await api.get('/candidates'); setCandidates(data.data || []); } 
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const filteredCandidates = candidates.filter(cand => cand.name?.toLowerCase().includes(searchQuery.toLowerCase()) || cand.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleAiMatches = async () => {
    if (isMatchMode) return fetchCandidates(); 
    setLoading(true);
    try {
      const { data } = await api.get(`/candidates/match`);
      setCandidates(data.data.map(item => ({ ...item.candidate, matchScore: item.matchScore })));
      setIsMatchMode(true);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault(); if (!file) return;
    const uploadData = new FormData(); uploadData.append('resume', file);
    setUploading(true);
    try {
      await api.post('/candidates/upload-resume', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; fetchCandidates(); 
    } catch (error) { alert("Upload Failed"); } finally { setUploading(false); }
  };

  const changeCandidateStatus = async (id, newStatus) => {
    try {
      await api.put(`/candidates/${id}/status`, { status: newStatus });
      if (newStatus === 'HIRED') {
        alert("🎉 Candidate Hired! Automatically onboarded into HRMS.");
        await api.post('/employees/onboard', { candidateId: id, department: "Engineering" });
      }
      fetchCandidates(); 
    } catch (error) { alert("Failed status change."); }
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    setJobs([{ id: Date.now(), title: formData.title, dept: formData.dept, type: 'Full-time' }, ...jobs]);
    setShowModal(false); setFormData({});
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800 selection:bg-emerald-100">
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6">Create New Job</h2>
            <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
              <input required placeholder="Job Title" onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500" />
              <input required placeholder="Department" onChange={(e) => setFormData({...formData, dept: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500" />
              <button type="submit" className="w-full py-3 mt-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700">Publish Job</button>
            </form>
          </div>
        </div>
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* EXACT UNIFIED HEADER */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowOrgDropdown(!showOrgDropdown)} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50 transition-colors">
                {currentOrg} <ChevronDown size={14}/>
              </button>
              {showOrgDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                  {['Main Organization', 'Branch Office 1', 'Branch Office 2', 'Europe Division'].map(org => (
                    <div key={org} onClick={() => { setCurrentOrg(org); setShowOrgDropdown(false); }} className={`px-4 py-2 text-xs cursor-pointer hover:bg-emerald-50 ${currentOrg === org ? 'text-emerald-600 font-bold' : 'text-slate-700'}`}>{org}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium hidden md:flex bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
              <Calendar size={14} className="text-slate-400"/> {dateRangeString}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-[250px] hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Global search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs outline-none focus:border-emerald-500" />
            </div>
            
            <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} className="text-slate-600 hover:text-emerald-600" />
              {alerts.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden cursor-default" onClick={e => e.stopPropagation()}>
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between"><h4 className="font-bold text-slate-800">Alerts</h4><span className="text-xs text-emerald-600 cursor-pointer hover:underline" onClick={clearAllAlerts}>Clear All</span></div>
                  {alerts.map((a) => (
                    <div key={a.id} className={`p-4 border-b border-slate-100 border-l-4 ${a.color} relative group`}>
                      <button onClick={() => dismissAlert(a.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500"><X size={14}/></button>
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
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200 uppercase">{user?.name?.charAt(0) || 'U'}</div>
            </div>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Active Recruitment</h2>
                <p className="text-xs text-slate-500 mt-1">Manage talent pipeline for <span className="font-bold text-emerald-600">{currentOrg}</span></p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50"><PlusCircle size={16} /> Post Job</button>
                <button onClick={toggleAiMatches} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all ${isMatchMode ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                  {isMatchMode ? <><RefreshCw size={16} /> Clear AI</> : <><Target size={16} /> AI Rank</>}
                </button>
              </div>
            </div>

            {/* Rest of the ATS UI remains identical */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Open Applications ({filteredCandidates.length})</h3>
                {loading ? <Loader2 size={32} className="animate-spin text-emerald-500 mx-auto mt-10" /> : (
                  <div className="flex flex-col gap-2">
                    {filteredCandidates.map((cand) => (
                      <div key={cand.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 uppercase">{cand.name?.charAt(0) || 'U'}</div>
                          <div><p className="text-slate-900 font-bold text-sm">{cand.name}</p><p className="text-xs text-slate-500">{cand.currentJobTitle || 'Unspecified'} • {cand.email}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                          {cand.matchScore && <span className="px-3 py-1 text-[10px] rounded-full font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">{cand.matchScore}% Match</span>}
                          <select value={cand.status} onChange={(e) => changeCandidateStatus(cand.id, e.target.value)} className="text-xs rounded-full font-bold px-3 py-1.5 outline-none cursor-pointer border bg-slate-50 border-slate-200 focus:border-emerald-500">
                            <option value="ACTIVE">ACTIVE</option><option value="INTERVIEW">INTERVIEW</option><option value="HIRED">HIRED</option>
                          </select>
                        </div>
                      </div>
                    ))}
                    {filteredCandidates.length === 0 && <p className="text-center text-slate-400 py-10 text-sm">No candidates found.</p>}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-2"><Sparkles className="inline mr-2 text-emerald-500" size={16}/> AI Resume Parser</h3>
                  <p className="text-xs text-slate-500 mb-6">Upload a PDF to instantly extract data.</p>
                  <form onSubmit={handleUpload} className="flex flex-col gap-4">
                    <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer transition-colors ${file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-400'}`}>
                      <UploadCloud size={32} className={`${file ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                      <span className="text-xs text-slate-700 font-bold text-center">{file ? file.name : 'Click to browse PDF'}</span>
                      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                    <button type="submit" disabled={uploading || !file} className="w-full py-3 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 shadow-md">
                      {uploading ? "Extracting..." : "Process Resume"}
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Active Jobs ({jobs.length})</h3>
                  <div className="flex flex-col gap-3">
                    {jobs.map(job => (
                      <div key={job.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                        <p className="font-bold text-sm text-slate-800">{job.title}</p>
                        <p className="text-xs text-slate-500">{job.dept} • {job.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}