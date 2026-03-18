import { useAppStore } from '@/store/useAppStore';
import { Users, Droplet, Heart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const { users, requests } = useAppStore();

  const stats = [
    { 
      title: 'মোট ব্যবহারকারী', 
      value: users.length, 
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      bg: 'bg-indigo-50',
      trend: '+১২%',
      isUp: true
    },
    { 
      title: 'সক্রিয় রক্তদাতা', 
      value: users.filter(u => u.isDonor).length, 
      icon: <Droplet className="w-6 h-6 text-rose-500" fill="currentColor" />,
      bg: 'bg-rose-50',
      trend: '+৫%',
      isUp: true
    },
    { 
      title: 'মোট অনুরোধ', 
      value: requests.length, 
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      bg: 'bg-amber-50',
      trend: '-২%',
      isUp: false
    },
    { 
      title: 'রক্ষা করা জীবন', 
      value: requests.filter(r => r.status === 'completed').length * 3, 
      icon: <Heart className="w-6 h-6 text-emerald-500" fill="currentColor" />,
      bg: 'bg-emerald-50',
      trend: '+১৮%',
      isUp: true
    },
  ];

  const chartData = [
    { name: 'সোম', donations: 4, requests: 6 },
    { name: 'মঙ্গল', donations: 3, requests: 4 },
    { name: 'বুধ', donations: 7, requests: 8 },
    { name: 'বৃহস্পতি', donations: 5, requests: 5 },
    { name: 'শুক্র', donations: 8, requests: 10 },
    { name: 'শনি', donations: 12, requests: 15 },
    { name: 'রবি', donations: 10, requests: 12 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend} গত সপ্তাহ থেকে
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">সাপ্তাহিক কার্যক্রমের সংক্ষিপ্ত বিবরণ</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="donations" name="রক্তদান" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="requests" name="অনুরোধ" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">রক্তদানের প্রবণতা</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="donations" name="রক্তদান" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">সাম্প্রতিক রক্তের অনুরোধ</h3>
          <button className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">সব দেখুন</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">রোগীর নাম</th>
                <th className="p-4 font-semibold">রক্তের গ্রুপ</th>
                <th className="p-4 font-semibold">অবস্থান</th>
                <th className="p-4 font-semibold">অবস্থা</th>
                <th className="p-4 font-semibold">তারিখ</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {requests.slice(0, 5).map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{req.patientName}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-md font-bold text-xs border border-rose-100">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{req.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md font-bold text-xs uppercase tracking-wider ${
                      req.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      req.status === 'accepted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {req.status === 'pending' ? 'অপেক্ষমান' : 
                       req.status === 'accepted' ? 'গৃহীত' : 'সম্পন্ন'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(req.createdAt).toLocaleDateString('bn-BD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
