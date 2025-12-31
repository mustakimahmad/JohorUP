'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  name: string
  role: string
  level: string
  sector: string
  school_name?: string
  ppd_name?: string
  yayasan?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

interface PendingUser {
  id: number
  email: string
  name: string
  created_at: string
}

interface UserStats {
  total: number
  active: number
  inactive: number
  byLevel: { [key: string]: number }
  byRole: { [key: string]: number }
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(20)

  // User statistics
  const [userStats, setUserStats] = useState<UserStats>({
    total: 247,
    active: 235,
    inactive: 12,
    byLevel: {
      'Super Admin': 3,
      'Admin': 8,
      'Strategic Viewers': 5,
      'Tactical User': 11,
      'Coaching User': 66,
      'Operational User': 154
    },
    byRole: {
      'super_admin_s4pd': 3,
      'admin_spb': 5,
      'admin_spm': 3,
      'strategic_jcorp': 3,
      'strategic_hasanah': 2,
      'tactical_ppd': 11,
      'coaching_sisc': 66,
      'operational_school': 22,
      'operational_teacher': 132
    }
  })

  // Generate sample users for demonstration
  useEffect(() => {
    generateSampleUsers()
  }, [])

  const generateSampleUsers = () => {
    const sampleUsers: User[] = []
    let userId = 1

    // Super Admin (3 users)
    for (let i = 1; i <= 3; i++) {
      sampleUsers.push({
        id: userId++,
        email: `admin.s4pd${i}@moe.gov.my`,
        name: `Admin S4PD ${i}`,
        role: 'super_admin_s4pd',
        level: 'Super Admin',
        sector: 'S4PD',
        is_active: true,
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Admin SPB (5 users)
    for (let i = 1; i <= 5; i++) {
      sampleUsers.push({
        id: userId++,
        email: `admin.spb${i}@moe.gov.my`,
        name: `Admin SPB ${i}`,
        role: 'admin_spb',
        level: 'Admin',
        sector: 'SPB',
        is_active: i <= 4, // One inactive
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Admin SPM (3 users)
    for (let i = 1; i <= 3; i++) {
      sampleUsers.push({
        id: userId++,
        email: `admin.spm${i}@moe.gov.my`,
        name: `Admin SPM ${i}`,
        role: 'admin_spm',
        level: 'Admin',
        sector: 'SPM',
        is_active: true,
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Strategic JCorp (3 users)
    for (let i = 1; i <= 3; i++) {
      sampleUsers.push({
        id: userId++,
        email: `strategic${i}@jcorp.com.my`,
        name: `Strategic JCorp ${i}`,
        role: 'strategic_jcorp',
        level: 'Strategic Viewers',
        sector: 'JCORP',
        yayasan: 'Yayasan JCorp',
        is_active: true,
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Strategic Hasanah (2 users)
    for (let i = 1; i <= 2; i++) {
      sampleUsers.push({
        id: userId++,
        email: `strategic${i}@hasanah.com.my`,
        name: `Strategic Hasanah ${i}`,
        role: 'strategic_hasanah',
        level: 'Strategic Viewers',
        sector: 'HASANAH',
        yayasan: 'Yayasan Hasanah',
        is_active: true,
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // PPD Users (11 users)
    const ppdNames = ['Johor Bahru', 'Batu Pahat', 'Muar', 'Kluang', 'Pontian', 'Segamat', 'Kota Tinggi', 'Mersing', 'Kulai', 'Tangkak', 'Ledang']
    for (let i = 1; i <= 11; i++) {
      sampleUsers.push({
        id: userId++,
        email: `ppd${i}@moe.gov.my`,
        name: `PPD ${ppdNames[i-1]} ${i}`,
        role: 'tactical_ppd',
        level: 'Tactical User',
        sector: 'PPD',
        ppd_name: `PPD ${ppdNames[i-1]}`,
        is_active: i <= 10, // One inactive
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // SISC+ Users (66 users - 22 PPD x 3 subjects)
    const subjects = ['Bahasa Melayu', 'Sejarah', 'Matematik']
    for (let ppd = 1; ppd <= 22; ppd++) {
      for (let subj = 0; subj < 3; subj++) {
        sampleUsers.push({
          id: userId++,
          email: `sisc.ppd${ppd}.${subjects[subj].toLowerCase().replace(' ', '')}@moe.gov.my`,
          name: `SISC+ ${subjects[subj]} PPD${ppd}`,
          role: 'coaching_sisc',
          level: 'Coaching User',
          sector: 'SISC',
          ppd_name: `PPD ${ppd}`,
          is_active: Math.random() > 0.05, // 95% active
          last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }

    // School Users (22 users)
    for (let i = 1; i <= 22; i++) {
      sampleUsers.push({
        id: userId++,
        email: `sekolah${i}@moe-dl.edu.my`,
        name: `Pentadbir Sekolah ${i}`,
        role: 'operational_school',
        level: 'Operational User',
        sector: 'SCHOOL',
        school_name: `SMK Johor ${i}`,
        is_active: Math.random() > 0.05, // 95% active
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Teacher Users (132 users - 22 schools x 6 teachers)
    for (let school = 1; school <= 22; school++) {
      for (let teacher = 1; teacher <= 6; teacher++) {
        const subjectIndex = (teacher - 1) % 3
        sampleUsers.push({
          id: userId++,
          email: `guru${school}.${teacher}@moe-dl.edu.my`,
          name: `Guru ${subjects[subjectIndex]} ${school}-${teacher}`,
          role: 'operational_teacher',
          level: 'Operational User',
          sector: 'TEACHER',
          school_name: `SMK Johor ${school}`,
          is_active: Math.random() > 0.03, // 97% active
          last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }

    setUsers(sampleUsers)
    setFilteredUsers(sampleUsers)
    setLoading(false)
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
        filterStatus === 'active' ? user.is_active : !user.is_active
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

  const handleResetPassword = (user: User) => {
    if (confirm(`Reset kata laluan untuk ${user.name}?`)) {
      // In production, call API to reset password
      alert(`Kata laluan untuk ${user.name} telah direset. Kata laluan sementara telah dihantar ke ${user.email}`)
    }
  }

  const handleToggleUserStatus = (user: User) => {
    const action = user.is_active ? 'nyahaktifkan' : 'aktifkan'
    if (confirm(`${action} pengguna ${user.name}?`)) {
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, is_active: !u.is_active, updated_at: new Date().toISOString() } : u
      ))
      alert(`Pengguna ${user.name} telah ${user.is_active ? 'dinyahaktifkan' : 'diaktifkan'}`)
    }
  }

  const handleDeleteUser = (user: User) => {
    if (confirm(`Padam pengguna ${user.name}? Tindakan ini tidak boleh dibatalkan.`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
      alert(`Pengguna ${user.name} telah dipadam`)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengurusan Pengguna</h1>
        <p className="text-gray-600 mt-2">Urus 247 pengguna merentas 9 level dalam sistem JohorUP</p>
      </div>

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
              <p className="text-3xl font-bold text-purple-600">9</p>
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
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Strategic Viewers">Strategic Viewers</option>
              <option value="Tactical User">Tactical User</option>
              <option value="Coaching User">Coaching User</option>
              <option value="Operational User">Operational User</option>
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Peranan</option>
              <option value="super_admin_s4pd">Super Admin S4PD</option>
              <option value="admin_spb">Admin SPB</option>
              <option value="admin_spm">Admin SPM</option>
              <option value="strategic_jcorp">Strategic JCorp</option>
              <option value="strategic_hasanah">Strategic Hasanah</option>
              <option value="tactical_ppd">Tactical PPD</option>
              <option value="coaching_sisc">SISC+</option>
              <option value="operational_school">Sekolah</option>
              <option value="operational_teacher">Guru</option>
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
                  Organisasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Terakhir
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
                        user.is_active ? 'bg-green-500' : 'bg-gray-400'
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
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.school_name || user.ppd_name || user.yayasan || user.sector}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('ms-MY') : 'Belum login'}
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
                        onClick={() => handleResetPassword(user)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Reset kata laluan"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2L4.257 10.257a6 6 0 0111.486-3.486L16 6.5V7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        title={user.is_active ? 'Nyahaktifkan' : 'Aktifkan'}
                      >
                        {user.is_active ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
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

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditUserModal(false)
            setSelectedUser(null)
          }}
          onSave={(updatedUser) => {
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
            setShowEditUserModal(false)
            setSelectedUser(null)
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSave={(newUser) => {
            setUsers(prev => [...prev, { ...newUser, id: Date.now() }])
            setShowAddUserModal(false)
          }}
        />
      )}
    </div>
  )
}

// Edit User Modal Component
function EditUserModal({ 
  user, 
  onClose, 
  onSave 
}: {
  user: User
  onClose: () => void
  onSave: (user: User) => void
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedUser: User = {
      ...user,
      ...formData,
      updated_at: new Date().toISOString()
    }
    
    onSave(updatedUser)
    alert(`Pengguna ${formData.name} telah dikemaskini`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="Super Admin (3 pengguna)">
                <option value="super_admin_s4pd">Super Admin S4PD</option>
              </optgroup>
              <optgroup label="Admin (8 pengguna)">
                <option value="admin_spb">Admin SPB</option>
                <option value="admin_spm">Admin SPM</option>
              </optgroup>
              <optgroup label="Strategic Viewers (5 pengguna)">
                <option value="strategic_jcorp">Strategic JCorp</option>
                <option value="strategic_hasanah">Strategic Hasanah</option>
              </optgroup>
              <optgroup label="Tactical User (11 pengguna)">
                <option value="tactical_ppd">Tactical PPD</option>
              </optgroup>
              <optgroup label="Coaching User (66 pengguna)">
                <option value="coaching_sisc">SISC+</option>
              </optgroup>
              <optgroup label="Operational User (154 pengguna)">
                <option value="operational_school">Sekolah</option>
                <option value="operational_teacher">Guru</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Pengguna Aktif
            </label>
          </div>

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
  onClose, 
  onSave 
}: {
  onClose: () => void
  onSave: (user: Omit<User, 'id'>) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    is_active: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Determine level and sector based on role
    const roleMapping: { [key: string]: { level: string, sector: string } } = {
      'super_admin_s4pd': { level: 'Super Admin', sector: 'S4PD' },
      'admin_spb': { level: 'Admin', sector: 'SPB' },
      'admin_spm': { level: 'Admin', sector: 'SPM' },
      'strategic_jcorp': { level: 'Strategic Viewers', sector: 'JCORP' },
      'strategic_hasanah': { level: 'Strategic Viewers', sector: 'HASANAH' },
      'tactical_ppd': { level: 'Tactical User', sector: 'PPD' },
      'coaching_sisc': { level: 'Coaching User', sector: 'SISC' },
      'operational_school': { level: 'Operational User', sector: 'SCHOOL' },
      'operational_teacher': { level: 'Operational User', sector: 'TEACHER' }
    }

    const roleInfo = roleMapping[formData.role]
    
    const newUser: Omit<User, 'id'> = {
      ...formData,
      level: roleInfo.level,
      sector: roleInfo.sector,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    onSave(newUser)
    alert(`Pengguna ${formData.name} telah ditambah`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
              Peranan
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Peranan</option>
              <optgroup label="Super Admin (3 pengguna)">
                <option value="super_admin_s4pd">Super Admin S4PD</option>
              </optgroup>
              <optgroup label="Admin (8 pengguna)">
                <option value="admin_spb">Admin SPB</option>
                <option value="admin_spm">Admin SPM</option>
              </optgroup>
              <optgroup label="Strategic Viewers (5 pengguna)">
                <option value="strategic_jcorp">Strategic JCorp</option>
                <option value="strategic_hasanah">Strategic Hasanah</option>
              </optgroup>
              <optgroup label="Tactical User (11 pengguna)">
                <option value="tactical_ppd">Tactical PPD</option>
              </optgroup>
              <optgroup label="Coaching User (66 pengguna)">
                <option value="coaching_sisc">SISC+</option>
              </optgroup>
              <optgroup label="Operational User (154 pengguna)">
                <option value="operational_school">Sekolah</option>
                <option value="operational_teacher">Guru</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="new_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="new_is_active" className="ml-2 text-sm text-gray-700">
              Aktifkan pengguna selepas ditambah
            </label>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Kata laluan sementara akan dihantar ke emel pengguna selepas akaun dibuat.
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

function PendingUserCard({ 
  user, 
  schools, 
  ppds, 
  onApprove, 
  onReject 
}: {
  user: PendingUser
  schools: any[]
  ppds: any[]
  onApprove: (userId: number, role: string, schoolId?: number, ppdId?: number) => void
  onReject: (userId: number) => void
}) {
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedPPD, setSelectedPPD] = useState('')

  const handleApprove = () => {
    if (!selectedRole) {
      alert('Sila pilih peranan')
      return
    }

    if (selectedRole === 'school' && !selectedSchool) {
      alert('Sila pilih sekolah')
      return
    }

    if (selectedRole === 'ppd' && !selectedPPD) {
      alert('Sila pilih PPD')
      return
    }

    onApprove(
      user.id, 
      selectedRole, 
      selectedRole === 'school' ? parseInt(selectedSchool) : undefined,
      selectedRole === 'ppd' ? parseInt(selectedPPD) : undefined
    )
  }

  // Determine suggested role based on email domain
  const domain = user.email.split('@')[1]
  const suggestedRole = domain === 'moe-dl.edu.my' ? 'school' : 
                       domain === 'moe.gov.my' ? 'ppd' : ''

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                Dimohon pada: {new Date(user.created_at).toLocaleString('ms-MY')}
              </p>
            </div>
          </div>

          {suggestedRole && (
            <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
              💡 Cadangan: {suggestedRole} (berdasarkan domain email)
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peranan
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Peranan</option>
                <optgroup label="Super Admin (3 pengguna)">
                  <option value="super_admin_s4pd">Super Admin S4PD - Sektor Perancangan dan Pengurusan PPD</option>
                </optgroup>
                <optgroup label="Admin (8 pengguna)">
                  <option value="admin_spb">Admin SPB - Sektor Pembelajaran</option>
                  <option value="admin_spm">Admin SPM - Sektor Pembangunan Murid</option>
                </optgroup>
                <optgroup label="Strategic Viewers (5 pengguna)">
                  <option value="strategic_jcorp">Strategic Viewer - Yayasan JCorp</option>
                  <option value="strategic_hasanah">Strategic Viewer - Yayasan Hasanah</option>
                </optgroup>
                <optgroup label="Tactical User (11 pengguna)">
                  <option value="tactical_ppd">Tactical User - Pejabat Pendidikan Daerah</option>
                </optgroup>
                <optgroup label="Coaching User (66 pengguna)">
                  <option value="coaching_sisc">Coaching User - School Improvement Specialist Coach Plus (SISC+)</option>
                </optgroup>
                <optgroup label="Operational User (154 pengguna)">
                  <option value="operational_school">Operational User - Sekolah</option>
                  <option value="operational_teacher">Operational User - Guru</option>
                </optgroup>
              </select>
            </div>

            {selectedRole === 'school' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sekolah
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Sekolah</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'ppd' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PPD
                </label>
                <select
                  value={selectedPPD}
                  onChange={(e) => setSelectedPPD(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih PPD</option>
                  {ppds.map(ppd => (
                    <option key={ppd.id} value={ppd.id}>{ppd.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Luluskan
            </button>
            <button
              onClick={() => onReject(user.id)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Tolak
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}