import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Droplet, Activity, Settings, LogOut, Menu, X, UserPlus, Wallet, Tent } from 'lucide-react';
import Logo from '@/assets/Logo.png';
import { useAppStore } from '@/store/useAppStore';

export default function AdminLayout() {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 font-sans relative overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-sm
      `}>
        <div className="p-8 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">খানসামা</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">অ্যাডমিন প্যানেল</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="ড্যাশবোর্ড" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/admin/users" icon={<Users size={20} />} label="ব্যবহারকারী" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/admin/campaign" icon={<Tent size={20} />} label="ক্যাম্পেইন" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/admin/requests" icon={<Droplet size={20} />} label="রক্তের অনুরোধ" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/admin/volunteers" icon={<UserPlus size={20} />} label="সেচ্ছাসেবী আবেদন" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/admin/donations" icon={<Wallet size={20} />} label="তহবিল অনুদান" onClick={() => setIsSidebarOpen(false)} />
          {currentUser?.role === 'admin' && (
            <>
              <NavItem to="/admin/analytics" icon={<Activity size={20} />} label="অ্যানালিটিক্স" onClick={() => setIsSidebarOpen(false)} />
              <NavItem to="/admin/settings" icon={<Settings size={20} />} label="সেটিংস" onClick={() => setIsSidebarOpen(false)} />
            </>
          )}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6 px-2">
            <img src={currentUser?.avatar} alt="Admin" className="w-12 h-12 rounded-2xl border-2 border-slate-100 object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-bold"
          >
            <LogOut size={20} />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800">সংক্ষিপ্ত বিবরণ</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">অবস্থা</span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                অনলাইন
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 lg:hidden">
              <Users size={20} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <NavLink 
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
