// src/waste-bank/page.jsx
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' // PENTING untuk impor komponen client-only
import Header from '@/components/header'
import Background from '@/components/background'
import Footer from '@/components/footer'

// Gunakan next/dynamic untuk impor MapContainer.jsx
// ssr: false memastikan kode Leaflet tidak pernah dijalankan di server.
const DynamicMapContainer = dynamic(
  () => import('../../components/map-container'),
  {
    loading: () => <p className="text-center text-slate-500">Memuat peta...</p>,
    ssr: false // HINDARI SSR (Server-Side Rendering)
  }
)

export default function WasteBankPage() {
  const [filter, setFilter] = useState('all')
  const [dataBankSampah, setDataBankSampah] = useState([])

  // Fetch data bank sampah
  useEffect(() => {
    fetch('/waste-bank.json')
      .then((res) => res.json())
      .then((data) => setDataBankSampah(data))
  }, []) // Hanya dijalankan sekali

  return (
    <div>
      <Header />
      <Background />
      <Footer />
      {/* Perubahan di sini: max-w-lg untuk mobile, md:max-w-6xl untuk desktop */}
      <div className="mt-18 mb-12 p-4 max-w-lg md:max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Peta Bank Sampah
        </h2>
        <p className="text-center text-sm text-green-600 mb-6 ">
          Yuk, mulai setorkan sampahmu ke bank sampah terdekat!
        </p>
        <div className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white/90">
          <div className="mb-4 flex items-center gap-2">
            <label
              htmlFor="filter"
              className="text-sm font-semibold text-gray-700"
            >
              Filter jenis:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 bg-white text-slate-800 rounded-md px-2 py-1 text-sm shadow-sm"
            >
              <option value="all">Semua Jenis</option>
              <option value="organik">Organik</option>
              <option value="anorganik">Anorganik</option>
            </select>
          </div>
          {/* Peta dengan padding kanan dan kiri sama */}
          <div className="mt-6 w-full">
            <DynamicMapContainer
              filter={filter}
              dataBankSampah={dataBankSampah}
            />
          </div>
        </div>
      </div>
    </div>
  )
}