"use client"
import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

export default function HabitChart() {
  const [chartData, setChartData] = useState([])
  // State periode baru: 'mingguan', 'bulanan', atau 'akumulasi'
  const [period, setPeriod] = useState('mingguan') 

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

  // Fungsi utilitas untuk mendapatkan key periode (Minggu atau Bulan)
  const getPeriodKey = (date, periodType) => {
    const year = date.getFullYear();
    if (periodType === 'mingguan') {
      const weekNum = getWeekNumber(date);
      return `${year}-W${weekNum}`; // Contoh: 2025-W40
    } else if (periodType === 'bulanan') {
      const monthNum = date.getMonth() + 1;
      return `${year}-M${monthNum.toString().padStart(2, '0')}`; // Contoh: 2025-M09
    } else {
      return 'Total Akumulasi'; // Key tunggal untuk mode akumulasi
    }
  };

  // 🔄 Hitung ulang data setiap kali periode berubah
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habitTracker")) || {}
    const summary = {}

    Object.keys(saved).forEach((dateStr) => {
      const date = new Date(dateStr)
      const periodKey = getPeriodKey(date, period) 

      let totalCO2e = 0
      let totalWaste = 0
      let totalWater = 0

      // Kalkulasi dampak harian
      Object.entries(saved[dateStr]).forEach(([habit, done]) => {
        if (done && IMPACT_METRICS[habit]) {
          totalCO2e += IMPACT_METRICS[habit].co2e || 0
          totalWaste += IMPACT_METRICS[habit].waste || 0
          totalWater += IMPACT_METRICS[habit].water || 0
        }
      })

      // Akumulasi berdasarkan periodKey
      if (!summary[periodKey]) summary[periodKey] = { co2e: 0, waste: 0, water: 0 }
      summary[periodKey].co2e += totalCO2e
      summary[periodKey].waste += totalWaste
      summary[periodKey].water += totalWater
    })

    // Ubah jadi array untuk chart
    let data = Object.entries(summary)
      .map(([key, totals]) => ({
        period: key,
        co2e: parseFloat(totals.co2e.toFixed(1)),
        waste: parseFloat(totals.waste.toFixed(1)),
        water: parseFloat(totals.water.toFixed(0)), 
      }))
      
    // Sortir hanya jika bukan mode akumulasi
    if (period !== 'akumulasi') {
        data = data.sort((a, b) => a.period.localeCompare(b.period));
    }

    setChartData(data)
  }, [period]) // Dependency diubah ke [period]

  // Fungsi cari nomor minggu
  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
    return weekNo
  }
  
  // Fungsi formatter untuk label XAxis
  const formatXAxisLabel = (key) => {
      if (!key || typeof key !== "string") return ""; // Hindari error jika key undefined/null
      if (period === 'mingguan') {
          const parts = key.split('-');
          if (parts.length < 2) return key;
          return parts[1].replace('W', 'Mgg ');
      } else if (period === 'bulanan') {
          const parts = key.split('-');
          if (parts.length < 2) return key;
          const monthIndex = parseInt(parts[1].replace('M', '')) - 1;
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          return monthNames[monthIndex] ?? key;
      }
      return key; // Tampilkan 'Total Akumulasi'
  };
  
  // Fungsi formatter untuk label Tooltip
  const formatTooltipLabel = (label) => {
    if (period === 'akumulasi') return 'Total Akumulasi Seluruh Waktu';
      
    const parts = label.split('-');
    const year = parts[0];
    if (period === 'mingguan') {
        return `Periode: ${year} - Minggu ${parts[1].substring(1)}`;
    } else {
        const monthIndex = parseInt(parts[1].substring(1)) - 1;
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return `Periode: ${monthNames[monthIndex]} ${year}`;
    }
  };


  return (
    // Kontainer utama diatur agar terpusat dan memiliki lebar maksimal
    <div className="mt-6 p-4 max-w-lg mx-auto"> 
      <div className="p-4 border border-gray-200 rounded-xl shadow-lg bg-white">
        <h3 className="text-xl font-bold mb-4 text-center text-green-700">📈 Rekap Dampak Lingkungan</h3>
        
        {/* Tombol Pilihan Periode */}
        <div className="mb-4 flex flex-wrap justify-center gap-2"> 
          <button
            onClick={() => setPeriod('mingguan')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              period === 'mingguan' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-green-100'
            }`}
          >
            Per Minggu
          </button>
          <button
            onClick={() => setPeriod('bulanan')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              period === 'bulanan' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-green-100'
            }`}
          >
            Per Bulan
          </button>
          <button
            onClick={() => setPeriod('akumulasi')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              period === 'akumulasi' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-green-100'
            }`}
          >
            Total Akumulasi
          </button>
        </div>

        {/* ResponsiveContainer memastikan grafik mengisi lebar 100% dari parent */}
        <ResponsiveContainer width="100%" height={300}>
          {/* Margin disesuaikan agar YAxis tidak terpotong di mobile */}
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}> 
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="period" 
              // Rotasi Sumbu X diset -35 derajat agar label tidak tumpang tindih di mobile
              angle={period === 'akumulasi' ? 0 : -35} 
              textAnchor={period === 'akumulasi' ? 'middle' : 'end'} 
              height={60} // Menambah tinggi untuk menampung label yang dirotasi
              interval={0}
              tickFormatter={formatXAxisLabel} 
              style={{ fontSize: '10px' }} // Ukuran font diperkecil
            />
            {/* Label YAxis dipindahkan ke tengah agar tidak memakan margin horizontal terlalu banyak */}
            <YAxis label={{ value: 'Unit Dampak', angle: -90, position: 'center', fill: '#555', dx: -5, style: { fontSize: '10px' } }} /> 
            <Tooltip
              formatter={(value, name) => {
                  const unit = name.includes('Air') ? 'Liter' : 'Kg';
                  return [`${value} ${unit}`, name];
              }}
              labelFormatter={formatTooltipLabel} 
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ padding: '0 0 5px 0', fontSize: '12px' }} />

            <Bar dataKey="co2e" fill="#34d399" name="Kg CO₂ Ekuivalen Dihemat" radius={[4, 4, 0, 0]} />
            <Bar dataKey="waste" fill="#a3e635" name="Kg Sampah Padat Dihindari" radius={[4, 4, 0, 0]} />
            <Bar dataKey="water" fill="#60a5fa" name="Liter Air Dihemat" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-3 text-sm text-gray-500 text-center">
            *Grafik menampilkan total akumulasi dampak per **{period.replace('mingguan', 'minggu').replace('bulanan', 'bulan').replace('akumulasi', 'seluruh waktu')}**.
        </p>
      </div>
    </div>
  )
}