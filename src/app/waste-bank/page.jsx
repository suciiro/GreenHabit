'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function WasteBankPage() {
  const [filter, setFilter] = useState('all')
  const [dataBankSampah, setDataBankSampah] = useState([])
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  // Inisialisasi peta
  useEffect(() => {
    const mapInstance = L.map('map').setView([-6.2, 106.816], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance)

    setMap(mapInstance)

    fetch('/waste-bank.json')
      .then((res) => res.json())
      .then((data) => setDataBankSampah(data))

    return () => {
      mapInstance.remove()
    }
  }, [])

  // Update marker saat filter berubah
  useEffect(() => {
    if (!map) return

    // Hapus marker lama
    markers.forEach((m) => map.removeLayer(m))

    const filtered = dataBankSampah.filter((item) =>
      filter === 'all' ? true : item.jenis === filter
    )

    const newMarkers = filtered.map((item) => {
      const marker = L.marker([item.lat, item.lng]).addTo(map)
      marker.bindPopup(
        `<b>${item.nama}</b><br>Jenis: ${item.jenis}<br>Alamat: ${item.alamat}<br>
         <a href="${item.map}" target="_blank">Lihat di Maps</a>`
      )
      return marker
    })

    setMarkers(newMarkers)
  }, [filter, dataBankSampah, map])

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
          className="border border-slate-300 bg-white text-slate-800 rounded-md px-4 py-2 shadow-sm"
        >
          <option value="all">Semua</option>
          <option value="organik">Organik</option>
          <option value="anorganik">Anorganik</option>
        </select>
      </div>

      <div className="flex justify-center mt-6">
        <div
          id="map"
          className="md:w-[60%] w-[90%] h-[350px] rounded-lg shadow z-0"
        />
      </div>
    </main>
  )
}
