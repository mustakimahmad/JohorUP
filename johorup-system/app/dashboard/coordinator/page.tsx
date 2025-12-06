'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockPrograms, mockBudget, mockDashboardStats } from '@/lib/mockData';

export default function CoordinatorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState(mockBudget.filter(b => b.status === 'pending_approval'));
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect if not coordinator role
      if (!parsedUser.email.includes('perancangan')) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const totalBudget = 450000;
  const approvedBudget = mockBudget
    .filter(b => b.status === 'approved' || b.status === 'spent')
    .reduce((sum, b) => sum + b.amount, 0);
  const spentBudget = mockBudget
    .filter(b => b.status === 'spent')
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingBudget = mockBudget
    .filter(b => b.status === 'pending_approval')
    .reduce((sum, b) => sum + b.amount, 0);
  const remainingBudget = totalBudget - approvedBudget;

  const handleApprove = (budgetId: number) => {
    setPendingApprovals(prev => prev.filter(b => b.id !== budgetId));
    alert('Program telah diluluskan!');
  };

  const handleReject = (budgetId: number) => {
    setPendingApprovals(prev => prev.filter(b => b.id !== budgetId));
    alert('Program telah ditolak.');
  };

  const handleDisburseGrant = (budget: any) => {
    setSelectedBudget(budget);
    setShowGrantModal(true);
  };

  const confirmDisbursement = () => {
    alert(`Geran RM ${selectedBudget.amount.toLocaleString()} telah diturunkan untuk ${mockPrograms.find(p => p.id === selectedBudget.program_id)?.title}`);
    setShowGrantModal(false);
    setSelectedBudget(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Koordinator</h1>
            <p className="text-sm text-gray-600">Sektor Perancangan & Pengurusan PPD</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Log Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/dashboard/coordinator" className="border-b-2 border-blue-600 px-3 py-4 text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <a href="/dashboard/coordinator/approvals" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Kelulusan Program
            </a>
            <a href="/dashboard/coordinator/grants" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Pengeluaran Geran
            </a>
            <a href="/dashboard" className="px-3 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Laporan Penuh
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Jumlah Peruntukan</p>
            <p className="text-2xl font-bold">RM {totalBudget.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Diluluskan</p>
            <p className="text-2xl font-bold">RM {approvedBudget.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-1">{((approvedBudget/totalBudget)*100).toFixed(1)}%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Dibelanjakan</p>
            <p className="text-2xl font-bold">RM {spentBudget.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-1">{((spentBudget/totalBudget)*100).toFixed(1)}%</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Menunggu Kelulusan</p>
            <p className="text-2xl font-bold">RM {pendingBudget.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-1">{pendingApprovals.length} program</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-lg shadow text-white">
            <p className="text-sm opacity-90 mb-2">Baki</p>
            <p className="text-2xl font-bold">RM {remainingBudget.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-1">{((remainingBudget/totalBudget)*100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {pendingApprovals.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Anda mempunyai <span className="font-semibold">{pendingApprovals.length} program</span> yang menunggu kelulusan dengan jumlah <span className="font-semibold">RM {pendingBudget.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approvals Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Program Menunggu Kelulusan</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {pendingApprovals.length} program
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah (RM)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dikemukakan Oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Tiada program menunggu kelulusan
                    </td>
                  </tr>
                ) : (
                  pendingApprovals.map((budget) => {
                    const program = mockPrograms.find(p => p.id === budget.program_id);
                    return (
                      <tr key={budget.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {program?.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {budget.description}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {budget.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Sektor Pembelajaran
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(budget.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Lulus
                            </button>
                            <button
                              onClick={() => handleReject(budget.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approved Programs - Ready for Disbursement */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Program Diluluskan - Sedia Untuk Pengeluaran Geran</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah (RM)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarikh Lulus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockBudget.filter(b => b.status === 'approved').map((budget) => {
                  const program = mockPrograms.find(p => p.id === budget.program_id);
                  return (
                    <tr key={budget.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {program?.title}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {budget.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Diluluskan
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {budget.approved_date ? new Date(budget.approved_date).toLocaleDateString('ms-MY') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDisburseGrant(budget)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Turunkan Geran
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Grant Disbursement Modal */}
      {showGrantModal && selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pengesahan Pengeluaran Geran</h3>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">Program:</p>
                <p className="font-semibold text-gray-900">
                  {mockPrograms.find(p => p.id === selectedBudget.program_id)?.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jumlah Geran:</p>
                <p className="text-2xl font-bold text-blue-600">RM {selectedBudget.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Penerangan:</p>
                <p className="text-sm text-gray-900">{selectedBudget.description}</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
              <p className="text-xs text-yellow-800">
                Pastikan semua dokumen sokongan telah lengkap sebelum menurunkan geran.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDisbursement}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sahkan Pengeluaran
              </button>
              <button
                onClick={() => setShowGrantModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
