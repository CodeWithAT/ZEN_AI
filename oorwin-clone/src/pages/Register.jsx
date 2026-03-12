import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Registration failed";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = ['AI-powered candidate matching', 'Unified ATS + CRM + HRMS', 'Real-time analytics dashboard'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #080e1a 0%, #0f172a 50%, #0e0820 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Glowing background orbs */}
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(91,115,232,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, cursor: 'pointer', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>ZEN AI</span>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 40, backdropFilter: 'blur(20px)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 14 }}>
              <Sparkles size={13} color="#8B5CF6" />
              <span style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>7-Day Free Trial</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>Create your account</h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>Start hiring smarter with AI-powered tools</p>
          </div>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, padding: '16px', background: 'rgba(16,185,129,0.04)', borderRadius: 14, border: '1px solid rgba(16,185,129,0.1)' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                <CheckCircle2 size={14} color="#10b981" />
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="text" placeholder="Your full name" required
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 16px 13px 44px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="email" placeholder="you@company.com" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 16px 13px 44px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" minLength={6} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 48px 13px 44px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #5B73E8, #8B5CF6)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(91,115,232,0.35)', marginTop: 4, transition: 'transform 0.2s' }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {isLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</> : 'Start for Free →'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 16 }}>
            No credit card required • Cancel anytime
          </p>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#5B73E8', fontWeight: 700, cursor: 'pointer' }}>
                Sign in →
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}