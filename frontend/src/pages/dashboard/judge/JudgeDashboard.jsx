import { Routes, Route, Navigate } from 'react-router-dom'
import { ClipboardList, CheckSquare, BarChart2, Users, FileText, Settings } from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import ReviewQueue from './ReviewQueue'
import JudgeAnalytics from './JudgeAnalytics'

const SIDEBAR = [
  { icon: ClipboardList, label: 'Review Queue',      to: '/dashboard/judge' },
  { icon: CheckSquare,   label: 'Completed Reviews', to: '/dashboard/judge/completed' },
  { icon: BarChart2,     label: 'Scoring Analytics', to: '/dashboard/judge/analytics' },
  { icon: Users,         label: 'All Participants',  to: '/dashboard/judge/participants' },
  { icon: FileText,      label: 'My Criteria',       to: '/dashboard/judge/criteria' },
  { icon: Settings,      label: 'Settings',          to: '/dashboard/judge/settings' },
]

export default function JudgeDashboard() {
  return (
    <DashboardLayout sidebar={SIDEBAR}>
      <Routes>
        <Route index element={<ReviewQueue />} />
        <Route path="analytics" element={<JudgeAnalytics />} />
        <Route path="*" element={<Navigate to="/dashboard/judge" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
