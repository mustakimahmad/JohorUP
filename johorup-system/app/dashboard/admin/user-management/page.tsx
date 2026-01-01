'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  level: string
  sector: string
  ppd_name?: string
  ppd_code?: string
  school_name?: string
  school_code?: string
  subject?: string
  specialization?: string
  status: string
  created_at: string
  updated_at?: string
}

interface HierarchyOptions {
  ppd: Array<{
    id: string
    code: string
    name: string
    district: string
  }>
  schools: Array<{
    id: string
    code: string
    name: string
    ppd_id: string
    ppd_name: string
  }>
  roles: Array<{
    value: string
    label: string
    level: string
  }>
  subjects: string[]
}

// Helper functions
const getRoleBadgeColor = (role: string) => {
  const colors: { [key: string]: string } = {
    'super_admin_s4pd': 'bg-purple-100 text-purple-800',
    'admin_spb': 'bg-blue-100 text-blue-800',
    'admin_spm': 'bg-indigo-100 text-indigo-800',
    'strategic_jcorp': 'bg-green-100 text-green-800',
    'strategic_hasanah': 'bg-teal-100 text-teal-800',
    'tactical_ppd': 'bg-yellow-100 text-yellow-800',
    'coaching_sisc': 'bg-orange-100 text-orange-800',
    'operational_school': 'bg-pink-100 text-pink-800',
    'operational_teacher': 'bg-gray-100 text-gray-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

const getRoleDisplayName = (role: string) => {
  const names: { [key: string]: string } = {
    'super_admin_s4pd': 'Super Admin S4PD',
    'admin_spb': 'Admin SPB',
    'admin_spm': 'Admin SPM',
    'strategic_jcorp': 'Strategic JCorp',
    'strategic_hasanah': 'Strategic Hasanah',
    'tactical_ppd': 'Tactical PPD',
    'coaching_sisc': 'SISC+',
    'operational_school': 'Sekolah',
    'operational_teacher': 'Guru'
  }
  return names[role] || role
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [hierarchyOptions, setHierarchyOptions] = useState<HierarchyOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showHierarchyModal, setShowHierarchyModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(20)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'loading' } | null>(null)

  // Get current admin info from session
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    // Get admin info from session storage
    const userSession = sessionStorage.getItem('currentUser')
    if (userSession) {
      const user = JSON.parse(userSession)
      if (['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(user.role)) {
        setCurrentAdmin({ email: user.email, role: user.role })
        loadHierarchyOptions(user.email, user.role)
        loadUsers(user.email, user.role)
      } else {
        showMessage('Akses ditolak. Hanya admin yang boleh mengurus pengguna.', 'error')
      }
    } else {
      showMessage('Sila log masuk sebagai admin.', 'error')
    }
  }, [])

  const showMessage = (text: string, type: 'success' | 'error' | 'loading') => {
    setMessage({ text, type })
    if (type === 'success') {
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const loadHierarchyOptions = async (adminEmail: string, adminRole: string) => {
    try {
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_hierarchy_options',
          adminEmail,
          adminRole
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        setHierarchyOptions(data)
      } else {
        showMessage('Gagal memuat pilihan hierarki: ' + data.error, 'error')
      }
    } catch (error) {
      showMessage('Gagal memuat pilihan hierarki: ' + (error as Error).message, 'error')
    }
  }

  const loadUsers = async (adminEmail: string, adminRole: string) => {
    try {
      showMessage('Memuat pengguna...', 'loading')
      
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list_all_users',
          adminEmail,
          adminRole
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        setUsers(data.users)
        setFilteredUsers(data.users)
        showMessage(`Berjaya memuat ${data.total} pengguna`, 'success')
      } else {
        showMessage('Gagal memuat pengguna: ' + data.error, 'error')
      }
    } catch (error) {
      showMessage('Gagal memuat pengguna: ' + (error as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Filter and search functionality
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterLevel) {
      filtered = filtered.filter(user => user.level === filterLevel)
    }

    if (filterRole) {
      filtered = filtered.filter(user => user.role === filterRole)
    }

    if (filterStatus) {
      filtered = filtered.filter(user => 
        filterStatus === 'active' ? user.status === 'active' : user.status !== 'active'
      )
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, filterLevel, filterRole, filterStatus, users])

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // User management functions
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditUserModal(true)
  }

  const handleAssignHierarchy = (user: User) => {
    setSelectedUser(user)
    setShowHierarchyModal(true)
  }

  const handleDeleteUser = async (user: User) => {
    if (!currentAdmin) return
    
    if (confirm(`Padam pengguna ${user.name}? Tindakan ini tidak boleh dibatalkan.`)) {
      try {
        showMessage('Memadam pengguna...', 'loading')
        
        const response = await fetch('/api/admin-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete_user',
            adminEmail: currentAdmin.email,
            adminRole: currentAdmin.role,
            userIdToDelete: user.id
          })
        })

        const data = await response.json()
        if (data.status === 'success') {
          showMessage('Pengguna berjaya dipadam', 'success')
          loadUsers(currentAdmin.email, currentAdmin.role)
        } else {
          showMessage('Gagal memadam pengguna: ' + data.error, 'error')
        }
      } catch (error) {
        showMessage('Gagal memadam pengguna: ' + (error as Error).message, 'error')
      }
    }
  }

  // Calculate statistics
  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status !== 'active').length,
    byLevel: users.reduce((acc, user) => {
      acc[user.level] = (acc[user.level] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Akses Ditolak</div>
          <p className="text-gray-600">Hanya admin yang boleh mengakses halaman ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengurusan Pengguna Hierarki</h1>
        <p className="text-gray-600 mt-2">Urus {userStats.total} pengguna dengan sistem hierarki organisasi</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jumlah Pengguna</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v2c0 .656.126 1.283.356 1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pengguna Aktif</p>
              <p className="text-3xl font-bold text-green-600">{userStats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tidak Aktif</p>
              <p className="text-3xl font-bold text-red-600">{userStats.inactive}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Level Pengguna</p>
              <p className="text-3xl font-bold text-purple-600">{Object.keys(userStats.byLevel).length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* User Level Distribution */}
      {Object.keys(userStats.byLevel).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taburan Mengikut Level Pengguna</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(userStats.byLevel).map(([level, count]) => (
              <div key={level} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{level}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama atau emel pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Level</option>
              {hierarchyOptions?.roles.map(role => (
                <option key={role.level} value={role.level}>{role.level}</option>
              ))}
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Peranan</option>
              {hierarchyOptions?.roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Pengguna
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Senarai Pengguna ({filteredUsers.length})
            </h2>
            <div className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peranan & Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hierarki Organisasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{user.level}</div>
                      {user.subject && (
                        <div className="text-xs text-blue-600 mt-1">📚 {user.subject}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {user.ppd_name && (
                        <div className="text-sm font-medium">🏛️ {user.ppd_name}</div>
                      )}
                      {user.school_name && (
                        <div className="text-sm">🏫 {user.school_name}</div>
                      )}
                      {user.specialization && (
                        <div className="text-xs text-gray-500 mt-1">🎯 {user.specialization}</div>
                      )}
                      {!user.ppd_name && !user.school_name && (
                        <div className="text-sm text-gray-500">{user.sector}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit pengguna"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleAssignHierarchy(user)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Tetapkan hierarki"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Padam pengguna"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Menunjukkan {indexOfFirstUser + 1} hingga {Math.min(indexOfLastUser, filteredUsers.length)} dari {filteredUsers.length} pengguna
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelum
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (pageNum > totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Seterusnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditUserModal && selectedUser && hierarchyOptions && (
        <EditUserModal
          user={selectedUser}
          hierarchyOptions={hierarchyOptions}
          currentAdmin={currentAdmin}
          onClose={() => {
            setShowEditUserModal(false)
            setSelectedUser(null)
          }}
          onSave={() => {
            setShowEditUserModal(false)
            setSelectedUser(null)
            if (currentAdmin) {
              loadUsers(currentAdmin.email, currentAdmin.role)
            }
          }}
          onMessage={showMessage}
        />
      )}

      {showAddUserModal && hierarchyOptions && (
        <AddUserModal
          hierarchyOptions={hierarchyOptions}
          currentAdmin={currentAdmin}
          onClose={() => setShowAddUserModal(false)}
          onSave={() => {
            setShowAddUserModal(false)
            if (currentAdmin) {
              loadUsers(currentAdmin.email, currentAdmin.role)
            }
          }}
          onMessage={showMessage}
        />
      )}

      {showHierarchyModal && selectedUser && hierarchyOptions && (
        <HierarchyAssignmentModal
          user={selectedUser}
          hierarchyOptions={hierarchyOptions}
          currentAdmin={currentAdmin}
          onClose={() => {
            setShowHierarchyModal(false)
            setSelectedUser(null)
          }}
          onSave={() => {
            setShowHierarchyModal(false)
            setSelectedUser(null)
            if (currentAdmin) {
              loadUsers(currentAdmin.email, currentAdmin.role)
            }
          }}
          onMessage={showMessage}
        />
      )}
    </div>
  )
}

// Edit User Modal Component
function EditUserModal({ 
  user, 
  hierarchyOptions,
  currentAdmin,
  onClose, 
  onSave,
  onMessage
}: {
  user: User
  hierarchyOptions: HierarchyOptions
  currentAdmin: { email: string; role: string } | null
  onClose: () => void
  onSave: () => void
  onMessage: (text: string, type: 'success' | 'error' | 'loading') => void
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    level: user.level,
    sector: user.sector,
    status: user.status,
    subject: user.subject || '',
    specialization: user.specialization || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAdmin) return

    try {
      onMessage('Mengemaskini pengguna...', 'loading')
      
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_user',
          adminEmail: currentAdmin.email,
          adminRole: currentAdmin.role,
          userId: user.id,
          updateData: formData
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        onMessage('Pengguna berjaya dikemaskini', 'success')
        onSave()
      } else {
        onMessage('Gagal mengemaskini pengguna: ' + data.error, 'error')
      }
    } catch (error) {
      onMessage('Gagal mengemaskini pengguna: ' + (error as Error).message, 'error')
    }
  }

  const updateRoleFields = (role: string) => {
    const roleData = hierarchyOptions.roles.find(r => r.value === role)
    if (roleData) {
      const sectorMapping: { [key: string]: string } = {
        'super_admin_s4pd': 'S4PD',
        'admin_spb': 'SPB',
        'admin_spm': 'SPM',
        'strategic_jcorp': 'JCORP',
        'strategic_hasanah': 'HASANAH',
        'tactical_ppd': 'PPD',
        'coaching_sisc': 'SISC',
        'operational_school': 'SCHOOL',
        'operational_teacher': 'TEACHER'
      }
      
      setFormData(prev => ({
        ...prev,
        role,
        level: roleData.level,
        sector: sectorMapping[role] || 'GENERAL'
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Pengguna</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emel
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peranan
            </label>
            <select
              value={formData.role}
              onChange={(e) => updateRoleFields(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Peranan</option>
              {hierarchyOptions.roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <input
              type="text"
              value={formData.level}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sektor
            </label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>

          {(formData.role === 'operational_teacher' || formData.role === 'coaching_sisc') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {hierarchyOptions.subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kepakaran
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Matematik Tambahan, Sains Komputer"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add User Modal Component
function AddUserModal({ 
  hierarchyOptions,
  currentAdmin,
  onClose, 
  onSave,
  onMessage
}: {
  hierarchyOptions: HierarchyOptions
  currentAdmin: { email: string; role: string } | null
  onClose: () => void
  onSave: () => void
  onMessage: (text: string, type: 'success' | 'error' | 'loading') => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    level: '',
    sector: '',
    ppd_id: '',
    school_id: '',
    subject: '',
    specialization: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAdmin) return

    try {
      onMessage('Menambah pengguna...', 'loading')
      
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          adminEmail: currentAdmin.email,
          adminRole: currentAdmin.role,
          userData: {
            ...formData,
            ppd_id: formData.ppd_id || null,
            school_id: formData.school_id || null,
            subject: formData.subject || null,
            specialization: formData.specialization || null
          }
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        onMessage('Pengguna berjaya ditambah', 'success')
        onSave()
      } else {
        onMessage('Gagal menambah pengguna: ' + data.error, 'error')
      }
    } catch (error) {
      onMessage('Gagal menambah pengguna: ' + (error as Error).message, 'error')
    }
  }

  const updateRoleFields = (role: string) => {
    const roleData = hierarchyOptions.roles.find(r => r.value === role)
    if (roleData) {
      const sectorMapping: { [key: string]: string } = {
        'super_admin_s4pd': 'S4PD',
        'admin_spb': 'SPB',
        'admin_spm': 'SPM',
        'strategic_jcorp': 'JCORP',
        'strategic_hasanah': 'HASANAH',
        'tactical_ppd': 'PPD',
        'coaching_sisc': 'SISC',
        'operational_school': 'SCHOOL',
        'operational_teacher': 'TEACHER'
      }
      
      setFormData(prev => ({
        ...prev,
        role,
        level: roleData.level,
        sector: sectorMapping[role] || 'GENERAL'
      }))
    }
  }

  const filterSchoolsByPPD = (ppdId: string) => {
    setFormData(prev => ({ ...prev, ppd_id: ppdId, school_id: '' }))
  }

  const filteredSchools = hierarchyOptions.schools.filter(school => 
    formData.ppd_id ? school.ppd_id === formData.ppd_id : true
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tambah Pengguna Baru</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pengguna
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama pengguna"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emel
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="pengguna@domain.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata Laluan Sementara
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Kata laluan sementara"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peranan
              </label>
              <select
                value={formData.role}
                onChange={(e) => updateRoleFields(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Peranan</option>
                {hierarchyOptions.roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <input
                type="text"
                value={formData.level}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sektor
              </label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Hierarchy Assignment Section */}
          {['tactical_ppd', 'coaching_sisc', 'operational_school', 'operational_teacher'].includes(formData.role) && (
            <div className="border-t pt-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Penetapan Hierarki Organisasi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PPD
                  </label>
                  <select
                    value={formData.ppd_id}
                    onChange={(e) => filterSchoolsByPPD(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih PPD</option>
                    {hierarchyOptions.ppd.map(ppd => (
                      <option key={ppd.id} value={ppd.id}>{ppd.name} ({ppd.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sekolah
                  </label>
                  <select
                    value={formData.school_id}
                    onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.ppd_id}
                  >
                    <option value="">Pilih Sekolah</option>
                    {filteredSchools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>

                {(formData.role === 'operational_teacher' || formData.role === 'coaching_sisc') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mata Pelajaran
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Pilih Mata Pelajaran</option>
                        {hierarchyOptions.subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kepakaran
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Matematik Tambahan, Sains Komputer"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Pengguna akan menerima emel dengan kata laluan sementara dan perlu menukar kata laluan pada log masuk pertama.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tambah Pengguna
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Hierarchy Assignment Modal Component
function HierarchyAssignmentModal({ 
  user,
  hierarchyOptions,
  currentAdmin,
  onClose, 
  onSave,
  onMessage
}: {
  user: User
  hierarchyOptions: HierarchyOptions
  currentAdmin: { email: string; role: string } | null
  onClose: () => void
  onSave: () => void
  onMessage: (text: string, type: 'success' | 'error' | 'loading') => void
}) {
  const [formData, setFormData] = useState({
    ppd_id: user.ppd_name ? hierarchyOptions.ppd.find(p => p.name === user.ppd_name)?.id || '' : '',
    school_id: user.school_name ? hierarchyOptions.schools.find(s => s.name === user.school_name)?.id || '' : '',
    subject: user.subject || '',
    specialization: user.specialization || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAdmin) return

    try {
      onMessage('Menetapkan hierarki...', 'loading')
      
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_hierarchy',
          adminEmail: currentAdmin.email,
          adminRole: currentAdmin.role,
          userIdToAssign: user.id,
          hierarchyData: {
            ppd_id: formData.ppd_id || null,
            school_id: formData.school_id || null,
            subject: formData.subject || null,
            specialization: formData.specialization || null
          }
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        onMessage('Hierarki berjaya ditetapkan', 'success')
        onSave()
      } else {
        onMessage('Gagal menetapkan hierarki: ' + data.error, 'error')
      }
    } catch (error) {
      onMessage('Gagal menetapkan hierarki: ' + (error as Error).message, 'error')
    }
  }

  const filterSchoolsByPPD = (ppdId: string) => {
    setFormData(prev => ({ ...prev, ppd_id: ppdId, school_id: '' }))
  }

  const filteredSchools = hierarchyOptions.schools.filter(school => 
    formData.ppd_id ? school.ppd_id === formData.ppd_id : true
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tetapkan Hierarki Organisasi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current User Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Maklumat Pengguna</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nama:</span> {user.name}
            </div>
            <div>
              <span className="font-medium">Emel:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Peranan:</span> {getRoleDisplayName(user.role)}
            </div>
            <div>
              <span className="font-medium">Level:</span> {user.level}
            </div>
          </div>
        </div>

        {/* Current Hierarchy */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Hierarki Semasa</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">PPD:</span> {user.ppd_name || 'Tidak ditetapkan'}
            </div>
            <div>
              <span className="font-medium">Sekolah:</span> {user.school_name || 'Tidak ditetapkan'}
            </div>
            <div>
              <span className="font-medium">Mata Pelajaran:</span> {user.subject || 'Tidak ditetapkan'}
            </div>
            <div>
              <span className="font-medium">Kepakaran:</span> {user.specialization || 'Tidak ditetapkan'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="font-semibold text-gray-900">Hierarki Baharu</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PPD
              </label>
              <select
                value={formData.ppd_id}
                onChange={(e) => filterSchoolsByPPD(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih PPD</option>
                {hierarchyOptions.ppd.map(ppd => (
                  <option key={ppd.id} value={ppd.id}>{ppd.name} ({ppd.district})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sekolah
              </label>
              <select
                value={formData.school_id}
                onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!formData.ppd_id}
              >
                <option value="">Pilih Sekolah</option>
                {filteredSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mata Pelajaran
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Mata Pelajaran</option>
                {hierarchyOptions.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kepakaran
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Matematik Tambahan, Sains Komputer"
              />
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Penetapan hierarki akan menentukan data yang boleh diakses oleh pengguna ini dalam sistem.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Tetapkan Hierarki
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}