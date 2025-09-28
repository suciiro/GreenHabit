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

  // Nilai impact masing-masing habit
  const IMPACT = {
    "Bawa Botol Minum": 0.5,      // kg plastik dihemat
    "Naik Sepeda": 2.0,           // kg CO2 dihemat
    "Kurangi Kantong Plastik": 0.3,
    "Matikan Lampu": 1.0,
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habitTracker")) || {}

    // Hitung total dampak per minggu
    const summary = {}
    Object.keys(saved).forEach((dateStr) => {
      const date = new Date(dateStr)
      const weekNum = getWeekNumber(date)
      const weekKey = `Minggu ${weekNum}`

      let totalImpact = 0
      Object.entries(saved[dateStr]).forEach(([habit, done]) => {
        if (done) {
          totalImpact += IMPACT[habit] || 0
        }
      })

      if (!summary[weekKey]) summary[weekKey] = 0
      summary[weekKey] += totalImpact
    })

    // Ubah jadi array untuk chart
    const data = Object.entries(summary).map(([week, impact]) => ({
      week,
      impact: parseFloat(impact.toFixed(2)),
    }))

    setChartData(data)
  }, [])

  // Fungsi cari nomor minggu
  const getWeekNumber = (d) => {
    const onejan = new Date(d.getFullYear(), 0, 1)
    const millisecsInDay = 86400000
    return Math.ceil(
      ((d - onejan) / millisecsInDay + onejan.getDay() + 1) / 7
    )
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">🌍 Rekap Dampak Lingkungan</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="impact" fill="#16a34a" name="Kg Dampak Positif" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
