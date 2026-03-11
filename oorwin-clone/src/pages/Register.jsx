import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      console.error("Full Backend Error:", error);
      
      // This will now show the EXACT error message coming from your Node.js backend
      const errorMessage = error.response?.data?.error || error.message || "Registration failed";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="bg-primary-navy p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full px-4 py-3 bg-bg-dark border border-white/20 rounded-xl text-white focus:border-accent-purple outline-none"
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full px-4 py-3 bg-bg-dark border border-white/20 rounded-xl text-white focus:border-accent-purple outline-none"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" minLength={6} required
            className="w-full px-4 py-3 bg-bg-dark border border-white/20 rounded-xl text-white focus:border-accent-purple outline-none"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Start for Free"}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account? <span className="text-accent-blue cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}