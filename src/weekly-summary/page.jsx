"use client"
import { useState, useEffect } from "react"

// Data Kebiasaan dan Dampak Kuantitatif (Tidak ditampilkan di sini, tapi asumsi ada)
// ...

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
    const day = d.getDay() === 0 ? 7 : d.getDay(); 
    const firstDay = new Date(d.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((d - firstDay) / 86400000) + 1; 
    
    return Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
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
      if (grouped[weekKey].length === 0) grouped[weekKey].push(date) 
    })

    return Object.entries(grouped).map(([week, [dateRef]]) => {
      const weekDates = getWeekDates(dateRef)
      return { label: week, days: weekDates }
    }).sort((a, b) => a.label.localeCompare(b.label)) 
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
    }).sort((a, b) => {
        return new Date(a.label).getTime() - new Date(b.label).getTime();
    })
  }

  const weeklyData = getWeeklyData()
  const monthlyData = getMonthlyData()
  const daysLabelWeekly = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📊 Rekap {viewMode === "weekly" ? "Mingguan" : "Bulanan"}
      </h2>

      {/* Filter Mode */}
      <div className="mb-6 flex gap-2 justify-center">
        <button
          onClick={() => setViewMode("weekly")}
          className={`px-4 py-2 rounded transition-colors text-sm ${viewMode === "weekly" ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-green-100"}`}
        >
          Per Minggu
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-4 py-2 rounded transition-colors text-sm ${viewMode === "monthly" ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-green-100"}`}
        >
          Per Bulan
        </button>
      </div>

      {/* RENDER CONTENT */}
      {viewMode === "weekly" ? (
        // ---------------- MODE MINGGUAN (MOBILE-FRIENDLY CARD) ----------------
        weeklyData.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada data mingguan yang tercatat.</p>
        ) : (
          <div className="max-w-lg mx-auto space-y-6">
            {weeklyData.map((week) => (
              // 🔄 P-4 diubah menjadi P-3 agar lebar padding sama dengan DailyTracker
              <div key={week.label} className="bg-white p-3 border border-gray-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-lg">
                <h3 className="font-bold text-xl mb-3 border-b pb-2 text-green-700">
                  {week.label}
                </h3>
                
                <div className="space-y-3 px-1"> {/* Menambah px-1 untuk menjaga konten tidak terlalu dekat dengan tepi */}
                    {habits.map((habit, idx) => (
                        <div key={idx} className="border-b last:border-b-0 pb-3">
                            <p className="font-semibold text-gray-800 mb-2">{habit}</p>
                            
                            {/* Grid Hari untuk Status Ceklis */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {week.days.map((day, i) => {
                                    const checked = tracker[day]?.[habit] || false
                                    return (
                                        <div key={i} className="flex flex-col items-center">
                                            <span className="text-xs font-medium text-gray-500 mb-1">{daysLabelWeekly[i]}</span>
                                            <span className={`w-6 h-6 rounded flex items-center justify-center transition-colors shadow-inner ${
                                                checked 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-200 text-gray-600' 
                                            }`}>
                                                {checked && '✓'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // ---------------- MODE BULANAN (TABLE WITH STICKY SCROLL) ----------------
        monthlyData.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada data bulanan yang tercatat.</p>
        ) : (
          <div className="max-w-full mx-auto">
            {monthlyData.map((month) => (
              <div key={month.label} className="mb-6">
                <h3 className="font-bold text-xl mb-3 text-center text-gray-800">{month.label}</h3>
                
                {/* overflow-x-auto: Kontainer yang memungkinkan gulir horizontal di mobile */}
                <div className="overflow-x-auto border rounded-xl shadow-md"> 
                  <table className="min-w-max w-full border-collapse border-spacing-0 text-center">
                    <thead>
                      <tr className="bg-gray-100 text-sm">
                        {/* Kolom 'Habit' dibuat sticky, min-w-40 agar cukup lebar */}
                        <th className="p-3 border sticky left-0 bg-gray-100 z-10 text-left min-w-[150px] font-semibold text-gray-700">Habit</th>
                        {month.days.map((d, i) => (
                          <th key={i} className="p-3 border text-xs min-w-[30px] font-semibold text-gray-700">
                            {new Date(d).getDate()} {/* Hanya tampilkan tanggal (1, 2, 3, ...) */}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {habits.map((habit, idx) => (
                        <tr key={idx} className="bg-white hover:bg-gray-50 transition-colors">
                          {/* Data 'Habit' dibuat sticky */}
                          <td className="p-3 border sticky left-0 bg-white font-medium text-sm text-left z-0">{habit}</td>
                          {month.days.map((day, i) => {
                            const checked = tracker[day]?.[habit] || false
                            return (
                              <td key={i} className="p-3 border">
                                {/* Ceklis diganti dengan visual yang lebih sederhana dan responsif */}
                                <div className={`w-5 h-5 mx-auto rounded flex items-center justify-center ${
                                  checked ? 'bg-green-500' : 'bg-gray-200'
                                }`}>
                                  {checked && <span className="text-white text-xs font-bold">✓</span>}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}