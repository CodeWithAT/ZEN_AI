import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); 
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="bg-primary-navy p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full px-4 py-3 bg-bg-dark border border-white/20 rounded-xl text-white focus:border-accent-purple outline-none"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full px-4 py-3 bg-bg-dark border border-white/20 rounded-xl text-white focus:border-accent-purple outline-none"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold rounded-xl hover:scale-[1.02] transition-transform">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Don't have an account? <span className="text-accent-pink cursor-pointer" onClick={() => navigate('/register')}>Sign up</span>
        </p>
      </div>
    </div>
  );
}