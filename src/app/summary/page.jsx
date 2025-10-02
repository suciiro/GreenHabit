// Summary.jsx
"use client"
import Background from "@/components/background"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { useState, useEffect } from "react"

export default function Summary() {
  const [tracker, setTracker] = useState({})
  const [viewMode, setViewMode] = useState("weekly") // "weekly" | "monthly"

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habitTracker")) || {}
    setTracker(saved)
  }, [])

  // Hitung persentase keberhasilan
  const getSuccessRate = (days) => {
    if (habitsList.length === 0 || days.length === 0) return 0
    let total = 0
    let success = 0
    habitsList.forEach((habit) => {
      days.forEach((day) => {
        total++
        if (tracker[day]?.[habit]) success++
      })
    })
    return ((success / total) * 100).toFixed(1) // 1 angka di belakang koma
  }

  // ---------------- HABITS (selalu sinkron dengan tracker) ----------------
  const habits = Object.values(tracker).reduce((acc, day) => {
    Object.keys(day).forEach((h) => acc.add(h))
    return acc
  }, new Set())
  const habitsList = [...habits]

  // ---------------- WEEKLY ----------------
  const getWeekNumber = (dateStr) => {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    const firstDay = new Date(d.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((d - firstDay) / 86400000) + 1
    return Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)
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

    return Object.entries(grouped)
      .map(([week, [dateRef]]) => {
        const weekDates = getWeekDates(dateRef)
        return { label: week, days: weekDates }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
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

    return Object.entries(grouped)
      .map(([monthLabel, { year, month }]) => {
        const days = getAllDaysInMonth(year, month)
        return { label: monthLabel, days }
      })
      .sort((a, b) => {
        if (a.year === b.year) {
          return a.month - b.month
        }
        return a.year - b.year
      })
  }

  const weeklyData = getWeeklyData()
  const monthlyData = getMonthlyData()
  const daysLabelWeekly = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  return (
    <div>
      <Header />
      <Background />
      <Footer />
      <div className="mt-18 mb-12 p-4 max-w-lg md:max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Ringkasan {viewMode === "weekly" ? "Mingguan" : "Bulanan"}
        </h2>

        {/* Filter Mode */}
        <div className="mb-6 flex gap-2 justify-center">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 rounded transition-colors text-sm ${
              viewMode === "weekly"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            Per Minggu
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 rounded transition-colors text-sm ${
              viewMode === "monthly"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            Per Bulan
          </button>
        </div>

        {/* ---------------- MODE MINGGUAN ---------------- */}
        {viewMode === "weekly" ? (
          weeklyData.length === 0 ? (
            <p className="text-gray-500 text-center">
              Belum ada data mingguan yang tercatat.
            </p>
          ) : (
            <div className="space-y-6">
              {weeklyData.map((week) => (
                <div
                  key={week.label}
                  className="bg-white/90 p-3 border border-gray-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-lg mb-6"
                >
                  <h3 className="font-bold text-xl mb-3 border-b pb-2 text-green-700 text-center">
                    {week.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Keberhasilan:</strong> {getSuccessRate(week.days)}%
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-max w-full border-collapse border-spacing-0 text-center">
                      <thead>
                        <tr className="bg-gray-100 text-sm">
                          <th className="p-3 border sticky left-0 bg-gray-100 z-10 text-left min-w-[120px] font-semibold text-gray-700">
                            Habit
                          </th>
                          {week.days.map((_, i) => (
                            <th
                              key={i}
                              className="p-3 border text-xs min-w-[30px] font-semibold text-gray-700"
                            >
                              {daysLabelWeekly[i]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {habitsList.map((habit, idx) => (
                          <tr
                            key={idx}
                            className="bg-white/90 hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3 border sticky left-0 bg-white font-medium text-sm text-left z-0">
                              {habit}
                            </td>
                            {week.days.map((day, i) => {
                              const checked = tracker[day]?.[habit] || false
                              return (
                                <td key={i} className="p-3 border">
                                  <div
                                    className={`w-6 h-6 mx-auto rounded flex items-center justify-center transition-colors shadow-inner ${
                                      checked
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {checked && (
                                      <span className="text-white text-base font-bold">
                                        ✓
                                      </span>
                                    )}
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
        ) : (
          /* ---------------- MODE BULANAN ---------------- */
          monthlyData.length === 0 ? (
            <p className="text-gray-500 text-center">
              Belum ada data bulanan yang tercatat.
            </p>
          ) : (
            <div className="space-y-6">
              {monthlyData.map((month) => (
                <div
                  key={month.label}
                  className="bg-white p-3 border border-gray-200 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-lg mb-6"
                >
                  <h3 className="font-bold text-xl mb-3 border-b pb-2 text-green-700 text-center">
                    {month.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Keberhasilan:</strong> {getSuccessRate(month.days)}%
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-max w-full border-collapse border-spacing-0 text-center">
                      <thead>
                        <tr className="bg-gray-100 text-sm">
                          <th className="p-3 border sticky left-0 bg-gray-100 z-10 text-left min-w-[120px] font-semibold text-gray-700">
                            Habit
                          </th>
                          {month.days.map((d, i) => (
                            <th
                              key={i}
                              className="p-3 border text-xs min-w-[30px] font-semibold text-gray-700"
                            >
                              {new Date(d).getDate()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {habitsList.map((habit, idx) => (
                          <tr
                            key={idx}
                            className="bg-white/90 hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3 border sticky left-0 bg-white font-medium text-sm text-left z-0">
                              {habit}
                            </td>
                            {month.days.map((day, i) => {
                              const checked = tracker[day]?.[habit] || false
                              return (
                                <td key={i} className="p-3 border">
                                  <div
                                    className={`w-6 h-6 mx-auto rounded flex items-center justify-center transition-colors shadow-inner ${
                                      checked
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {checked && (
                                      <span className="text-white text-base font-bold">
                                        ✓
                                      </span>
                                    )}
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
    </div>
  )
}