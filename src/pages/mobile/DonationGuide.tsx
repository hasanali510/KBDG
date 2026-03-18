import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Info, CheckCircle, AlertTriangle, Droplets, Calendar, Coffee, Apple, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const DonationGuide: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'রক্তদানের আগে করণীয়',
      icon: <Calendar className="text-emerald-500" />,
      items: [
        'পর্যাপ্ত পরিমাণে পানি পান করুন।',
        'পুষ্টিকর খাবার গ্রহণ করুন, খালি পেটে রক্ত দেবেন না।',
        'আগের রাতে অন্তত ৭-৮ ঘণ্টা ভালো করে ঘুমান।',
        'ধূমপান বা মদ্যপান থেকে বিরত থাকুন।'
      ]
    },
    {
      title: 'রক্তদানের সময় করণীয়',
      icon: <Droplets className="text-red-500" />,
      items: [
        'শান্ত থাকুন এবং স্বাভাবিকভাবে শ্বাস নিন।',
        'রক্তদানের সময় আপনার হাত মুষ্টিবদ্ধ করুন এবং খুলুন।',
        'যদি কোনো অস্বস্তি বোধ করেন, তবে সাথে সাথে নার্সকে জানান।'
      ]
    },
    {
      title: 'রক্তদানের পরে করণীয়',
      icon: <Coffee className="text-amber-500" />,
      items: [
        'রক্তদানের পর অন্তত ১০-১৫ মিনিট বিশ্রাম নিন।',
        'প্রচুর পরিমাণে তরল খাবার এবং হালকা নাস্তা করুন।',
        'পরের কয়েক ঘণ্টা ভারী কাজ বা ব্যায়াম করবেন না।',
        'রক্তদানের স্থানে লাগানো ব্যান্ডেজ অন্তত ৪-৫ ঘণ্টা রাখুন।'
      ]
    },
    {
      title: 'কারা রক্ত দিতে পারবেন?',
      icon: <ShieldCheck className="text-blue-500" />,
      items: [
        'বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে।',
        'ওজন অন্তত ৫০ কেজি হতে হবে।',
        'হিমোগ্লোবিনের মাত্রা সঠিক থাকতে হবে।',
        'কোনো সংক্রামক রোগ বা বড় কোনো অস্ত্রোপচার না হয়ে থাকলে।'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">রক্তদান নির্দেশিকা</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-600 to-red-700 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">আপনার এক ব্যাগ রক্ত,<br />বাঁচাতে পারে একটি প্রাণ!</h2>
            <p className="text-red-100 text-sm leading-relaxed opacity-90">
              রক্তদান একটি মহৎ কাজ। সঠিক নিয়ম মেনে রক্তদান করলে আপনার শরীরের কোনো ক্ষতি হয় না, বরং নতুন রক্ত তৈরিতে সাহায্য করে।
            </p>
          </div>
          <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </motion.div>

        {/* Guide Sections */}
        <div className="grid gap-4">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-2xl">
                  {section.icon}
                </div>
                <h3 className="font-bold text-slate-800">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Warning Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex gap-4"
        >
          <div className="p-3 bg-amber-100 rounded-2xl h-fit">
            <AlertTriangle className="text-amber-600" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1 text-sm">সতর্কতা</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              যদি আপনার কোনো দীর্ঘমেয়াদী রোগ থাকে বা কোনো নিয়মিত ওষুধ সেবন করেন, তবে রক্তদানের আগে অবশ্যই চিকিৎসকের পরামর্শ নিন।
            </p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 px-2">সাধারণ কিছু প্রশ্ন</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="font-bold text-sm text-slate-800 mb-1">রক্ত দিলে কি শরীর দুর্বল হয়?</p>
              <p className="text-xs text-slate-500">না, সুস্থ মানুষ রক্ত দিলে শরীর দুর্বল হয় না। বরং নতুন রক্তকণিকা তৈরি হয় যা শরীরের জন্য ভালো।</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="font-bold text-sm text-slate-800 mb-1">কতদিন পর পর রক্ত দেওয়া যায়?</p>
              <p className="text-xs text-slate-500">সাধারণত প্রতি ৪ মাস (১২০ দিন) অন্তর অন্তর রক্ত দেওয়া নিরাপদ।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
