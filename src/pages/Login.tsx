import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Heart, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Login() {
  const [email, setEmail] = useState('john@example.com');
  const navigate = useNavigate();
  const { users, login } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      login(user);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } else {
      alert('User not found. Try john@example.com or admin@khansama.com');
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Left Side - Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 to-pink-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-10 mx-auto rotate-12 hover:rotate-0 transition-transform duration-700 cursor-pointer">
            <Droplet className="w-16 h-16 text-rose-500" fill="currentColor" />
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">খানসামা</h1>
          <p className="text-xl text-rose-100 font-medium leading-relaxed mb-12">
            আপনার এক ব্যাগ রক্ত বাঁচাতে পারে তিনটি জীবন। আজই আমাদের সাথে যুক্ত হন এবং মানবতার সেবায় এগিয়ে আসুন।
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <p className="text-3xl font-bold text-white mb-1">৫০০+</p>
              <p className="text-xs text-rose-100 font-bold uppercase tracking-widest">দাতা</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <p className="text-3xl font-bold text-white mb-1">১০০+</p>
              <p className="text-xs text-rose-100 font-bold uppercase tracking-widest">অনুরোধ</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <p className="text-3xl font-bold text-white mb-1">১০০০+</p>
              <p className="text-xs text-rose-100 font-bold uppercase tracking-widest">জীবন রক্ষা</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile Header Decoration */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-b-[3rem] shadow-xl z-0"></div>
        
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 rotate-12">
              <Droplet className="w-10 h-10 text-rose-500" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">খানসামা</h1>
            <p className="text-rose-100 font-bold text-sm flex items-center gap-2">
              জীবন বাঁচান <Heart className="w-4 h-4" fill="currentColor" /> রক্তদান করুন
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] shadow-2xl border border-white shadow-rose-500/5">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-2">স্বাগতম</h2>
              <p className="text-slate-500 font-medium">আপনার অ্যাকাউন্টে লগইন করুন</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">ইমেইল বা ফোন</label>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-medium text-slate-800"
                  placeholder="আপনার ইমেইল লিখুন"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
              >
                এগিয়ে যান <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                অ্যাকাউন্ট নেই? <span className="text-rose-500 font-black cursor-pointer hover:underline">নিবন্ধন করুন</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
