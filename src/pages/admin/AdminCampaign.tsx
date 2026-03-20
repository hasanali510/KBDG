import React, { useState, useRef } from 'react';
import { UserPlus, FileText, CheckCircle2, Download, Loader2, Plus, Calendar, MapPin, Activity, ArrowLeft, Users, FileBarChart, Trash2, ListPlus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Logo from '@/assets/Logo.png';

export default function AdminCampaign() {
  const { campaigns, addCampaign, incrementCampaignDonors, incrementCampaignReports, addUser } = useAppStore();
  
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'addDonor' | 'reportCard'>('addDonor');
  
  // New Campaign State
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  // New Donor State
  const [newDonor, setNewDonor] = useState({
    name: '',
    phone: '',
    bloodGroup: 'A+',
    location: '',
  });
  const [donorSuccess, setDonorSuccess] = useState(false);

  // Report Card State
  const [reportData, setReportData] = useState({
    name: '',
    age: '',
    gender: 'পুরুষ',
    bloodGroup: 'A+',
    date: new Date().toISOString().split('T')[0],
  });
  const [reportQueue, setReportQueue] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      name: newCampaign.name,
      date: newCampaign.date,
      location: newCampaign.location,
      status: 'active'
    });
    setShowCreateModal(false);
    setNewCampaign({ name: '', date: new Date().toISOString().split('T')[0], location: '' });
  };

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newDonor.name,
      phone: newDonor.phone,
      bloodGroup: newDonor.bloodGroup,
      location: newDonor.location,
      email: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newDonor.name)}&background=random`,
      lastDonationDate: null,
      isDonor: true,
      isAvailable: true,
      hidePhone: false,
      donationsCount: 0,
      role: 'user',
      badges: [],
      isVerified: false,
    });
    
    if (selectedCampaignId) {
      incrementCampaignDonors(selectedCampaignId);
    }

    setDonorSuccess(true);
    setNewDonor({ name: '', phone: '', bloodGroup: 'A+', location: '' });
    setTimeout(() => setDonorSuccess(false), 3000);
  };

  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData.name) return;
    setReportQueue([...reportQueue, { ...reportData, id: Math.random().toString(36).substring(7) }]);
    setReportData({ ...reportData, name: '', age: '' });
  };

  const handleRemoveFromQueue = (id: string) => {
    setReportQueue(reportQueue.filter(r => r.id !== id));
  };

  const handleGenerateBatchReport = async () => {
    if (reportQueue.length === 0) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'a4'
      });

      const cardWidth = 3;
      const cardHeight = 6;
      const a4Width = 11.69;
      const a4Height = 8.27;

      const totalCardsWidth = 3 * cardWidth;
      const remainingWidth = a4Width - totalCardsWidth;
      const xGap = remainingWidth / 4;
      const yMargin = (a4Height - cardHeight) / 2;

      for (let i = 0; i < reportQueue.length; i++) {
        const element = document.getElementById(`pdf-report-card-${i}`);
        if (!element) continue;

        const imgData = await toPng(element, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        });
        
        const positionIndex = i % 3;
        if (i > 0 && positionIndex === 0) {
          pdf.addPage();
        }
        
        const x = xGap + positionIndex * (cardWidth + xGap);
        const y = yMargin;
        
        pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);
      }
      
      pdf.save(`blood-group-reports-${new Date().getTime()}.pdf`);

      if (selectedCampaignId) {
        for(let i=0; i<reportQueue.length; i++) {
          incrementCampaignReports(selectedCampaignId);
        }
      }
      
      setReportQueue([]);
    } catch (error) {
      console.error('Error generating batch report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedCampaignId && selectedCampaign) {
    return (
      <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button 
              onClick={() => setSelectedCampaignId(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> ফিরে যান
            </button>
            <h1 className="text-3xl font-black text-slate-800">{selectedCampaign.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(selectedCampaign.date).toLocaleDateString('bn-BD')}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedCampaign.location}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">নতুন ডোনার</p>
                <p className="text-xl font-black text-slate-800">{selectedCampaign.donorsAddedCount}</p>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <FileBarChart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">রিপোর্ট প্রদান</p>
                <p className="text-xl font-black text-slate-800">{selectedCampaign.reportsGeneratedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('addDonor')}
            className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'addDonor' 
                ? 'border-rose-500 text-rose-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> নতুন ডোনার যুক্ত করুন
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reportCard')}
            className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'reportCard' 
                ? 'border-rose-500 text-rose-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> রক্তের গ্রুপ রিপোর্ট
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-10">
          {activeTab === 'addDonor' ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-black text-slate-800 mb-6">নতুন ডোনার প্রোফাইল তৈরি করুন</h2>
              
              {donorSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 font-bold border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                  নতুন ডোনার সফলভাবে যুক্ত করা হয়েছে!
                </div>
              )}

              <form onSubmit={handleAddDonor} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">নাম</label>
                  <input 
                    type="text" 
                    required
                    value={newDonor.name}
                    onChange={e => setNewDonor({...newDonor, name: e.target.value})}
                    placeholder="ডোনারের নাম"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ফোন নম্বর</label>
                    <input 
                      type="text" 
                      required
                      value={newDonor.phone}
                      onChange={e => setNewDonor({...newDonor, phone: e.target.value})}
                      placeholder="০১৭..."
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রক্তের গ্রুপ</label>
                    <select 
                      value={newDonor.bloodGroup}
                      onChange={e => setNewDonor({...newDonor, bloodGroup: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ঠিকানা</label>
                  <input 
                    type="text" 
                    required
                    value={newDonor.location}
                    onChange={e => setNewDonor({...newDonor, location: e.target.value})}
                    placeholder="বর্তমান ঠিকানা"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" /> ডোনার যুক্ত করুন
                </button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Form */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-800 mb-6">রিপোর্ট কার্ডের তথ্য</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">নাম</label>
                    <input 
                      type="text" 
                      value={reportData.name}
                      onChange={e => setReportData({...reportData, name: e.target.value})}
                      placeholder="রোগীর নাম"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">বয়স</label>
                      <input 
                        type="text" 
                        value={reportData.age}
                        onChange={e => setReportData({...reportData, age: e.target.value})}
                        placeholder="যেমন: ২৫"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">লিঙ্গ</label>
                      <select 
                        value={reportData.gender}
                        onChange={e => setReportData({...reportData, gender: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      >
                        <option value="পুরুষ">পুরুষ</option>
                        <option value="মহিলা">মহিলা</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">রক্তের গ্রুপ</label>
                      <select 
                        value={reportData.bloodGroup}
                        onChange={e => setReportData({...reportData, bloodGroup: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">তারিখ</label>
                      <input 
                        type="date" 
                        value={reportData.date}
                        onChange={e => setReportData({...reportData, date: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAddToQueue}
                  disabled={!reportData.name}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-800/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ListPlus className="w-5 h-5" />
                  তালিকায় যোগ করুন
                </button>
              </div>

              {/* Right Side - Queue List */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col">
                {reportQueue.length > 0 ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-slate-800 text-lg">রিপোর্টের তালিকা ({reportQueue.length})</h3>
                      <span className="text-xs font-bold px-3 py-1.5 bg-rose-100 text-rose-600 rounded-xl">
                        {Math.ceil(reportQueue.length / 3)} টি পেজ লাগবে
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
                      {reportQueue.map((report, idx) => (
                        <div key={report.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-rose-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{report.name}</p>
                              <p className="text-sm font-medium text-slate-500">{report.bloodGroup} • {report.age} বছর</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveFromQueue(report.id)}
                            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleGenerateBatchReport}
                      disabled={isExporting}
                      className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                    >
                      {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                      {isExporting ? 'পিডিএফ তৈরি হচ্ছে...' : `সবগুলো পিডিএফ ডাউনলোড করুন (${reportQueue.length})`}
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <ListPlus className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">তালিকা খালি</h3>
                    <p className="text-slate-500 font-medium text-sm max-w-[250px]">
                      বাম পাশের ফর্ম পূরণ করে "তালিকায় যোগ করুন" বাটনে ক্লিক করুন। একসাথে একাধিক রিপোর্ট তৈরি করতে পারবেন।
                    </p>
                  </div>
                )}
              </div>

              {/* Hidden PDF Export Content */}
              <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                {reportQueue.map((report, index) => (
                  <div 
                    key={report.id}
                    id={`pdf-report-card-${index}`}
                    className="pdf-report-card"
                    style={{ 
                      position: 'relative',
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                      width: '3in', 
                      height: '6in', 
                      fontFamily: '"Hind Siliguri", sans-serif',
                      border: '1px solid #e2e8f0',
                      boxSizing: 'border-box',
                      padding: '0.2in',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Watermark */}
                    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
                      <img src={Logo} alt="Watermark" style={{ width: '2in', height: '2in', objectFit: 'contain' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* Header */}
                      <div style={{ textAlign: 'center', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #f43f5e' }}>
                        <img src={Logo} alt="Logo" style={{ width: '0.4in', height: '0.4in', objectFit: 'contain', margin: '0 auto 4px auto' }} />
                        <h3 style={{ fontWeight: 900, color: '#e11d48', fontSize: '12pt', margin: 0, lineHeight: 1.2 }}>খানসামা রক্তদান গ্রুপ</h3>
                        <p style={{ fontWeight: 700, color: '#64748b', fontSize: '7pt', margin: 0 }}>বিনামূল্যে রক্তের গ্রুপ নির্ণয়</p>
                      </div>

                      {/* Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#64748b', fontSize: '9pt' }}>নাম:</span>
                          <span style={{ fontWeight: 900, color: '#1e293b', fontSize: '9pt' }}>{report.name || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#64748b', fontSize: '9pt' }}>বয়স:</span>
                          <span style={{ fontWeight: 900, color: '#1e293b', fontSize: '9pt' }}>{report.age || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#64748b', fontSize: '9pt' }}>লিঙ্গ:</span>
                          <span style={{ fontWeight: 900, color: '#1e293b', fontSize: '9pt' }}>{report.gender}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#64748b', fontSize: '9pt' }}>তারিখ:</span>
                          <span style={{ fontWeight: 900, color: '#1e293b', fontSize: '9pt' }}>
                            {new Date(report.date).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div style={{ 
                        backgroundColor: '#fff1f2', 
                        border: '2px solid #ffe4e6', 
                        borderRadius: '12px',
                        padding: '0.2in',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                      }}>
                        <p style={{ fontSize: '9pt', fontWeight: 700, color: '#e11d48', margin: '0 0 8px 0' }}>রক্তের গ্রুপ</p>
                        <h2 style={{ fontSize: '36pt', fontWeight: 900, color: '#e11d48', margin: 0, lineHeight: 1 }}>{report.bloodGroup}</h2>
                      </div>
                      
                      <div style={{ marginTop: '8px', textAlign: 'center' }}>
                        <p style={{ fontSize: '7pt', color: '#94a3b8', margin: 0 }}>রিপোর্ট আইডি: #{report.id.toUpperCase()}</p>
                      </div>

                      {/* Signatures */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ width: '0.8in', borderBottom: '1px solid #1e293b', marginBottom: '4px' }}></div>
                          <p style={{ fontSize: '6pt', fontWeight: 700, color: '#64748b', margin: 0 }}>টেকনিশিয়ান</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ width: '0.8in', borderBottom: '1px solid #1e293b', marginBottom: '4px' }}></div>
                          <p style={{ fontSize: '6pt', fontWeight: 700, color: '#64748b', margin: 0 }}>কর্তৃপক্ষ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">ক্যাম্পেইন পরিচালনা</h1>
          <p className="text-slate-500 font-medium mt-1">ক্যাম্পেইন তৈরি করুন এবং কার্যক্রম পরিচালনা করুন</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-500/30 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> নতুন ক্যাম্পেইন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800">কোনো ক্যাম্পেইন নেই</h3>
            <p className="text-slate-500 font-medium mt-1">নতুন একটি ক্যাম্পেইন তৈরি করে কার্যক্রম শুরু করুন</p>
          </div>
        ) : (
          campaigns.map(campaign => (
            <div 
              key={campaign.id} 
              onClick={() => setSelectedCampaignId(campaign.id)}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  campaign.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {campaign.status === 'active' ? 'চলমান' : 'সম্পন্ন'}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-2">{campaign.name}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(campaign.date).toLocaleDateString('bn-BD')}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                  <MapPin className="w-4 h-4" />
                  {campaign.location}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">নতুন ডোনার</p>
                  <p className="text-lg font-black text-slate-800">{campaign.donorsAddedCount}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">রিপোর্ট প্রদান</p>
                  <p className="text-lg font-black text-slate-800">{campaign.reportsGeneratedCount}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800">নতুন ক্যাম্পেইন তৈরি করুন</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ক্যাম্পেইনের নাম</label>
                <input 
                  type="text" 
                  required
                  value={newCampaign.name}
                  onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="যেমন: বিনামূল্যে রক্তের গ্রুপ নির্ণয়"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">তারিখ</label>
                <input 
                  type="date" 
                  required
                  value={newCampaign.date}
                  onChange={e => setNewCampaign({...newCampaign, date: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">স্থান</label>
                <input 
                  type="text" 
                  required
                  value={newCampaign.location}
                  onChange={e => setNewCampaign({...newCampaign, location: e.target.value})}
                  placeholder="ক্যাম্পেইনের স্থান"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-rose-200 focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black transition-all active:scale-95"
                >
                  বাতিল
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-500/30 transition-all active:scale-95"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
