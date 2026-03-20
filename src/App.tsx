import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

// Layouts
import MobileLayout from '@/components/layout/MobileLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Mobile Pages
import Login from '@/pages/Login';
import Home from '@/pages/mobile/Home';
import Search from '@/pages/mobile/Search';
import RequestBlood from '@/pages/mobile/RequestBlood';
import Requests from '@/pages/mobile/Requests';
import Profile from '@/pages/mobile/Profile';
import Notifications from '@/pages/mobile/Notifications';
import Leaderboard from '@/pages/mobile/Leaderboard';
import DonationHistory from '@/pages/mobile/DonationHistory';
import { Chat } from '@/pages/mobile/Chat';
import { DonationGuide } from '@/pages/mobile/DonationGuide';
import VolunteerForm from '@/pages/mobile/VolunteerForm';
import FundDonation from '@/pages/mobile/FundDonation';
import Committee from '@/pages/mobile/Committee';
import AboutUs from '@/pages/mobile/AboutUs';
import PublicProfile from '@/pages/mobile/PublicProfile';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminRequests from '@/pages/admin/AdminRequests';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminVolunteers from '@/pages/admin/AdminVolunteers';
import AdminDonations from '@/pages/admin/AdminDonations';
import AdminCampaign from '@/pages/admin/AdminCampaign';

export default function App() {
  const { currentUser, theme } = useAppStore();

  return (
    <div className={theme === 'dark' ? 'dark bg-slate-900 min-h-screen text-slate-100' : 'bg-slate-50 min-h-screen text-slate-900'}>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Mobile App Routes */}
        <Route path="/" element={
          currentUser ? (
            (currentUser.role === 'admin' || currentUser.role === 'moderator') ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        <Route path="/notifications" element={
          currentUser ? <Notifications /> : <Navigate to="/login" replace />
        } />
        
        <Route element={<MobileLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/request" element={<RequestBlood />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/donations" element={<DonationHistory />} />
          <Route path="/chat/:requestId" element={<Chat />} />
          <Route path="/guide" element={<DonationGuide />} />
          <Route path="/volunteer" element={<VolunteerForm />} />
          <Route path="/donate-fund" element={<FundDonation />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:id" element={<PublicProfile />} />
        </Route>

        {/* Admin Panel Routes */}
        <Route path="/admin" element={
          (currentUser?.role === 'admin' || currentUser?.role === 'moderator') ? <AdminLayout /> : <Navigate to="/login" replace />
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="campaign" element={<AdminCampaign />} />
          <Route path="analytics" element={currentUser?.role === 'admin' ? <AdminAnalytics /> : <Navigate to="/admin/dashboard" replace />} />
          <Route path="settings" element={currentUser?.role === 'admin' ? <AdminSettings /> : <Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}
