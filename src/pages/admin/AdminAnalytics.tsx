import { Activity, TrendingUp, Users, Droplet, Heart, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAppStore } from '@/store/useAppStore';

const data = [
  { name: 'জানু', donations: 45, requests: 60 },
  { name: 'ফেব্রু', donations: 52, requests: 55 },
  { name: 'মার্চ', donations: 48, requests: 70 },
  { name: 'এপ্রিল', donations: 61, requests: 65 },
  { name: 'মে', donations: 55, requests: 80 },
  { name: 'জুন', donations: 67, requests: 75 },
];

const bloodGroupData = [
  { name: 'A+', value: 400 },
  { name: 'B+', value: 300 },
  { name: 'O+', value: 500 },
  { name: 'AB+', value: 200 },
  { name: 'অন্যান্য', value: 150 },
];

const COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export default function AdminAnalytics() {
  const { users, requests } = useAppStore();

  const totalUsers = users.length;
  const totalDonors = users.filter(u => u.isDonor).length;
  const activeRequests = requests.filter(r => r.status === 'pending').length;
  const completedDonations = requests.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">অ্যানালিটিক্স ড্যাশবোর্ড</h2>
          <p className="text-sm text-slate-500 font-bold">সিস্টেমের সামগ্রিক পারফরম্যান্স এবং ইনসাইটস</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" /> গত ৩০ দিন
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
            রিপোর্ট ডাউনলোড
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="মোট ইউজার" 
          value={totalUsers} 
          change="+১২%" 
          isPositive={true} 
          icon={<Users className="w-6 h-6" />} 
          color="blue" 
        />
        <StatCard 
          title="সক্রিয় দাতা" 
          value={totalDonors} 
          change="+৫%" 
          isPositive={true} 
          icon={<Heart className="w-6 h-6" />} 
          color="rose" 
        />
        <StatCard 
          title="চলমান অনুরোধ" 
          value={activeRequests} 
          change="-২%" 
          isPositive={false} 
          icon={<Droplet className="w-6 h-6" />} 
          color="amber" 
        />
        <StatCard 
          title="সফল রক্তদান" 
          value={completedDonations} 
          change="+১৮%" 
          isPositive={true} 
          icon={<TrendingUp className="w-6 h-6" />} 
          color="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800">রক্তদান বনাম অনুরোধ</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-xs font-bold text-slate-500">রক্তদান</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-500">অনুরোধ</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="donations" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorDonations)" />
                <Area type="monotone" dataKey="requests" stroke="#e2e8f0" strokeWidth={4} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Group Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-8">রক্তের গ্রুপের অনুপাত</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloodGroupData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {bloodGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {bloodGroupData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                <span className="text-xs font-black text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon, color }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 group hover:shadow-2xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-800">{value}</h4>
    </div>
  );
}
