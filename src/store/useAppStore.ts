import { create } from 'zustand';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  location: string;
  avatar: string;
  lastDonationDate: string | null;
  isDonor: boolean;
  isAvailable: boolean;
  hidePhone: boolean;
  donationsCount: number;
  role: 'user' | 'admin';
  badges: string[];
  isVerified?: boolean;
  bio?: string;
  idCardStatus?: 'none' | 'pending' | 'approved' | 'rejected';
};

export type BloodRequest = {
  id: string;
  requesterId: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string;
  location: string;
  dateTime: string;
  contactNumber: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  acceptedById: string | null;
  createdAt: string;
  isEmergency: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type DonationRecord = {
  id: string;
  donorId: string;
  requestId: string;
  date: string;
  bloodGroup: string;
  location: string;
  patientName: string;
  status: 'verified' | 'pending';
};

export type ChatMessage = {
  id: string;
  requestId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type VolunteerApplication = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export type FundDonation = {
  id: string;
  userId: string | null;
  name: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  date: string;
  status: 'pending' | 'verified';
};

interface AppState {
  currentUser: User | null;
  users: User[];
  requests: BloodRequest[];
  notifications: Notification[];
  donations: DonationRecord[];
  messages: ChatMessage[];
  volunteerApplications: VolunteerApplication[];
  fundDonations: FundDonation[];
  theme: 'light' | 'dark';
  login: (user: User) => void;
  register: (user: Omit<User, 'id' | 'donationsCount' | 'role' | 'badges' | 'lastDonationDate' | 'isVerified'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addRequest: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'acceptedById'>) => void;
  cancelRequest: (requestId: string) => void;
  acceptRequest: (requestId: string, donorId: string) => void;
  completeRequest: (requestId: string) => void;
  toggleDonorStatus: () => void;
  toggleAvailability: () => void;
  togglePhonePrivacy: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  broadcastNotification: (title: string, message: string) => void;
  sendNotification: (userId: string, title: string, message: string) => void;
  updateRequestStatus: (id: string, status: BloodRequest['status']) => void;
  sendMessage: (requestId: string, text: string) => void;
  applyAsVolunteer: (application: Omit<VolunteerApplication, 'id' | 'status' | 'createdAt'>) => void;
  donateToFund: (donation: Omit<FundDonation, 'id' | 'date' | 'status'>) => void;
  updateVolunteerStatus: (id: string, status: VolunteerApplication['status']) => void;
  verifyFundDonation: (id: string) => void;
  toggleTheme: () => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'জনি আহমেদ',
    email: 'john@example.com',
    phone: '০১৭০০০০০০০০',
    bloodGroup: 'O+',
    location: 'ঢাকা, বাংলাদেশ',
    avatar: 'https://i.pravatar.cc/150?u=1',
    lastDonationDate: '2023-10-15',
    isDonor: true,
    isAvailable: true,
    hidePhone: false,
    donationsCount: 5,
    role: 'user',
    badges: ['রক্তদাতা হিরো', '৫ বার রক্তদান'],
  },
  {
    id: '2',
    name: 'জান্নাতুল ফেরদৌস',
    email: 'jane@example.com',
    phone: '০১৮০০০০০০০০',
    bloodGroup: 'A-',
    location: 'চট্টগ্রাম, বাংলাদেশ',
    avatar: 'https://i.pravatar.cc/150?u=2',
    lastDonationDate: null,
    isDonor: false,
    isAvailable: false,
    hidePhone: true,
    donationsCount: 0,
    role: 'user',
    badges: [],
  },
  {
    id: 'admin',
    name: 'অ্যাডমিন ইউজার',
    email: 'admin@khansama.com',
    phone: '০১৯০০০০০০০০',
    bloodGroup: 'AB+',
    location: 'হেডকোয়ার্টার',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    lastDonationDate: null,
    isDonor: false,
    isAvailable: false,
    hidePhone: false,
    donationsCount: 0,
    role: 'admin',
    badges: [],
  }
];

const mockRequests: BloodRequest[] = [
  {
    id: 'req1',
    requesterId: '2',
    patientName: 'রবার্ট স্মিথ',
    bloodGroup: 'O+',
    hospitalName: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    location: 'ঢাকা, বাংলাদেশ',
    dateTime: '2024-03-20T10:00:00Z',
    contactNumber: '০১৮০০০০০০০০',
    status: 'pending',
    acceptedById: null,
    createdAt: '2024-03-18T08:00:00Z',
    isEmergency: true,
  },
  {
    id: 'req2',
    requesterId: '1',
    patientName: 'আলিফ আহমেদ',
    bloodGroup: 'B+',
    hospitalName: 'চট্টগ্রাম জেনারেল হাসপাতাল',
    location: 'চট্টগ্রাম, বাংলাদেশ',
    dateTime: '2024-03-22T14:30:00Z',
    contactNumber: '০১৭০০০০০০০০',
    status: 'accepted',
    acceptedById: '2',
    createdAt: '2024-03-17T09:00:00Z',
    isEmergency: false,
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    title: 'জরুরী রক্তের প্রয়োজন',
    message: 'ঢাকা মেডিকেল কলেজ হাসপাতালে একজন রোগীর জন্য O+ রক্ত প্রয়োজন।',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n2',
    userId: '1',
    title: 'অনুরোধ গ্রহণ করা হয়েছে',
    message: 'জান্নাতুল ফেরদৌস আপনার রক্তের অনুরোধ গ্রহণ করেছেন।',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

import { persist } from 'zustand/middleware';

// ... (keep the types)

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: mockUsers,
      requests: mockRequests,
      notifications: mockNotifications,
      donations: [],
      messages: [],
      volunteerApplications: [],
      fundDonations: [],
      theme: 'light',
      login: (user) => set({ currentUser: user }),
      register: (userData) => set((state) => {
        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substring(7),
          donationsCount: 0,
          role: 'user',
          badges: [],
          lastDonationDate: null,
          isVerified: false
        };
        return {
          users: [newUser, ...state.users],
          currentUser: newUser
        };
      }),
      logout: () => set({ currentUser: null }),
      updateProfile: (updates) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, ...updates } : u)
      })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...updates } : state.currentUser
      })),
      addRequest: (request) => set((state) => ({
        requests: [
          {
            ...request,
            id: Math.random().toString(36).substring(7),
            status: 'pending',
            acceptedById: null,
            createdAt: new Date().toISOString(),
          },
          ...state.requests,
        ],
      })),
      cancelRequest: (requestId) => set((state) => ({
        requests: state.requests.map((req) =>
          req.id === requestId ? { ...req, status: 'cancelled' } : req
        ),
      })),
      acceptRequest: (requestId, donorId) => set((state) => ({
        requests: state.requests.map((req) =>
          req.id === requestId ? { ...req, status: 'accepted', acceptedById: donorId } : req
        ),
      })),
      completeRequest: (requestId) => set((state) => ({
        requests: state.requests.map((req) =>
          req.id === requestId ? { ...req, status: 'completed' } : req
        ),
        donations: [
          ...state.donations,
          ...(state.requests
            .filter(r => r.id === requestId && r.acceptedById)
            .map(r => ({
              id: Math.random().toString(36).substring(7),
              donorId: r.acceptedById!,
              requestId: r.id,
              date: new Date().toISOString(),
              bloodGroup: r.bloodGroup,
              location: r.hospitalName,
              patientName: r.patientName,
              status: 'pending' as const,
            })))
        ],
        users: state.users.map((user) => {
          const req = state.requests.find(r => r.id === requestId);
          if (req && req.acceptedById === user.id) {
            const newCount = user.donationsCount + 1;
            const newBadges = [...user.badges];
            if (newCount === 1) newBadges.push('প্রথম রক্তদান');
            if (newCount === 5) newBadges.push('৫ বার রক্তদান');
            if (newCount === 10) newBadges.push('রক্তদাতা হিরো');
            
            return { 
              ...user, 
              donationsCount: newCount, 
              lastDonationDate: new Date().toISOString(),
              badges: newBadges
            };
          }
          return user;
        })
      })),
      updateRequestStatus: (id, status) => set((state) => ({
        requests: state.requests.map(r => r.id === id ? { ...r, status } : r)
      })),
      sendMessage: (requestId, text) => set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Math.random().toString(36).substring(7),
            requestId,
            senderId: state.currentUser?.id || '',
            text,
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      applyAsVolunteer: (application) => set((state) => ({
        volunteerApplications: [
          {
            ...application,
            id: Math.random().toString(36).substring(7),
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...state.volunteerApplications
        ]
      })),
      donateToFund: (donation) => set((state) => ({
        fundDonations: [
          {
            ...donation,
            id: Math.random().toString(36).substring(7),
            status: 'pending',
            date: new Date().toISOString(),
          },
          ...state.fundDonations
        ]
      })),
      updateVolunteerStatus: (id, status) => set((state) => ({
        volunteerApplications: state.volunteerApplications.map(a => a.id === id ? { ...a, status } : a)
      })),
      verifyFundDonation: (id) => set((state) => ({
        fundDonations: state.fundDonations.map(d => d.id === id ? { ...d, status: 'verified' } : d)
      })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleDonorStatus: () => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, isDonor: !state.currentUser.isDonor } : null,
        users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, isDonor: !u.isDonor } : u)
      })),
      toggleAvailability: () => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, isAvailable: !state.currentUser.isAvailable } : null,
        users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, isAvailable: !u.isAvailable } : u)
      })),
      togglePhonePrivacy: () => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, hidePhone: !state.currentUser.hidePhone } : null,
        users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, hidePhone: !u.hidePhone } : u)
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substring(7),
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      broadcastNotification: (title, message) => set((state) => ({
        notifications: [
          ...state.users.map(user => ({
            id: Math.random().toString(36).substring(7),
            userId: user.id,
            title,
            message,
            read: false,
            createdAt: new Date().toISOString()
          })),
          ...state.notifications
        ]
      })),
      sendNotification: (userId, title, message) => set((state) => ({
        notifications: [
          {
            id: Math.random().toString(36).substring(7),
            userId,
            title,
            message,
            read: false,
            createdAt: new Date().toISOString()
          },
          ...state.notifications
        ]
      })),
    }),
    {
      name: 'blood-donation-app-storage',
    }
  )
);
