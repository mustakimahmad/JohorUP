'use client'

import { useState, useEffect } from 'react'

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: string
  activeUsers: number
  totalUsers: number
  databaseStatus: 'connected' | 'slow' | 'disconnected'
  lastBackup: string
  errorRate: number
}

interface QuickStats {
  totalSchools: number
  totalStudents: number
  totalTeachers: number
  totalReports: number
  totalUsers: number
  pendingApprovals: number
  systemAlerts: number
}

export default function SuperAdminDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: '99.9%',
    activeUsers: 45,
    totalUsers: 127,
    databaseStatus: 'connected',
    lastBackup: '2 hours ago',
    errorRate: 0.1
  })

  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalSchools: 20,
    totalStudents: 880,
    totalTeachers: 120,
    totalReports: 156,
    totalUsers: 127,
    pendingApprovals: 3,
    systemAlerts: 1
  })

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'user_login', message: 'New user login: ppd.jb@moe.gov.my', time: '5 minutes ago', severity: 'info' },
    { id: 2, type: 'system_alert', message: 'Database query slow response detected', time: '15 minutes ago', severity: 'warning' },
    { id: 3, type: 'user_approval', message: 'User approval pending: teacher.new@moe-dl.edu.my', time: '1 hour ago', severity: 'info' },
    { id: 4, type: 'backup', message: 'Automated backup completed successfully', time: '2 hours ago', severity: 'success' }
  ])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          👑 Super Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Complete system oversight and control</p>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SystemHealthCard systemHealth={systemHealth} />
        <QuickStatsCard quickStats={quickStats} />
        <QuickActionsCard />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentActivitiesCard activities={recentActivities} />
        <SystemAlertsCard />
      </div>

      {/* Management Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ManagementCard
          title="User Management"
          description="Manage all system users"
          icon="👥"
          href="/dashboard/super-admin/users"
          stats={`${quickStats.totalUsers} users, ${quickStats.pendingApprovals} pending`}
        />
        <ManagementCard
          title="System Configuration"
          description="Configure system settings"
          icon="⚙️"
          href="/dashboard/super-admin/config"
          stats="12 modules configured"
        />
        <ManagementCard
          title="Database Admin"
          description="Database management"
          icon="🗄️"
          href="/dashboard/super-admin/database"
          stats={`Status: ${systemHealth.databaseStatus}`}
        />
        <ManagementCard
          title="Security Center"
          description="Security monitoring"
          icon="🔒"
          href="/dashboard/super-admin/security"
          stats={`${systemHealth.errorRate}% error rate`}
        />
      </div>
    </div>
  )
}

function SystemHealthCard({ systemHealth }: { systemHealth: SystemHealth }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemHealth.status)}`}>
          {systemHealth.status.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Uptime</span>
          <span className="font-medium">{systemHealth.uptime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active Users</span>
          <span className="font-medium">{systemHealth.activeUsers}/{systemHealth.totalUsers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Database</span>
          <span className={`font-medium ${systemHealth.databaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
            {systemHealth.databaseStatus}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Backup</span>
          <span className="font-medium">{systemHealth.lastBackup}</span>
        </div>
      </div>
    </div>
  )
}

function QuickStatsCard({ quickStats }: { quickStats: QuickStats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{quickStats.totalSchools}</div>
          <div className="text-sm text-gray-600">Schools</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{quickStats.totalStudents}</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{quickStats.totalTeachers}</div>
          <div className="text-sm text-gray-600">Teachers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{quickStats.totalReports}</div>
          <div className="text-sm text-gray-600">Reports</div>
        </div>
      </div>
    </div>
  )
}

function QuickActionsCard() {
  const quickActions = [
    { title: 'System Maintenance', icon: '🔧', action: () => alert('Maintenance mode activated') },
    { title: 'Broadcast Message', icon: '📢', action: () => alert('Broadcast message sent') },
    { title: 'Emergency Backup', icon: '💾', action: () => alert('Emergency backup started') },
    { title: 'Security Lockdown', icon: '🚨', action: () => alert('Security lockdown activated') }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="space-y-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RecentActivitiesCard({ activities }: { activities: any[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(activity.severity)}`}></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View All Activities →
      </button>
    </div>
  )
}

function SystemAlertsCard() {
  const alerts = [
    { id: 1, type: 'warning', message: 'Database query performance degraded', time: '15 min ago' },
    { id: 2, type: 'info', message: 'Scheduled maintenance in 2 hours', time: '1 hour ago' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="text-yellow-600">⚠️</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{alert.message}</p>
              <p className="text-xs text-gray-500">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View All Alerts →
      </button>
    </div>
  )
}

function ManagementCard({ title, description, icon, href, stats }: {
  title: string
  description: string
  icon: string
  href: string
  stats: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <p className="text-xs text-gray-500 mb-4">{stats}</p>
      
      <button
        onClick={() => window.location.href = href}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Manage
      </button>
    </div>
  )
}