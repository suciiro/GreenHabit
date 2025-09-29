// src/components/MapContainer.jsx
'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // Import CSS di sini
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import ReactDOMServer from 'react-dom/server'

// Komponen Peta utama
export default function MapContainer({ filter, dataBankSampah }) {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  // Inisialisasi peta
  useEffect(() => {
    // Pastikan container peta belum diinisialisasi ulang
    if (map) return; 

    // Inisialisasi peta dengan ID 'map'
    const mapInstance = L.map('map-id').setView([-6.2, 106.816], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance)

    setMap(mapInstance)

    // Cleanup: hapus peta saat komponen di-unmount
    return () => {
      mapInstance.remove()
    }
  }, []) // Dependensi kosong, hanya dijalankan sekali

  // Update marker saat filter atau data berubah
  useEffect(() => {
    if (!map) return

    // Hapus marker lama
    markers.forEach((m) => map.removeLayer(m))

    const filtered = dataBankSampah.filter((item) =>
      filter === 'all' ? true : item.jenis === filter
    )

    const newMarkers = filtered.map((item) => {
      // Custom icon pakai FontAwesome
      const iconHtml = ReactDOMServer.renderToString(
        <FontAwesomeIcon icon={faLocationDot} size="2x" color="green" />
      );

      const locationIcon = L.divIcon({
        html: iconHtml,
        className: '', // biar nggak ada default style Leaflet
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })

      const marker = L.marker([item.lat, item.lng], { icon: locationIcon }).addTo(map)
      marker.bindPopup(
        `<b>${item.nama}</b><br>Jenis: ${item.jenis}<br>Alamat: ${item.alamat}<br>
         <a href="${item.map}" target="_blank">Lihat di Maps</a>`
      )
      
      return marker
    })

    setMarkers(newMarkers)
    
    // Opsional: Atur ulang tampilan peta (fitBounds) jika ada marker baru
    if (newMarkers.length > 0) {
        const group = new L.FeatureGroup(newMarkers);
        map.fitBounds(group.getBounds());
    }

  }, [filter, dataBankSampah, map]) // Dependensi: filter, data, dan map

  // Render elemen div untuk Leaflet
  return (
    <div
      id="map-id" // ID unik untuk container peta
      className="md:w-[60%] w-[90%] h-[350px] rounded-lg shadow z-0"
    />
  )
}