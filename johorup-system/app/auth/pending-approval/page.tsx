'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PendingApprovalPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect to login after 10 seconds
    const timer = setTimeout(() => {
      router.push('/login')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Menunggu Kelulusan
        </h1>

        {/* Message */}
        <div className="text-gray-600 mb-6 space-y-3">
          <p>
            Akaun anda sedang menunggu kelulusan daripada pentadbir sistem.
          </p>
          <p className="text-sm">
            Hanya domain rasmi MOE yang dibenarkan:
          </p>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="font-medium text-gray-800 mb-2">Domain yang dibenarkan:</div>
            <ul className="text-left space-y-1">
              <li>• <code className="bg-blue-100 px-2 py-1 rounded">@moe-dl.edu.my</code> - Sekolah</li>
              <li>• <code className="bg-green-100 px-2 py-1 rounded">@moe.gov.my</code> - PPD & Jabatan</li>
              <li>• <code className="bg-purple-100 px-2 py-1 rounded">@jcorp.com.my</code> - Yayasan JCorp</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Langkah seterusnya:</h3>
          <ol className="text-sm text-blue-800 text-left space-y-1">
            <li>1. Hubungi pentadbir sistem</li>
            <li>2. Berikan maklumat akaun anda</li>
            <li>3. Tunggu kelulusan</li>
            <li>4. Cuba log masuk semula</li>
          </ol>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-500 mb-6">
          <p>Untuk bantuan, hubungi:</p>
          <p className="font-medium text-gray-700">admin@jpnj.gov.my</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Halaman Login
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cuba Semula
          </button>
        </div>

        {/* Auto redirect notice */}
        <p className="text-xs text-gray-400 mt-4">
          Akan kembali ke halaman login dalam 10 saat...
        </p>
      </div>
    </div>
  )
}