import { Award, Droplet, CheckCircle2, ShieldCheck, BadgeCheck } from 'lucide-react';

export const getBadgeStyle = (badge: string) => {
  const trimmedBadge = badge.trim();
  switch (trimmedBadge) {
    case 'রক্তদাতা হিরো': return { icon: Award, bg: 'bg-amber-100', text: 'text-amber-700' };
    case '৫ বার রক্তদান': return { icon: Droplet, bg: 'bg-rose-100', text: 'text-rose-700' };
    case 'প্রথম রক্তদান': return { icon: CheckCircle2, bg: 'bg-blue-100', text: 'text-blue-700' };
    case '১০ বার রক্তদান': return { icon: ShieldCheck, bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'সুপার ডোনার': return { icon: BadgeCheck, bg: 'bg-purple-100', text: 'text-purple-700' };
    default: return { icon: Award, bg: 'bg-slate-100', text: 'text-slate-700' };
  }
};
