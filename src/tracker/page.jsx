"use client"
import { useState, useEffect } from "react"

export default function DailyTracker() {
  const today = new Date().toISOString().split("T")[0] // format YYYY-MM-DD

  const [habits, setHabits] = useState([])
  const [tracker, setTracker] = useState({})

  // 🔄 Load data dari localStorage saat pertama kali render
  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem("habitList")) || [
      "Bawa Tumbler",
      "Hemat Listrik",
      "Transportasi Umum",
      "Pisahkan Sampah"
    ]
    const savedTracker = JSON.parse(localStorage.getItem("habitTracker")) || {}

    // kalau belum ada data untuk hari ini → bikin default false
    if (!savedTracker[today]) {
      savedTracker[today] = savedHabits.reduce(
        (acc, h) => ({ ...acc, [h]: false }),
        {}
      )
    }

    setHabits(savedHabits)
    setTracker(savedTracker)
  }, [])

  // 💾 Simpan setiap kali habits atau tracker berubah
  useEffect(() => {
    if (habits.length) localStorage.setItem("habitList", JSON.stringify(habits))
    if (Object.keys(tracker).length)
      localStorage.setItem("habitTracker", JSON.stringify(tracker))
  }, [habits, tracker])

  // ✅ Toggle checklist
  const toggleHabit = (habit) => {
    setTracker((prev) => ({
      ...prev,
      [today]: {
        ...prev[today],
        [habit]: !prev[today][habit],
      },
    }))
  }

  // ➕ Tambah habit baru
  const addHabit = () => {
    const newHabit = prompt("Masukkan nama habit baru:")
    if (!newHabit) return
    setHabits((prev) => [...prev, newHabit])
    setTracker((prev) => ({
      ...prev,
      [today]: { ...prev[today], [newHabit]: false },
    }))
  }

  // ❌ Hapus habit
  const removeHabit = (habit) => {
    setHabits((prev) => prev.filter((h) => h !== habit))
    setTracker((prev) => {
      const updated = { ...prev[today] }
      delete updated[habit]
      return { ...prev, [today]: updated }
    })
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🌱 Daily Tracker ({today})</h2>
      <button
        onClick={addHabit}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ➕ Tambah Habit
      </button>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Aksi</th>
            <th className="p-2 border">Checklist</th>
            <th className="p-2 border">Hapus</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, idx) => (
            <tr key={idx} className="text-center">
              <td className="border p-2">{habit}</td>
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={tracker[today]?.[habit] || false}
                  onChange={() => toggleHabit(habit)}
                  className="w-5 h-5 accent-green-500"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => removeHabit(habit)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
