import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import {
  UploadCloud, Search, Target, PlusCircle, Sparkles, X,
  RefreshCw, Bell, ChevronDown, Calendar, Zap, BarChart2,
  Users, LogOut, Briefcase, Building2, UserCheck, CheckCircle2,
  ArrowUpRight, Activity, FileText, Star, TrendingUp, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PIPELINE_TREND = [
  { week: "W1", apps: 8,  interviews: 3 },
  { week: "W2", apps: 14, interviews: 5 },
  { week: "W3", apps: 11, interviews: 4 },
  { week: "W4", apps: 19, interviews: 8 },
  { week: "W5", apps: 22, interviews: 9 },
  { week: "W6", apps: 17, interviews: 7 },
];

const AVATAR_COLORS = ["#10b981","#3b82f6","#ec4899","#f59e0b","#8b5cf6","#06b6d4"];

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(null);
  useEffect(() => {
    start.current = null;
    const tick = (ts) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / 900, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}</>;
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px" }}>
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 5 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 700 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [page, setPage]                     = useState("dashboard");
  const [candidates, setCandidates]         = useState([]);
  const [jobs, setJobs]                     = useState(() => {
    const saved = localStorage.getItem('oorwin_jobs');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Senior React Developer", dept: "Engineering", type: "Full-time" },
      { id: 2, title: "Product Designer",        dept: "Design",       type: "Full-time" },
    ];
  });
  const [showModal, setShowModal]           = useState(false);
  const [isMatchMode, setIsMatchMode]       = useState(false);
  const [file, setFile]                     = useState(null);
  const [uploading, setUploading]           = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [statusFilter, setStatusFilter]     = useState("ALL");
  const [formData, setFormData]             = useState({ title: "", dept: "" });
  const [currentOrg, setCurrentOrg]         = useState("Main Organization");
  const [showOrgDrop, setShowOrgDrop]       = useState(false);
  const [showBell, setShowBell]             = useState(false);
  const [toast, setToast]                   = useState(null);
  const fileRef = useRef(null);
  const [alerts, setAlerts] = useState([
    { id: 1, title: "New application received", desc: "Arjun Mehta applied for Senior React Dev", time: "10m ago", color: "#10b981" },
    { id: 2, title: "Interview reminder",       desc: "Interview with Sophia Lane at 2:00 PM",  time: "1h ago",  color: "#3b82f6" },
  ]);

  const now = new Date();
  const monthStr = now.toLocaleString("default", { month: "short" });
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dateStr = `${monthStr} 1 – ${monthStr} ${days}, ${now.getFullYear()}`;

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => { 
    localStorage.setItem('oorwin_jobs', JSON.stringify(jobs)); 
  }, [jobs]);

  useEffect(() => { fetchCandidates(); }, [currentOrg]);

  const fetchCandidates = async () => {
    setIsMatchMode(false); 
    try { 
      const { data } = await api.get('/candidates'); 
      setCandidates(data.data || []); 
    } catch (error) { console.error(error); }
  };

  const filtered = candidates.filter(c => {
    const q  = searchQuery.toLowerCase();
    const ms = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    const mf = statusFilter === "ALL" || c.status === statusFilter;
    return ms && mf;
  });

  const toggleAI = async () => {
    if (isMatchMode) { fetchCandidates(); return; }
    try {
      const { data } = await api.get('/candidates/match');
      setCandidates(data.data.map(item => ({ ...item.candidate, matchScore: item.matchScore })));
      setIsMatchMode(true);
      notify("AI ranking applied!");
    } catch (error) { console.error(error); }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/candidates/${id}/status`, { status });
      if (status === 'HIRED') {
        notify("🎉 Candidate hired & auto-onboarded to HRMS!");
        await api.post('/employees/onboard', { candidateId: id, department: "Engineering" });
      }
      fetchCandidates(); 
    } catch (error) { alert("Failed status change."); }
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dept) return;
    setJobs(prev => [{ id: Date.now(), ...formData, type: "Full-time" }, ...prev]);
    setFormData({ title: "", dept: "" });
    setShowModal(false);
    notify("Job posted successfully!");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const uploadData = new FormData(); uploadData.append('resume', file);
    setUploading(true);
    try {
      await api.post('/candidates/upload-resume', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null); if (fileRef.current) fileRef.current.value = ''; 
      fetchCandidates(); notify("Resume parsed & candidate added!");
    } catch (error) { alert("Upload Failed"); } finally { setUploading(false); }
  };

  const kpis = [
    { label: "Total Applications", value: candidates.length,                                          icon: FileText,  color: "#10b981" },
    { label: "Active Pipeline",    value: candidates.filter(c => c.status === "ACTIVE").length,       icon: Activity,  color: "#3b82f6" },
    { label: "In Interview",       value: candidates.filter(c => c.status === "INTERVIEW").length,    icon: Users,     color: "#f59e0b" },
    { label: "Hired",              value: candidates.filter(c => c.status === "HIRED").length,        icon: Star,      color: "#8b5cf6" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#080e1a", fontFamily: "'DM Sans', sans-serif", color: "#f1f5f9", overflowX: "hidden" }}>
      {/* Global CSS handled in index.css */}

      {toast && (
        <div style={{ position:"fixed", top:22, right:22, zIndex:9999, background:"linear-gradient(135deg,#064e3b,#065f46)", border:"1px solid rgba(16,185,129,.3)", borderRadius:14, padding:"13px 20px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 20px 60px rgba(0,0,0,.5)", animation:"slideIn .35s ease" }}>
          <CheckCircle2 size={15} color="#10b981" />
          <span style={{ fontSize:13, fontWeight:600 }}>{toast}</span>
        </div>
      )}

      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(2,6,23,.88)", backdropFilter:"blur(12px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"linear-gradient(155deg,#1a2234,#0f172a)", border:"1px solid rgba(255,255,255,.1)", borderRadius:24, padding:36, width:"100%", maxWidth:430, position:"relative", boxShadow:"0 40px 80px rgba(0,0,0,.6)", animation:"fadeUp .35s cubic-bezier(.34,1.4,.64,1)" }}>
            <button onClick={() => setShowModal(false)} style={{ position:"absolute", top:18, right:18, background:"rgba(255,255,255,.06)", border:"none", borderRadius:9, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#94a3b8" }}><X size={14}/></button>
            <div style={{ fontSize:10, color:"#10b981", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 }}>New Opening</div>
            <h2 style={{ fontSize:22, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9", marginBottom:22 }}>Post a Job</h2>
            <form onSubmit={handleCreateJob} style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[{key:"title",label:"Job Title",icon:Briefcase},{key:"dept",label:"Department",icon:Building2}].map(({key,label,icon:Icon})=>(
                <div key={key} style={{ position:"relative" }}>
                  <Icon size={13} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#475569", pointerEvents:"none" }}/>
                  <input required placeholder={label} value={formData[key]} onChange={e=>setFormData({...formData,[key]:e.target.value})}
                    style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:11, padding:"11px 12px 11px 36px", fontSize:13, color:"#f1f5f9", outline:"none", transition:"border-color .2s" }}
                    onFocus={e=>e.target.style.borderColor="#10b981"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
                </div>
              ))}
              <button type="submit" style={{ marginTop:6, padding:"13px", background:"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:13, fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer", boxShadow:"0 8px 24px rgba(16,185,129,.3)", transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"}}>
                Publish Job
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Sidebar Integration */}
      <Sidebar />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        
        <header style={{ height:58, borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 26px", background:"rgba(8,14,26,.96)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <button onClick={()=>setShowOrgDrop(v=>!v)} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, color:"#94a3b8", cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(16,185,129,.35)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}>
                <Building2 size={11} color="#475569"/> {currentOrg} <ChevronDown size={11}/>
              </button>
              {showOrgDrop && (
                <div style={{ position:"absolute", top:40, left:0, width:196, background:"#0f172a", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, overflow:"hidden", zIndex:200, boxShadow:"0 20px 50px rgba(0,0,0,.5)", animation:"fadeUp .2s ease" }}>
                  {["Main Organization","Branch Office 1","Branch Office 2","Europe Division"].map(o=>(
                    <div key={o} onClick={()=>{setCurrentOrg(o);setShowOrgDrop(false)}}
                      style={{ padding:"9px 14px", fontSize:12, cursor:"pointer", color:currentOrg===o?"#10b981":"#94a3b8", fontWeight:currentOrg===o?700:500, borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      {o}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:8, padding:"6px 12px", fontSize:11, color:"#475569", fontWeight:500 }}>
              <Calendar size={11} color="#475569"/> {dateStr}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative" }}>
              <Search size={12} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#475569" }}/>
              <input placeholder="Global search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                style={{ width:210, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:9, padding:"7px 12px 7px 32px", fontSize:12, color:"#f1f5f9", outline:"none" }}/>
            </div>

            <div style={{ position:"relative" }}>
              <button onClick={()=>setShowBell(v=>!v)} style={{ width:34, height:34, borderRadius:9, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#64748b" }}>
                <Bell size={14}/>
                {alerts.length>0 && <span className="pulse" style={{ position:"absolute", top:7, right:7, width:6, height:6, borderRadius:"50%", background:"#ef4444", border:"1.5px solid #080e1a" }}/>}
              </button>
              {showBell && (
                <div style={{ position:"absolute", right:0, top:44, width:292, background:"#0f172a", border:"1px solid rgba(255,255,255,.08)", borderRadius:15, boxShadow:"0 24px 60px rgba(0,0,0,.5)", zIndex:200, overflow:"hidden", animation:"fadeUp .2s ease" }}>
                  <div style={{ padding:"13px 16px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>Alerts</span>
                    <span onClick={()=>setAlerts([])} style={{ fontSize:11, color:"#10b981", cursor:"pointer", fontWeight:600 }}>Clear All</span>
                  </div>
                  {alerts.length===0
                    ? <p style={{ textAlign:"center", padding:"18px 0", fontSize:12, color:"#475569" }}>All clear!</p>
                    : alerts.map(a=>(
                      <div key={a.id} style={{ padding:"11px 16px", borderBottom:"1px solid rgba(255,255,255,.04)", borderLeft:`3px solid ${a.color}`, display:"flex", gap:10 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:"#cbd5e1" }}>{a.title}</div>
                          <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{a.desc}</div>
                        </div>
                        <button onClick={()=>setAlerts(p=>p.filter(x=>x.id!==a.id))} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer" }}><X size={11}/></button>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:9, paddingLeft:12, borderLeft:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>{user?.name || "Recruiter"}</div>
                <div style={{ fontSize:10, color:"#475569" }}>System Admin</div>
              </div>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#064e3b,#065f46)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#10b981", border:"1.5px solid rgba(16,185,129,.3)", fontFamily:"'Syne',sans-serif" }}>
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        <div style={{ flex:1, padding:26, overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, animation:"fadeUp .4s ease" }}>
            <div>
              <h1 style={{ fontSize:25, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9", letterSpacing:"-.03em" }}>Active Recruitment</h1>
              <p style={{ fontSize:13, color:"#475569", marginTop:4 }}>Manage talent pipeline for <span style={{ color:"#10b981", fontWeight:700 }}>{currentOrg}</span></p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowModal(true)} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"9px 17px", fontSize:13, fontWeight:700, color:"#cbd5e1", cursor:"pointer" }}>
                <PlusCircle size={14}/> Post Job
              </button>
              <button onClick={toggleAI} style={{ display:"flex", alignItems:"center", gap:7, background:isMatchMode?"rgba(239,68,68,.1)":"linear-gradient(135deg,#10b981,#059669)", border:isMatchMode?"1px solid rgba(239,68,68,.3)":"none", borderRadius:10, padding:"9px 17px", fontSize:13, fontWeight:700, color:isMatchMode?"#ef4444":"#fff", cursor:"pointer" }}>
                {isMatchMode ? <><RefreshCw size={13}/> Clear AI</> : <><Target size={13}/> AI Rank</>}
              </button>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
            {kpis.map((k, i) => <KpiCard key={k.label} kpi={k} delay={i * 80}/>)}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 330px", gap:18 }}>
            
            <div style={{ background:"linear-gradient(135deg,#1a2234,#0f172a)", border:"1px solid rgba(255,255,255,.06)", borderRadius:20, overflow:"hidden", animation:"fadeUp .5s ease" }}>
              <div style={{ padding:"17px 20px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><span style={{ fontSize:14, fontWeight:700, color:"#f1f5f9" }}>Open Applications</span><span style={{ fontSize:11, color:"#475569", marginLeft:10 }}>({filtered.length})</span></div>
                <div style={{ display:"flex", gap:6 }}>
                  {["ALL","ACTIVE","INTERVIEW","HIRED"].map(s=>(
                    <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:"4px 11px", borderRadius:7, fontSize:10, fontWeight:700, background:statusFilter===s?"rgba(16,185,129,.12)":"transparent", border:statusFilter===s?"1px solid rgba(16,185,129,.3)":"1px solid rgba(255,255,255,.06)", color:statusFilter===s?"#10b981":"#475569", cursor:"pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ minHeight:300 }}>
                {filtered.length === 0
                  ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:260, color:"#475569", gap:10 }}><Users size={38} style={{ opacity:.25 }}/><span style={{ fontSize:13, fontWeight:600 }}>No candidates found</span></div>
                  : filtered.map((c, i) => {
                    const col = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    return (
                      <div key={c.id} className="row-hover" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,.03)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                          <div style={{ width:40, height:40, borderRadius:12, background:`${col}20`, border:`1.5px solid ${col}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:col, fontFamily:"'Syne',sans-serif", flexShrink:0, textTransform:"uppercase" }}>
                            {c.name?.charAt(0)||"U"}
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:"#f1f5f9" }}>{c.name}</div>
                            <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{c.currentJobTitle || "Unspecified"} · {c.email}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          {c.matchScore && <span style={{ padding:"3px 10px", background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.25)", borderRadius:20, fontSize:10, fontWeight:800, color:"#10b981" }}>{c.matchScore}% Match</span>}
                          <select value={c.status} onChange={e=>changeStatus(c.id,e.target.value)} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700, color:"#94a3b8", cursor:"pointer" }}>
                            <option value="ACTIVE">ACTIVE</option><option value="INTERVIEW">INTERVIEW</option><option value="HIRED">HIRED</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"linear-gradient(135deg,#1a2234,#0f172a)", border:"1px solid rgba(255,255,255,.06)", borderRadius:20, padding:"20px 20px 14px", animation:"fadeUp .55s ease" }}>
                <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:".08em", marginBottom:3 }}>6-Week Trend</div>
                <div style={{ fontSize:15, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9", marginBottom:14 }}>Pipeline Activity</div>
                <div style={{ height:130 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PIPELINE_TREND}>
                      <defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={.25}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient><linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.03)"/>
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill:"#475569", fontSize:10 }}/>
                      <Tooltip content={<ChartTooltip/>}/>
                      <Area type="monotone" dataKey="apps" name="Applications" stroke="#10b981" strokeWidth={2} fill="url(#gA)" dot={false}/>
                      <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#3b82f6" strokeWidth={2} fill="url(#gI)" dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background:"linear-gradient(135deg,#1a2234,#0f172a)", border:"1px solid rgba(255,255,255,.06)", borderRadius:20, padding:"20px", position:"relative", overflow:"hidden", animation:"fadeUp .6s ease" }}>
                <div style={{ position:"absolute", top:-18, right:-18, width:70, height:70, borderRadius:"50%", background:"rgba(16,185,129,.07)", filter:"blur(18px)" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}><Sparkles size={14} color="#10b981"/><span style={{ fontSize:14, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9" }}>AI Resume Parser</span></div>
                <p style={{ fontSize:11, color:"#475569", marginBottom:16 }}>Upload a PDF to instantly extract data.</p>
                <form onSubmit={handleUpload} style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <label style={{ border:`2px dashed ${file?"#10b981":"rgba(255,255,255,.1)"}`, borderRadius:13, padding:"24px 16px", display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", background:file?"rgba(16,185,129,.06)":"rgba(255,255,255,.02)", transition:"all .2s", gap:7 }}>
                    <UploadCloud size={26} color={file?"#10b981":"#475569"}/>
                    <span style={{ fontSize:12, fontWeight:600, color:file?"#10b981":"#64748b", textAlign:"center" }}>{file?file.name:"Click to browse PDF"}</span>
                    <input ref={fileRef} type="file" style={{ display:"none" }} accept=".pdf" onChange={e=>setFile(e.target.files[0])}/>
                  </label>
                  <button type="submit" disabled={uploading||!file} style={{ padding:"11px", background:!file?"rgba(255,255,255,.04)":"linear-gradient(135deg,#1e293b,#162032)", border:`1px solid ${file?"rgba(255,255,255,.14)":"rgba(255,255,255,.05)"}`, borderRadius:11, fontSize:13, fontWeight:700, color:!file?"#2d3d50":"#cbd5e1", cursor:file?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
                    {uploading ? <><div style={{ width:13, height:13, borderRadius:"50%", border:"2px solid rgba(255,255,255,.2)", borderTopColor:"#fff" }} className="spin"/>Extracting...</> : "Process Resume"}
                  </button>
                </form>
              </div>

              <div style={{ background:"linear-gradient(135deg,#1a2234,#0f172a)", border:"1px solid rgba(255,255,255,.06)", borderRadius:20, padding:"20px", animation:"fadeUp .65s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9" }}>Active Jobs</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{jobs.length} open positions</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {jobs.map((job, i) => {
                    const col = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    return (
                      <div key={job.id} className="job-hover" style={{ padding:"12px 14px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, flexShrink:0, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"default" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:30, height:30, borderRadius:8, background:`${col}18`, border:`1px solid ${col}25`, display:"flex", alignItems:"center", justifyContent:"center" }}><Briefcase size={13} color={col}/></div>
                          <div><div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>{job.title}</div><div style={{ fontSize:10, color:"#475569", marginTop:2 }}>{job.dept} · {job.type}</div></div>
                        </div>
                        <span style={{ fontSize:10, fontWeight:700, color:col, background:`${col}12`, padding:"3px 8px", borderRadius:6 }}>Open</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ kpi, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className="card-hover" style={{ background:"linear-gradient(135deg,#1e293b,#0f172a)", border:"1px solid rgba(255,255,255,.07)", borderRadius:18, padding:"20px 22px", transition:"all .5s cubic-bezier(.34,1.56,.64,1)", transform:visible?"translateY(0) scale(1)":"translateY(18px) scale(.97)", opacity:visible?1:0, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-15, right:-15, width:55, height:55, borderRadius:"50%", background:`${kpi.color}10`, filter:"blur(14px)" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`${kpi.color}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${kpi.color}25` }}><kpi.icon size={17} color={kpi.color}/></div>
        <span style={{ fontSize:11, fontWeight:700, color:"#10b981", display:"flex", alignItems:"center", gap:2 }}><ArrowUpRight size={11}/> Live</span>
      </div>
      <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9", letterSpacing:"-.02em" }}>{visible ? <AnimatedNumber value={kpi.value}/> : 0}</div>
      <div style={{ fontSize:11, color:"#64748b", marginTop:4, fontWeight:500 }}>{kpi.label}</div>
    </div>
  );
}