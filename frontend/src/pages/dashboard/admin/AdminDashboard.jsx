import { Routes, Route, Navigate } from 'react-router-dom'
import { BarChart2, Calendar, Users, Scale, Upload, Trophy, Award, Bell, Settings } from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import AdminAnalytics from './AdminAnalytics'
import ManageEvents from './ManageEvents'
import AllUsers from './AllUsers'
import Results from './Results'
import ManageJudges from './ManageJudges'
import AllSubmissions from './AllSubmissions'
import AdminCertificates from './AdminCertificates'
import Announcements from './Announcements'
import PlatformSettings from './PlatformSettings'

const SIDEBAR = [
  { icon: BarChart2, label: 'Analytics Overview', to: '/dashboard/admin' },
  { icon: Calendar,  label: 'Manage Events',      to: '/dashboard/admin/events' },
  { icon: Users,     label: 'All Users',           to: '/dashboard/admin/users' },
  { icon: Scale,     label: 'Manage Judges',       to: '/dashboard/admin/judges' },
  { icon: Upload,    label: 'All Submissions',     to: '/dashboard/admin/submissions' },
  { icon: Trophy,    label: 'Results & Winners',   to: '/dashboard/admin/results' },
  { icon: Award,     label: 'Certificates',        to: '/dashboard/admin/certificates' },
  { icon: Bell,      label: 'Announcements',       to: '/dashboard/admin/announcements' },
  { icon: Settings,  label: 'Platform Settings',   to: '/dashboard/admin/settings' },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout sidebar={SIDEBAR}>
      <Routes>
        <Route index element={<AdminAnalytics />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="users" element={<AllUsers />} />
        <Route path="judges" element={<ManageJudges />} />
        <Route path="submissions" element={<AllSubmissions />} />
        <Route path="results" element={<Results />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<PlatformSettings />} />
        <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
