"use client"
import Background from '@/components/background'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { useState, useEffect, useCallback } from 'react'

// --- KONSTANTA DARI HABITCHART (untuk konsistensi perhitungan) ---
// Nilai dampak terukur per kebiasaan (Kg CO2e, Kg Sampah, Liter Air)
const IMPACT_METRICS = {
    "Bawa Botol Minum": { co2e: 0.05, waste: 0.03, water: 0 },
    "Bawa Kantong Belanja": { co2e: 0.01, waste: 0.0025, water: 0 },
    "Transportasi Umum": { co2e: 1.5, waste: 0, water: 0 },
    "Pisahkan Sampah": { co2e: 0.5, waste: 0, water: 0 },
    "Kompos Dapur": { co2e: 0.2, waste: 0.5, water: 0 },
    "Manfaatkan Air Bekas": { co2e: 0.1, waste: 0, water: 15 },
    "Hemat Air": { co2e: 0.0, waste: 0, water: 12 },
    "Cabut Charger": { co2e: 0.02, waste: 0, water: 0 },
    "Hemat Listrik": { co2e: 0.8, waste: 0, water: 0 },
    "Tanam Pohon": { co2e: 0.06, waste: 0, water: 0 },
}

// --- BOBOT UNTUK MENGHITUNG SKOR GABUNGAN ---
// Bobot ini berdasarkan pendekatan ilmiah (konversi ke CO2e)
const WEIGHTS = {
    CO2: 1,       // Setiap 1 Kg CO2 dikalikan 1
    SAMPAH: 0.3,   // Setiap 1 Kg Sampah dikalikan 0.3
    AIR: 0.0005,       // Setiap 1 Liter Air dikalikan 0.0005
}

// Data simulasi pengguna lain (skor total fiktif)
const DUMMY_SCORES = [
  { nickname: "EcoWarrior_7", co2: 120, sampah: 5.5, air: 150 },
  { nickname: "GreenCycle_ID", co2: 95, sampah: 4.0, air: 200 },
  { nickname: "PenyelamatBumi", co2: 80, sampah: 3.2, air: 120 },
  { nickname: "LingkunganLestari", co2: 50, sampah: 2.1, air: 300 },
]


// Fungsi untuk menghitung total skor dari 3 aspek
const calculateTotalScore = (co2, sampah, air) => {
    return (
        (co2 * WEIGHTS.CO2) + 
        (sampah * WEIGHTS.SAMPAH) + 
        (air * WEIGHTS.AIR)
    )
}


export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([])
    const localUserNickname = "Anda (Lokal)"

    // Sinkronisasi data leaderboard dari graph (habit-chart)
    // Ambil data dari localStorage "habitTracker" dan hitung total dampak dengan IMPACT_METRICS & WEIGHTS yang sama
    const calculateLocalUserImpact = useCallback(() => {
        const saved = JSON.parse(localStorage.getItem("habitTracker")) || {}
        let totalCO2e = 0
        let totalWaste = 0
        let totalWater = 0
        
        // Iterasi melalui setiap hari yang tercatat
        Object.keys(saved).forEach((dateStr) => {
            // Iterasi melalui setiap kebiasaan yang dilakukan pada hari itu
            Object.entries(saved[dateStr]).forEach(([habit, done]) => {
                if (done && IMPACT_METRICS[habit]) {
                    totalCO2e += IMPACT_METRICS[habit].co2e || 0
                    totalWaste += IMPACT_METRICS[habit].waste || 0
                    totalWater += IMPACT_METRICS[habit].water || 0
                }
            })
        })

        const totalScore = calculateTotalScore(totalCO2e, totalWaste, totalWater)

        return {
            nickname: localUserNickname,
            totalDampak: totalScore,
            co2: parseFloat(totalCO2e.toFixed(1)),
            sampah: parseFloat(totalWaste.toFixed(1)),
            air: parseFloat(totalWater.toFixed(0)),
        }
    }, [localUserNickname])


    useEffect(() => {
        // 1. Hitung skor untuk data dummy
        const processedDummy = DUMMY_SCORES.map(d => ({
            ...d,
            totalDampak: calculateTotalScore(d.co2, d.sampah, d.air)
        }))

        // 2. Hitung skor pengguna lokal secara nyata dari localStorage
        const localUserData = calculateLocalUserImpact()

        // 3. Gabungkan dan Urutkan Data
        const combinedData = [...processedDummy, localUserData]
        const sortedData = combinedData.sort((a, b) => b.totalDampak - a.totalDampak)
                                       .map((item, index) => ({
                                           ...item,
                                           rank: index + 1 // Memastikan rank terupdate
                                       }))
        setLeaderboardData(sortedData)

    }, [calculateLocalUserImpact])

    const getRankStyle = (rank, isLocalUser) => {
        if (isLocalUser) {
            return "bg-green-100 text-green-700 border-green-500 font-extrabold";
        }
        switch (rank) {
            default:
                // Menggunakan background putih agar konsisten dengan kartu default
                return "bg-white text-gray-700 border-gray-200 font-medium"; 
        }
    }

    return (
    <div>
        <Header />
        <Background />
        <Footer />
        <div className="mt-18 p-4 max-w-lg mx-auto relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Yuk Jadi yang Teratas!
            </h2>
            <p className="text-center text-sm text-green-600 mb-6">
                Skor total dihitung: (CO₂ x {WEIGHTS.CO2}) + (Sampah x {WEIGHTS.SAMPAH}) + (Air x {WEIGHTS.AIR})
            </p>

            <div className="space-y-3">
                {leaderboardData.map((entry) => {
                    const isLocalUser = entry.nickname === localUserNickname;
                    return (
                        // Gaya Card yang Konsisten (diwarnai hijau jika pengguna lokal)
                        <div 
                            key={entry.nickname}
                            className={`p-3 border rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-lg flex items-center justify-between ${isLocalUser ? 'bg-green-50 border-green-300' : 'bg-white/90 border-gray-200'}`}
                        >
                            {/* Kolom Kiri: Rank */}
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg flex-shrink-0 ${getRankStyle(entry.rank, isLocalUser)}`}>
                                {entry.rank}
                            </div>

                            {/* Kolom Tengah: Nickname & Detail Dampak */}
                            <div className="flex-1 min-w-0 px-4">
                                <p className="font-semibold text-gray-800 truncate">{entry.nickname}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    CO₂: {entry.co2} Kg | Sampah: {entry.sampah} Kg | Air: {entry.air} Liter
                                </p>
                            </div>

                            {/* Kolom Kanan: Skor Gabungan */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-xl font-extrabold text-green-600">
                                    {entry.totalDampak.toFixed(0)}
                                </p>
                                <p className="text-xs text-gray-500">Total Skor</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        </div>
    )
}