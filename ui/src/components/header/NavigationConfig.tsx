
import {
  Home,
  Search,
  User,
  CheckCircle,
  BarChart3,
  ClipboardList,
  FileText,
  MessageSquare,
  HeartHandshake,
  Award,
  UserCog
} from 'lucide-react';

// Base navigation items
export const commonNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Find Cases', href: '/cases', icon: Search },
];

// Role-specific navigation items
export const roleSpecificNavItems = {
  patient: [
    { name: 'My Cases', href: '/patient/cases', icon: ClipboardList },
    { name: 'Submit Case', href: '/patient/submit', icon: FileText },
    { name: 'Updates', href: '/patient/updates', icon: MessageSquare },
  ],
  donor: [
    { name: 'My Donations', href: '/donor/donations', icon: HeartHandshake },
    { name: 'Impact', href: '/donor/impact', icon: BarChart3 },
    { name: 'Favorites', href: '/donor/favorites', icon: Award }
  ],
  verifier: [
    { name: 'Verification Queue', href: '/verifier/queue', icon: CheckCircle },
    { name: 'Completed Reviews', href: '/verifier/completed', icon: FileText },
  ],
  admin: [
    { name: 'User Management', href: '/admin/users', icon: UserCog },
    { name: 'Verification Management', href: '/admin/verifications', icon: CheckCircle },
    { name: 'System Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]
};

// Nav groups for "For Patients", "For Verifiers" sections
export const generalNavGroups = [
  { name: 'For Patients', href: '/patients', icon: User },
  { name: 'For Verifiers', href: '/verifiers', icon: CheckCircle },
  { name: 'Impact', href: '/impact', icon: BarChart3 },
];

export type UserRole = 'patient' | 'donor' | 'verifier' | 'admin' | null;

export const getRoleLabel = (userRole: UserRole): string | null => {
  if (!userRole) return null;
  return {
    patient: 'Patient',
    donor: 'Donor',
    verifier: 'Medical Verifier',
    admin: 'Administrator'
  }[userRole];
};
