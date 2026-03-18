import { Settings, Bell, Shield, Globe, Smartphone, Mail, Lock, Save, Trash2 } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-black text-slate-800">সিস্টেম সেটিংস</h2>
        <p className="text-sm text-slate-500 font-bold">প্ল্যাটফর্মের কনফিগারেশন এবং নিরাপত্তা পরিচালনা করুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <SettingTab icon={<Globe className="w-5 h-5" />} label="সাধারণ সেটিংস" active />
          <SettingTab icon={<Bell className="w-5 h-5" />} label="নোটিফিকেশন" />
          <SettingTab icon={<Shield className="w-5 h-5" />} label="নিরাপত্তা ও এক্সেস" />
          <SettingTab icon={<Smartphone className="w-5 h-5" />} label="মোবাইল অ্যাপ কনফিগ" />
          <SettingTab icon={<Mail className="w-5 h-5" />} label="ইমেইল ও এসএমএস" />
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-rose-500" /> সাধারণ কনফিগারেশন
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">অ্যাপের নাম</label>
                  <input type="text" defaultValue="রক্তদান" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">সাপোর্ট ইমেইল</label>
                  <input type="email" defaultValue="support@blooddonation.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">সিস্টেম মেইনটেন্যান্স মোড</label>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-600">মেইনটেন্যান্স মোড চালু করলে ইউজাররা অ্যাপ ব্যবহার করতে পারবে না</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">বাতিল</button>
                <button className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> সেভ করুন
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 text-rose-600">
              <Trash2 className="w-5 h-5" /> ডেঞ্জার জোন
            </h3>
            <div className="p-6 border-2 border-rose-50 rounded-3xl bg-rose-50/20">
              <h4 className="font-black text-rose-600 mb-2">সিস্টেম রিসেট</h4>
              <p className="text-sm text-slate-500 font-bold mb-4">সিস্টেম রিসেট করলে সকল ইউজার এবং অনুরোধের ডাটা মুছে যাবে। এটি আর ফিরে পাওয়া সম্ভব নয়।</p>
              <button className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
                পুরো সিস্টেম রিসেট করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingTab({ icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
      active ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
    }`}>
      {icon}
      {label}
    </button>
  );
}
