"use client"
import { useState, useEffect } from "react"

export default function Summary() {
  const [tracker, setTracker] = useState({})
  const [habits, setHabits] = useState([])
  const [viewMode, setViewMode] = useState("weekly") // "weekly" | "monthly"

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habitTracker")) || {}
    setTracker(saved)

    // ambil semua habit unik
    const allHabits = new Set()
    Object.values(saved).forEach((day) => {
      Object.keys(day).forEach((h) => allHabits.add(h))
    })
    setHabits([...allHabits])
  }, [])

  // ---------------- WEEKLY ----------------
  const getWeekNumber = (dateStr) => {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    const firstDay = new Date(d.getFullYear(), 0, 1)
    const dayOfYear = ((d - firstDay) / 86400000) + firstDay.getDay() + 1
    return Math.ceil(dayOfYear / 7)
  }

  const getWeekDates = (dateStr) => {
    const d = new Date(dateStr)
    const day = d.getDay() || 7
    const monday = new Date(d)
    monday.setDate(d.getDate() - day + 1)

    return [...Array(7)].map((_, i) => {
      const temp = new Date(monday)
      temp.setDate(monday.getDate() + i)
      return temp.toISOString().split("T")[0]
    })
  }

  const getWeeklyData = () => {
    const allDates = Object.keys(tracker).sort()
    if (allDates.length === 0) return []

    const grouped = {}
    allDates.forEach((date) => {
      const weekKey = `Minggu ${getWeekNumber(date)}`
      if (!grouped[weekKey]) grouped[weekKey] = []
      grouped[weekKey].push(date)
    })

    return Object.entries(grouped).map(([week, days]) => {
      const sortedDays = days.sort()
      const weekDates = getWeekDates(sortedDays[0])
      return { label: week, days: weekDates }
    })
  }

  // ---------------- MONTHLY ----------------
  const getMonthLabel = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleString("id-ID", { month: "long", year: "numeric" })
  }

  const getAllDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1)
    const days = []
    while (date.getMonth() === month) {
      days.push(date.toISOString().split("T")[0])
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  const getMonthlyData = () => {
    const allDates = Object.keys(tracker).sort()
    if (allDates.length === 0) return []

    const grouped = {}
    allDates.forEach((date) => {
      const d = new Date(date)
      const monthKey = getMonthLabel(date)
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          year: d.getFullYear(),
          month: d.getMonth(),
        }
      }
    })

    return Object.entries(grouped).map(([monthLabel, { year, month }]) => {
      const days = getAllDaysInMonth(year, month)
      return { label: monthLabel, days }
    })
  }

  const weeklyData = getWeeklyData()
  const monthlyData = getMonthlyData()
  const daysLabelWeekly = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">📊 Rekap {viewMode === "weekly" ? "Mingguan" : "Bulanan"}</h2>

      {/* Filter Mode */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setViewMode("weekly")}
          className={`px-4 py-2 rounded ${viewMode === "weekly" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Mingguan
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-4 py-2 rounded ${viewMode === "monthly" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Bulanan
        </button>
      </div>

      {/* RENDER TABLE */}
      {viewMode === "weekly" ? (
        weeklyData.length === 0 ? (
          <p className="text-gray-500">Belum ada data</p>
        ) : (
          weeklyData.map((week) => (
            <div key={week.label} className="mb-6">
              <h3 className="font-semibold mb-2">{week.label}</h3>
              <table className="w-full border border-gray-300 text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Habit</th>
                    {daysLabelWeekly.map((d, i) => (
                      <th key={i} className="p-2 border">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border font-medium">{habit}</td>
                      {week.days.map((day, i) => {
                        const checked = tracker[day]?.[habit] || false
                        return (
                          <td key={i} className="p-2 border">
                            <input type="checkbox" checked={checked} readOnly className="w-5 h-5 accent-green-500" />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )
      ) : (
        monthlyData.length === 0 ? (
          <p className="text-gray-500">Belum ada data</p>
        ) : (
          monthlyData.map((month) => (
            <div key={month.label} className="mb-6">
              <h3 className="font-semibold mb-2">{month.label}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-max border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Habit</th>
                      {month.days.map((d, i) => (
                        <th key={i} className="p-2 border text-xs">{new Date(d).getDate()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border font-medium">{habit}</td>
                        {month.days.map((day, i) => {
                          const checked = tracker[day]?.[habit] || false
                          return (
                            <td key={i} className="p-2 border">
                              <input type="checkbox" checked={checked} readOnly className="w-5 h-5 accent-green-500" />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )
      )}
    </div>
  )
}
