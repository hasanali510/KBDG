import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Search as SearchIcon, MapPin, Phone, Droplet, Filter, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function Search() {
  const { users, currentUser } = useAppStore();
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const donors = users.filter(u => 
    u.id !== currentUser?.id &&
    u.isDonor && 
    (bloodGroup ? u.bloodGroup === bloodGroup : true) &&
    (location ? u.location.toLowerCase().includes(location.toLowerCase()) : true)
  );

  const handleAiMatch = async () => {
    if (!bloodGroup) {
      alert('অনুগ্রহ করে আগে রক্তের গ্রুপ নির্বাচন করুন');
      return;
    }
    
    setIsAiLoading(true);
    setAiSuggestion(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      
      const donorContext = donors.slice(0, 10).map(d => ({
        name: d.name,
        bloodGroup: d.bloodGroup,
        location: d.location,
        isAvailable: d.isAvailable,
        donationsCount: d.donationsCount
      }));

      const prompt = `You are an AI assistant for a blood donation app called "Khansama Blood Service". 
      I need to find the best donors for blood group "${bloodGroup}" ${location ? `in "${location}"` : ''}.
      
      Here is the list of available donors:
      ${JSON.stringify(donorContext)}
      
      Please analyze the list and suggest the top 2-3 most suitable donors. 
      Consider availability (isAvailable: true is better), location proximity (if location is provided), and donation history (higher donationsCount is better).
      
      Provide your response in Bengali. Keep it concise and encouraging. 
      Format: 
      "AI পরামর্শ: [আপনার বিশ্লেষণ]
      
      সেরা দাতা:
      1. [নাম] - [কেন সেরা]
      2. [নাম] - [কেন সেরা]"`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setAiSuggestion(response.text || "দুঃখিত, এই মুহূর্তে কোন পরামর্শ পাওয়া যায়নি।");
    } catch (error) {
      console.error('AI Error:', error);
      setAiSuggestion("দুঃখিত, এআই পরামর্শ পেতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-20">
      <div>
        <h2 className="text-3xl font-black text-slate-800">রক্তদাতা খুঁজুন</h2>
        <p className="text-sm text-slate-500 font-bold">সঠিক রক্তদাতা খুঁজে জীবন বাঁচান</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রক্তের গ্রুপ</label>
          <div className="grid grid-cols-4 gap-3">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
              <button
                key={bg}
                onClick={() => setBloodGroup(bg === bloodGroup ? '' : bg)}
                className={`py-3.5 rounded-2xl font-black text-sm transition-all border-2 ${
                  bloodGroup === bg 
                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-rose-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">অবস্থান</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="যেমন: ঢাকা, চট্টগ্রাম..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 focus:border-rose-200 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <button 
          onClick={handleAiMatch}
          disabled={isAiLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isAiLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6" />
          )}
          <span>এআই স্মার্ট ম্যাচ</span>
        </button>
      </div>

      {/* AI Suggestion Box */}
      {aiSuggestion && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 rounded-[2.5rem] shadow-lg shadow-amber-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-black text-amber-800 text-lg">এআই পরামর্শ</h3>
          </div>
          <div className="text-amber-900 text-sm font-bold leading-relaxed whitespace-pre-wrap">
            {aiSuggestion}
          </div>
          <button 
            onClick={() => setAiSuggestion(null)}
            className="mt-6 text-xs font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-slate-800 text-xl">রক্তদাতাদের তালিকা ({donors.length})</h3>
          <Filter className="w-5 h-5 text-slate-400" />
        </div>

        {donors.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Droplet className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">কোন দাতা পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 font-bold">অন্য কোন গ্রুপ বা অবস্থান চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {donors.map(donor => (
              <div 
                key={donor.id} 
                onClick={() => navigate(`/user/${donor.id}`)}
                className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center justify-between group hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img src={donor.avatar} alt={donor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${donor.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-800 text-lg">{donor.name}</h4>
                      <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-lg text-[10px] font-black border border-rose-100">{donor.bloodGroup}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{donor.location.split(',')[0]}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{donor.donationsCount} রক্তদান</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  disabled={!donor.isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (donor.isAvailable) {
                      window.location.href = `tel:${donor.phone}`;
                    }
                  }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 ${
                    donor.isAvailable 
                      ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' 
                      : 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                  }`}
                >
                  <Phone className="w-6 h-6" fill={donor.isAvailable ? "currentColor" : "none"} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
