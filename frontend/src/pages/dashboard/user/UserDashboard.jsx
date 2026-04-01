import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Trophy, Users, Upload, BarChart2, Award, User, Settings } from 'lucide-react'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Overview from './Overview'
import Challenges from './Challenges'
import MyTeam from './MyTeam'
import Submissions from './Submissions'
import Progress from './Progress'
import Certificates from './Certificates'

const SIDEBAR = [
  { icon: Home,     label: 'Overview',      to: '/dashboard/user' },
  { icon: Trophy,   label: 'My Challenges', to: '/dashboard/user/challenges' },
  { icon: Users,    label: 'My Team',       to: '/dashboard/user/team' },
  { icon: Upload,   label: 'Submissions',   to: '/dashboard/user/submissions' },
  { icon: BarChart2,label: 'My Progress',   to: '/dashboard/user/progress' },
  { icon: Award,    label: 'Certificates',  to: '/dashboard/user/certificates' },
  { icon: User,     label: 'Profile',       to: '/dashboard/user/profile' },
  { icon: Settings, label: 'Settings',      to: '/dashboard/user/settings' },
]

export default function UserDashboard() {
  return (
    <DashboardLayout sidebar={SIDEBAR}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="team" element={<MyTeam />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="progress" element={<Progress />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="*" element={<Navigate to="/dashboard/user" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
