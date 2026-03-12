import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, Building2, UserCheck, LogOut, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { section: 'WORKSPACE', items: [
      { id: 'dashboard', path: '/dashboard', label: 'ATS Pipeline', icon: LayoutDashboard }
    ]},
    { section: 'ENTERPRISE', items: [
      { id: 'crm', path: '/crm', label: 'CRM (Clients)', icon: Building2 },
      { id: 'hrms', path: '/hrms', label: 'HRMS (Employees)', icon: UserCheck }
    ]}
  ];

  return (
    <div style={{
      width: 260,
      background: 'rgba(8,14,26,0.96)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      flexShrink: 0,
      minHeight: '100vh',
      backdropFilter: 'blur(20px)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.04);
          transform: translateX(4px);
        }
        .sidebar-logout:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171 !important;
        }
        .sidebar-logout:hover svg {
          color: #f87171 !important;
        }
      `}</style>

      {/* Brand */}
      <div 
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 40,
          cursor: 'pointer',
          padding: '0 8px'
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
        }}>
          <div style={{ width: 14, height: 14, background: '#fff', borderRadius: 3 }} />
        </div>
        <span style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#f1f5f9',
          letterSpacing: '-0.02em',
          fontFamily: "'Syne', sans-serif"
        }}>ZEN AI</span>
      </div>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
        {navItems.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 10,
              paddingLeft: 8
            }}>
              {group.section}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {group.items.map((item) => {
                const isActive = path === item.path;
                return (
                  <div
                    key={item.id}
                    className={!isActive ? "sidebar-nav-item" : ""}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: isActive ? 'linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)' : 'transparent',
                      border: isActive ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isActive && (
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#10b981', borderTopRightRadius: 3, borderBottomRightRadius: 3 }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <item.icon size={18} color={isActive ? '#10b981' : '#64748b'} style={{ transition: 'color 0.2s' }} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#f1f5f9' : '#94a3b8',
                        transition: 'color 0.2s'
                      }}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && <ChevronRight size={14} color="#10b981" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <button 
        onClick={logout}
        className="sidebar-logout"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginTop: 'auto',
          width: '100%',
          color: '#64748b'
        }}
      >
        <LogOut size={18} style={{ transition: 'color 0.2s' }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>
      </button>
    </div>
  );
}