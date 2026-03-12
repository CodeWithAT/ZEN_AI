import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #080e1a 0%, #0f172a 50%, #0e0820 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Glowing background orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, cursor: 'pointer', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>ZEN AI</span>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 40, backdropFilter: 'blur(20px)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>Sign in to your ZEN AI workspace</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="email" placeholder="you@company.com" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px 14px 44px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
                <span style={{ fontSize: 12, color: '#8B5CF6', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 48px 14px 44px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
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
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(139,92,246,0.35)', marginTop: 4, transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,92,246,0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.35)'; }}
            >
              {isLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              Don't have an account?{' '}
              <span onClick={() => navigate('/register')} style={{ color: '#8B5CF6', fontWeight: 700, cursor: 'pointer' }}>
                Start for Free →
              </span>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['🔒 SOC 2 Type II', '🛡️ GDPR Compliant', '⭐ G2 4.7 Stars'].map(badge => (
            <span key={badge} style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{badge}</span>
          ))}
        </div>
      </div>
    </div>
  );
}