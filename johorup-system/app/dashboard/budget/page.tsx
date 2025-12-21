'use client';

import { mockBudget, mockPrograms, mockSubjects } from '@/lib/mockData';
import NavigationBar from '@/components/NavigationBar';

export default function BudgetPage() {
  const totalBudget = 450000;
  const allocatedBudget = mockBudget.reduce((sum, b) => sum + b.amount, 0);
  const spentBudget = mockBudget.filter(b => b.status === 'spent').reduce((sum, b) => sum + b.amount, 0);
  const remainingBudget = totalBudget - allocatedBudget;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pengurusan Kewangan</h1>
          <p className="text-sm text-gray-600">Peruntukan dan perbelanjaan program JohorUP</p>
        </div>
      </header>

      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Jumlah Peruntukan</p>
            <p className="text-3xl font-bold text-gray-900">RM {totalBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">JCorp & Yayasan Hasanah</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Diperuntukkan</p>
            <p className="text-3xl font-bold text-blue-600">RM {allocatedBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{((allocatedBudget/totalBudget)*100).toFixed(1)}% daripada jumlah</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Dibelanjakan</p>
            <p className="text-3xl font-bold text-green-600">RM {spentBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{((spentBudget/totalBudget)*100).toFixed(1)}% daripada jumlah</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Baki</p>
            <p className="text-3xl font-bold text-purple-600">RM {remainingBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{((remainingBudget/totalBudget)*100).toFixed(1)}% daripada jumlah</p>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Penggunaan Bajet</h3>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div 
                className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-3"
                style={{ width: `${(spentBudget/totalBudget)*100}%` }}
              >
                <span className="text-xs font-semibold text-white">Dibelanjakan</span>
              </div>
              <div 
                className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-3 -mt-8"
                style={{ width: `${(allocatedBudget/totalBudget)*100}%` }}
              >
                <span className="text-xs font-semibold text-white">Diperuntukkan</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>RM 0</span>
            <span>RM {totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Budget Breakdown by Program */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Peruntukan Mengikut Program</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah (RM)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockBudget.map((budget) => {
                  const program = mockPrograms.find(p => p.id === budget.program_id);
                  const subject = mockSubjects.find(s => s.id === program?.target_subject_id);
                  
                  return (
                    <tr key={budget.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {program?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {subject?.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {budget.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          budget.status === 'spent' ? 'bg-green-100 text-green-800' :
                          budget.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {budget.status === 'spent' ? 'Dibelanjakan' :
                           budget.status === 'approved' ? 'Diluluskan' :
                           'Dirancang'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {budget.description}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Lihat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-900">
                    JUMLAH
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    RM {allocatedBudget.toLocaleString()}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Budget by Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {mockSubjects.map(subject => {
            const subjectBudget = mockBudget
              .filter(b => {
                const program = mockPrograms.find(p => p.id === b.program_id);
                return program?.target_subject_id === subject.id;
              })
              .reduce((sum, b) => sum + b.amount, 0);

            return (
              <div key={subject.id} className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-600 mb-2">{subject.name}</h4>
                <p className="text-2xl font-bold text-gray-900">RM {subjectBudget.toLocaleString()}</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(subjectBudget/totalBudget)*100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((subjectBudget/totalBudget)*100).toFixed(1)}% daripada jumlah bajet
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
