"use client"
import { useState, useEffect } from "react"

export default function WeeklySummary() {
  const [tracker, setTracker] = useState({})

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habitTracker")) || {}
    setTracker(saved)
  }, [])

  const getWeekSummary = () => {
    const result = {}
    Object.keys(tracker).forEach((date) => {
      const week = `Minggu ${getWeekNumber(new Date(date))}`
      if (!result[week]) result[week] = 0
      result[week] += Object.values(tracker[date]).filter(Boolean).length
    })
    return Object.entries(result).map(([week, total]) => ({ week, total }))
  }

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  }

  const weeklyData = getWeekSummary()

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📊 Rekap Mingguan</h2>
      <ul>
        {weeklyData.map((w) => (
          <li key={w.week}>
            {w.week}: {w.total} aksi ✅
          </li>
        ))}
      </ul>
    </div>
  )
}
