"use client"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function HabitChart({ tracker }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (!tracker) return

    // hitung total aksi per minggu
    const weeks = [1, 2, 3, 4]
    const weeklyData = weeks.map((week) => {
      let total = 0
      Object.values(tracker).forEach((habit) => {
        Object.keys(habit).forEach((day) => {
          if (habit[day]) {
            const d = parseInt(day)
            if (d >= (week - 1) * 7 + 1 && d <= week * 7) {
              total++
            }
          }
        })
      })
      return { week: `Minggu ${week}`, aksi: total }
    })

    setChartData(weeklyData)
  }, [tracker])

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">📊 Rekap Aksi Lingkungan</h3>
      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="aksi" fill="#4ade80" />
      </BarChart>
    </div>
  )
}
