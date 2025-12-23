'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Logo size="md" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">JohorUP</h1>
                <p className="text-sm text-gray-600">Sistem Pemantauan Program SPM 2026</p>
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Log Masuk
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Program <span className="text-blue-600">JohorUP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Sistem Pemantauan Program Peningkatan Prestasi SPM 2026
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Inisiatif strategik untuk meningkatkan prestasi pelajar dalam mata pelajaran teras 
              melalui program tuisyen berkualiti dan pemantauan berterusan
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">880</div>
              <div className="text-sm text-gray-600">Murid Disasarkan</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">20</div>
              <div className="text-sm text-gray-600">Sekolah Terlibat</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">120</div>
              <div className="text-sm text-gray-600">Guru Terlatih</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">RM450K</div>
              <div className="text-sm text-gray-600">Jumlah Pelaburan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Funding Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kepimpinan & Pembiayaan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Program ini diketuai dan didanai oleh institusi terkemuka yang komited 
              terhadap kecemerlangan pendidikan di Johor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Yayasan JCorp - Leader */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Yayasan JCorp</h3>
                <p className="text-blue-800 font-semibold mb-4">PENERAJU PROGRAM</p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Memimpin pelaksanaan program dengan komitmen penuh terhadap peningkatan 
                  kualiti pendidikan dan pembangunan modal insan di negeri Johor melalui 
                  pendekatan holistik dan berkesan.
                </p>
              </div>
            </div>

            {/* Yayasan Hasanah - Funder */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-3">Yayasan Hasanah</h3>
                <p className="text-green-800 font-semibold mb-4">PEMBIAYA UTAMA</p>
                <p className="text-green-700 text-sm leading-relaxed">
                  Menyediakan sokongan kewangan sebanyak RM450,000 untuk memastikan 
                  program berjalan lancar dan mencapai objektif peningkatan prestasi 
                  akademik pelajar di seluruh negeri Johor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ciri-ciri Program
            </h2>
            <p className="text-lg text-gray-600">
              Program komprehensif yang direka untuk mencapai kecemerlangan akademik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Program Tuisyen Berkualiti</h3>
              <p className="text-gray-600 text-sm">
                Kelas tambahan yang direka khas untuk mata pelajaran teras SPM dengan 
                pendekatan pembelajaran yang berkesan dan menarik.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pemantauan Berterusan</h3>
              <p className="text-gray-600 text-sm">
                Sistem pemantauan digital yang membolehkan penjejakan kemajuan pelajar 
                secara real-time dan analisis prestasi yang mendalam.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v2c0 .656.126 1.283.356 1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pembangunan Guru</h3>
              <p className="text-gray-600 text-sm">
                Program latihan dan pembangunan profesional untuk guru bagi memastikan 
                kualiti pengajaran yang optimum dan berkesan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fasa Pelaksanaan Program
            </h2>
            <p className="text-lg text-gray-600">
              Program dilaksanakan dalam 3 fasa strategik untuk memastikan kejayaan optimum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fasa 1</h3>
              <p className="text-blue-600 font-medium mb-2">Jan - Apr 2026</p>
              <p className="text-gray-600 text-sm">
                Latihan guru, penyediaan bahan pembelajaran, dan pelaksanaan program tuisyen awal
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fasa 2</h3>
              <p className="text-green-600 font-medium mb-2">Mei - Sep 2026</p>
              <p className="text-gray-600 text-sm">
                Pemantauan dan penilaian, penambahbaikan program, dan latihan lanjutan guru
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fasa 3</h3>
              <p className="text-purple-600 font-medium mb-2">Okt 2026 - Apr 2027</p>
              <p className="text-gray-600 text-sm">
                Penilaian akhir program, laporan impak keseluruhan, dan cadangan kesinambungan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sertai Kami Dalam Misi Kecemerlangan Pendidikan
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Akses sistem pemantauan untuk melihat kemajuan program dan sumbangan 
            terhadap peningkatan prestasi pelajar di Johor
          </p>
          
          <button
            onClick={handleLogin}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Masuk ke Sistem
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Logo size="sm" />
                <span className="text-xl font-bold">JohorUP</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistem Pemantauan Program Peningkatan Prestasi SPM 2026 
                Jabatan Pendidikan Negeri Johor
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Peneraju Program</h4>
              <p className="text-gray-400 text-sm mb-2">Yayasan JCorp</p>
              <p className="text-gray-400 text-sm">Memimpin transformasi pendidikan di Johor</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Pembiaya</h4>
              <p className="text-gray-400 text-sm mb-2">Yayasan Hasanah</p>
              <p className="text-gray-400 text-sm">Sokongan kewangan RM450,000</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Program JohorUP. Hak Cipta Terpelihara. 
              Jabatan Pendidikan Negeri Johor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
