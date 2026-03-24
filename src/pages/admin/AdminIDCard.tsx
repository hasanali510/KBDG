import React, { useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Badge as BadgeIcon, Search, Printer, Download, Upload, Image as ImageIcon, FileText, ChevronDown } from 'lucide-react';
import Logo from '@/assets/Logo.png';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

export default function AdminIDCard() {
  const { users, committeeMembers, updateUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery)
  );

  const selectedUser = users.find(u => u.id === selectedUserId);
  const committeeInfo = committeeMembers.find(c => c.userId === selectedUserId && c.status === 'active');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedUserId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser(selectedUserId, { avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateProgress = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 0;
        const next = prev + Math.floor(Math.random() * 15) + 5;
        return next > 90 ? 90 : next;
      });
    }, 150);
    return interval;
  };

  const downloadPNG = async () => {
    try {
      const element = document.getElementById('id-card-print-area');
      if (!element || !selectedUser) return;
      
      setShowDownloadMenu(false);
      const interval = simulateProgress();
      
      const dataUrl = await toPng(element, { pixelRatio: 4 });
      
      clearInterval(interval);
      setDownloadProgress(100);
      
      const link = document.createElement('a');
      link.download = `ID_Card_${selectedUser.name}.png`;
      link.href = dataUrl;
      link.click();
      
      setTimeout(() => setDownloadProgress(null), 1000);
    } catch (error) {
      console.error("Error downloading PNG:", error);
      alert("ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      setDownloadProgress(null);
    }
  };

  const downloadPDF = async () => {
    try {
      const element = document.getElementById('id-card-print-area');
      if (!element || !selectedUser) return;
      
      setShowDownloadMenu(false);
      const interval = simulateProgress();
      
      const imgData = await toPng(element, { pixelRatio: 4 });
      
      // A4 size: 210 x 297 mm
      // Standard CR80 ID Card size: 54 x 86 mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Place the ID card at the top-left with a 20mm margin
      pdf.addImage(imgData, 'PNG', 20, 20, 54, 86);
      pdf.save(`ID_Card_${selectedUser.name}.pdf`);
      
      clearInterval(interval);
      setDownloadProgress(100);
      
      setTimeout(() => setDownloadProgress(null), 1000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      setDownloadProgress(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Side - User List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ডিজিটাল আইডি কার্ড</h1>
          <p className="text-slate-500">সদস্যদের আইডি কার্ড তৈরি ও প্রিন্ট করুন</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="সদস্য খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 max-h-[600px] overflow-y-auto">
          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedUserId === user.id ? 'bg-rose-50 border-l-4 border-rose-500' : 'hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.phone}</p>
                </div>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                  {user.bloodGroup}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - ID Card Preview */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center bg-slate-100 rounded-3xl border border-slate-200 p-8 min-h-[600px]">
        {!selectedUser ? (
          <div className="text-center text-slate-400">
            <BadgeIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">আইডি কার্ড দেখতে বাম পাশ থেকে একজন সদস্য নির্বাচন করুন</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex gap-4 w-full justify-end print:hidden">
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)} 
                  disabled={downloadProgress !== null}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                >
                  <Download size={18} className={downloadProgress !== null ? "animate-bounce" : ""} />
                  <span>
                    {downloadProgress !== null 
                      ? `প্রসেসিং... ${downloadProgress}%` 
                      : 'ডাউনলোড'}
                  </span>
                  {downloadProgress === null && <ChevronDown size={16} />}
                </button>
                
                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-20">
                    <button 
                      onClick={downloadPNG} 
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 border-b border-slate-50 flex items-center gap-2"
                    >
                      <ImageIcon size={16} /> PNG হিসেবে সেভ করুন
                    </button>
                    <button 
                      onClick={downloadPDF} 
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      <FileText size={16} /> PDF (A4 সাইজ)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ID Card Design (Printable Area) */}
            <div id="id-card-print-area" className="w-[324px] h-[516px] bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 flex flex-col">
              {/* Header Background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-rose-600 to-rose-800 rounded-b-[40px]"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center pt-5 px-6 h-full">
                {/* Logo & Org Name */}
                <div className="flex flex-col items-center mb-3 text-white shrink-0">
                  <div className="w-10 h-10 bg-white rounded-full p-1 mb-1 shadow-md">
                    <img src={Logo} alt="Logo" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  </div>
                  <h2 className="text-sm font-bold tracking-wide">খানসামা ব্লাড ডোনেশন গ্রুপ</h2>
                </div>

                {/* Profile Picture */}
                <div className="relative w-28 h-28 mb-3 group shrink-0">
                  <div className="w-full h-full rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover aspect-square" crossOrigin="anonymous" />
                  </div>
                  
                  {/* Upload Overlay (Hidden in print) */}
                  <label className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity print:hidden">
                    <Upload size={24} />
                    <span className="text-[10px] mt-1 font-medium">ছবি পরিবর্তন</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {/* User Info */}
                <div className="text-center w-full mb-3 shrink-0">
                  <h3 className="text-xl font-bold text-slate-800 mb-0.5">{selectedUser.name}</h3>
                  <p className="text-sm font-bold text-rose-600 mb-0.5">
                    {committeeInfo ? committeeInfo.designation : 'সাধারণ সদস্য'}
                  </p>
                  <p className="text-xs text-slate-500">আইডি: KBDG-{selectedUser.id.padStart(4, '0')}</p>
                </div>

                {/* Details Grid */}
                <div className="w-full grid grid-cols-2 gap-y-2 gap-x-2 text-xs mb-auto">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-slate-400 mb-0.5 text-[10px]">রক্তের গ্রুপ</p>
                    <p className="font-bold text-rose-600 text-sm">{selectedUser.bloodGroup}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-slate-400 mb-0.5 text-[10px]">মোবাইল</p>
                    <p className="font-bold text-slate-700">{selectedUser.phone}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2">
                    <p className="text-slate-400 mb-0.5 text-[10px]">ঠিকানা</p>
                    <p className="font-bold text-slate-700 truncate">{selectedUser.location}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-between items-end pb-5 pt-3 border-t border-slate-100 mt-auto shrink-0">
                  <div className="text-center">
                    <div className="w-16 h-px bg-slate-800 mb-1 mx-auto"></div>
                    <p className="text-[8px] font-bold text-slate-600">স্বাক্ষর (সভাপতি)</p>
                  </div>
                  {/* QR Code */}
                  <div className="w-12 h-12 bg-slate-100 p-1 rounded border border-slate-200 flex items-center justify-center">
                    <QRCodeCanvas value={`KBDG-${selectedUser.id}`} size={40} level="L" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Print Styles */}
            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #id-card-print-area, #id-card-print-area * {
                  visibility: visible;
                }
                #id-card-print-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  box-shadow: none;
                  border: 1px solid #e2e8f0;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
