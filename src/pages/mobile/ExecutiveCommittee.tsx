import React from 'react';
import { ArrowLeft, Users, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const committeeMembers = [
  {
    id: 1,
    name: 'মো. আব্দুল্লাহ',
    role: 'সভাপতি',
    image: 'https://i.pravatar.cc/150?u=1',
    phone: '01711-000000',
    email: 'president@khansama.org'
  },
  {
    id: 2,
    name: 'মো. রফিকুল ইসলাম',
    role: 'সাধারণ সম্পাদক',
    image: 'https://i.pravatar.cc/150?u=2',
    phone: '01711-000001',
    email: 'secretary@khansama.org'
  },
  {
    id: 3,
    name: 'আহমেদ জুবায়ের',
    role: 'সাংগঠনিক সম্পাদক',
    image: 'https://i.pravatar.cc/150?u=3',
    phone: '01711-000002',
    email: 'org@khansama.org'
  },
  {
    id: 4,
    name: 'সাদিয়া আক্তার',
    role: 'কোষাধ্যক্ষ',
    image: 'https://i.pravatar.cc/150?u=4',
    phone: '01711-000003',
    email: 'finance@khansama.org'
  }
];

export default function ExecutiveCommittee() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-black text-slate-800">কার্যনির্বাহী কমিটি</h1>
      </div>

      <div className="p-6">
        <div className="bg-rose-500 rounded-[2rem] p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black mb-2">আমাদের নেতৃত্ব</h2>
            <p className="text-rose-100 font-medium">যারা আমাদের সংগঠনকে এগিয়ে নিয়ে যাচ্ছেন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {committeeMembers.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-rose-50" />
              <h3 className="text-lg font-black text-slate-800 mb-1">{member.name}</h3>
              <p className="text-rose-500 font-bold text-sm mb-4">{member.role}</p>
              
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-2 text-slate-500 bg-slate-50 py-2 rounded-xl">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">{member.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-500 bg-slate-50 py-2 rounded-xl">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
