// src/waste-bank/page.jsx
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' // PENTING untuk impor komponen client-only

// Gunakan next/dynamic untuk impor MapContainer.jsx
// ssr: false memastikan kode Leaflet tidak pernah dijalankan di server.
const DynamicMapContainer = dynamic(
  () => import('../components/map-container'), 
  {
    loading: () => <p className="text-center text-slate-500">Memuat peta...</p>,
    ssr: false // HINDARI SSR (Server-Side Rendering)
  }
)

export default function WasteBankPage() {
  const [filter, setFilter] = useState('all')
  const [dataBankSampah, setDataBankSampah] = useState([])

  // Fetch data bank sampah (Bisa tetap di sini atau dipindah ke MapContainer, tapi di sini lebih bersih)
  useEffect(() => {
    fetch('/waste-bank.json')
      .then((res) => res.json())
      .then((data) => setDataBankSampah(data))
  }, []) // Hanya dijalankan sekali

  return (
    <main className="flex-1 mb-12 mt-24">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900">
        Peta Bank Sampah Indonesia
      </h2>

      <div className="md:w-4/5 mx-auto mt-6 text-lg text-slate-700 leading-relaxed text-center">
        <label htmlFor="filter">Filter jenis:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-200 bg-white text-slate-800 rounded-md px-4 py-2 shadow-sm ml-3"
        >
          <option value="all">Semua</option>
          <option value="organik">Organik</option>
          <option value="anorganik">Anorganik</option>
        </select>
      </div>

      <div className="flex justify-center mt-6">
        {/* Gunakan komponen peta dinamis di sini */}
        <DynamicMapContainer 
          filter={filter} 
          dataBankSampah={dataBankSampah} 
        />
      </div>
    </main>
  )
}