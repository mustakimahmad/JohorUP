'use client'

import { useState, useEffect } from 'react'

interface PendingUser {
  id: number
  email: string
  name: string
  created_at: string
}

interface ApprovedUser {
  id: number
  email: string
  name: string
  role: string
  school_name?: string
  ppd_name?: string
  created_at: string
}

export default function UserManagementPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [ppds, setPpds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setPendingUsers([
        {
          id: 1,
          email: 'teacher.newschool@moe-dl.edu.my',
          name: 'Cikgu Ahmad',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          email: 'admin.unknown@gmail.com',
          name: 'Unknown User',
          created_at: '2024-01-14T15:45:00Z'
        }
      ])

      setApprovedUsers([
        {
          id: 3,
          email: 'gurubesar.smktjj@moe-dl.edu.my',
          name: 'Guru Besar SMK TJJ',
          role: 'school',
          school_name: 'SMK Taman Johor Jaya',
          created_at: '2024-01-10T09:00:00Z'
        },
        {
          id: 4,
          email: 'ppd.jb@moe.gov.my',
          name: 'Pegawai PPD JB',
          role: 'ppd',
          ppd_name: 'PPD Johor Bahru',
          created_at: '2024-01-08T14:20:00Z'
        }
      ])

      setSchools([
        { id: 1, name: 'SMK Taman Johor Jaya' },
        { id: 2, name: 'SMK Bandar Baru UDA' },
        { id: 3, name: 'SMK Taman Universiti' }
      ])

      setPpds([
        { id: 1, name: 'PPD Johor Bahru' },
        { id: 2, name: 'PPD Muar' },
        { id: 3, name: 'PPD Batu Pahat' }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const handleApproveUser = async (userId: number, role: string, schoolId?: number, ppdId?: number) => {
    try {
      const user = pendingUsers.find(u => u.id === userId)
      if (!user) return

      // In real implementation, call the API
      // await approveUser(user.email, { role, school_id: schoolId, ppd_id: ppdId })

      // Update local state for demo
      setPendingUsers(prev => prev.filter(u => u.id !== userId))
      
      const schoolName = schoolId ? schools.find(s => s.id === schoolId)?.name : undefined
      const ppdName = ppdId ? ppds.find(p => p.id === ppdId)?.name : undefined

      setApprovedUsers(prev => [...prev, {
        ...user,
        role,
        school_name: schoolName,
        ppd_name: ppdName
      }])

      alert(`User ${user.email} telah diluluskan dengan peranan ${role}`)
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Gagal meluluskan pengguna')
    }
  }

  const handleRejectUser = (userId: number) => {
    const user = pendingUsers.find(u => u.id === userId)
    if (user && confirm(`Adakah anda pasti untuk menolak ${user.email}?`)) {
      setPendingUsers(prev => prev.filter(u => u.id !== userId))
      alert(`User ${user.email} telah ditolak`)
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengurusan Pengguna</h1>
        <p className="text-gray-600 mt-2">Urus kelulusan dan peranan pengguna sistem</p>
      </div>

      {/* Pending Approvals */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Permohonan Menunggu Kelulusan ({pendingUsers.length})
            </h2>
          </div>
          
          <div className="p-6">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tiada permohonan menunggu kelulusan
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map(user => (
                  <PendingUserCard
                    key={user.id}
                    user={user}
                    schools={schools}
                    ppds={ppds}
                    onApprove={handleApproveUser}
                    onReject={handleRejectUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Approved Users */}
      <section>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Pengguna Diluluskan ({approvedUsers.length})
            </h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peranan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organisasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarikh Diluluskan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.school_name || user.ppd_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('ms-MY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
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
                       domain === 'moe.gov.my' ? 'ppd' : 
                       domain === 'jcorp.com.my' ? 'yayasan_jcorp' : ''

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
                <option value="school">Sekolah</option>
                <option value="ppd">PPD</option>
                <option value="sektor_pembelajaran">Sektor Pembelajaran</option>
                <option value="sektor_perancangan">Sektor Perancangan</option>
                <option value="yayasan_jcorp">Yayasan JCorp</option>
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