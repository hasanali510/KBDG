import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, User, Bell, Droplet } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function MobileLayout() {
  const { currentUser, notifications } = useAppStore();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <div className="flex min-h-screen bg-rose-50/50 font-sans">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-72 bg-white border-r border-rose-100 flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 flex items-center gap-3 border-b border-rose-50">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-rose-200">
            KB
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800 leading-tight">খানসামা</h1>
            <p className="text-xs text-rose-500 font-bold tracking-wider uppercase">রক্তদান সেবা</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <DesktopNavItem to="/home" icon={<Home size={22} />} label="হোম" />
          <DesktopNavItem to="/search" icon={<Search size={22} />} label="খুঁজুন" />
          <DesktopNavItem to="/requests" icon={<Droplet size={22} />} label="অনুরোধসমূহ" />
          <DesktopNavItem to="/profile" icon={<User size={22} />} label="প্রোফাইল" />
          
          <div className="pt-6">
            <button 
              onClick={() => navigate('/request')}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              <PlusCircle className="w-6 h-6" />
              <span>রক্তের অনুরোধ</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-rose-50">
          <button 
            onClick={() => navigate('/notifications')}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-slate-500 group-hover:text-rose-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <span className="font-bold text-slate-700 group-hover:text-rose-600">নোটিফিকেশন</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Top App Bar - Hidden on Desktop */}
        <header className="md:hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-5 flex justify-between items-center rounded-b-3xl shadow-lg shadow-rose-500/20 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <span className="font-bold text-lg tracking-wider">KB</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide">খানসামা</h1>
              <p className="text-xs text-rose-100 font-medium tracking-wider uppercase">রক্তদান সেবা</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-rose-500 rounded-full animate-ping"></span>
            )}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-28 md:pb-8 pt-6 px-4 md:px-10 max-w-6xl mx-auto w-full scroll-smooth">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Hidden on Desktop */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-10px_40px_rgba(255,77,109,0.08)] px-2 pt-4 pb-3 grid grid-cols-5 items-center z-20 border-t border-rose-100/50">
          <div className="flex justify-center">
            <NavItem to="/home" icon={<Home size={22} strokeWidth={2.5} />} label="হোম" />
          </div>
          <div className="flex justify-center">
            <NavItem to="/search" icon={<Search size={22} strokeWidth={2.5} />} label="খুঁজুন" />
          </div>
          
          {/* Floating Action Button for Request */}
          <div className="flex justify-center relative w-full h-full">
            <div className="flex flex-col items-center absolute -top-8 left-1/2 -translate-x-1/2">
              <button 
                onClick={() => navigate('/request')}
                className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-white"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-black text-rose-500 mt-1">অনুরোধ</span>
            </div>
          </div>

          <div className="flex justify-center">
            <NavItem to="/requests" icon={<Droplet size={22} strokeWidth={2.5} />} label="অনুরোধ" />
          </div>
          <div className="flex justify-center">
            <NavItem to="/profile" icon={<User size={22} strokeWidth={2.5} />} label="প্রোফাইল" />
          </div>
        </nav>
      </div>
    </div>
  );
}

function DesktopNavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
          isActive 
            ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20' 
            : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600 font-bold'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
            {icon}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}
