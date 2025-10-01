"use client"
import Background from "@/components/background";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useState, useEffect } from "react"

// Data Kebiasaan dan Dampak Kuantitatif (default)
const initialHabitData = [
  { aksi: "Bawa Botol Minum", dampak: "Hemat ≈ 1-2 botol plastik/hari" },
  { aksi: "Bawa Kantong Belanja", dampak: "Hemat ≈ 0,5 kantong plastik/hari" },
  { aksi: "Transportasi Umum", dampak: "Potong emisi hingga 90% (vs mobil)" },
  { aksi: "Pisahkan Sampah", dampak: "Cegah metana, gas 25x CO₂" },
  { aksi: "Kompos Dapur", dampak: "Kurangi ≈ 0,5 kg sampah TPA/hari" },
  { aksi: "Manfaatkan Air Bekas", dampak: "Daur ulang ≈ 10-20 liter air" },
  { aksi: "Hemat Air", dampak: "Hemat 4 liter air/menit" },
  { aksi: "Cabut Charger", dampak: "Potong ≈ 10% 'listrik hantu'" },
  { aksi: "Hemat Listrik", dampak: "Kurangi ≈ 0,2-1 kg CO₂/hari" },
  { aksi: "Tanam Pohon", dampak: "Serap ≈ 60 gram CO₂/hari (dewasa)" },
];

export default function DailyTracker() {
  const today = new Date().toISOString().split("T")[0] // format YYYY-MM-DD

  const [habits, setHabits] = useState([]) 
  const [tracker, setTracker] = useState({})

  // 🔄 Load data dari localStorage saat pertama kali render
  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem("habitList")) || [];
let savedTracker = JSON.parse(localStorage.getItem("habitTracker")) || {};

// 🎯 Filter: hanya ambil tanggal di bulan ini
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

savedTracker = Object.fromEntries(
  Object.entries(savedTracker).filter(([date]) => {
    const d = new Date(date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  })
);


    // gabungkan default habits + savedHabits (hindari duplikat)
    const mergedHabits = [
      ...initialHabitData,
      ...savedHabits.filter(
        (h) => !initialHabitData.some((def) => def.aksi === h.aksi)
      ),
    ];

    const habitNames = mergedHabits.map(h => h.aksi);

    // kalau hari ini belum ada tracker → buat baru
    if (!savedTracker[today]) {
      savedTracker[today] = habitNames.reduce(
        (acc, name) => ({ ...acc, [name]: false }),
        {}
      );
    } else {
      // kalau sudah ada → pastikan semua habit tetap masuk
      habitNames.forEach((name) => {
        if (!(name in savedTracker[today])) {
          savedTracker[today][name] = false;
        }
      });
    }

    setHabits(mergedHabits);
    setTracker(savedTracker);
  }, []);

  // 💾 Simpan setiap kali habits atau tracker berubah
  useEffect(() => {
    if (habits.length) localStorage.setItem("habitList", JSON.stringify(habits))
    if (Object.keys(tracker).length)
      localStorage.setItem("habitTracker", JSON.stringify(tracker))
  }, [habits, tracker])

  // ✅ Toggle checklist
  const toggleHabit = (habitName) => {
    setTracker((prev) => ({
      ...prev,
      [today]: {
        ...prev[today],
        [habitName]: !prev[today][habitName],
      },
    }))
  }

  // ➕ Tambah habit baru
  const addHabit = () => {
    const newAksi = prompt("Masukkan nama kebiasaan baru (Contoh: Bawa Bekal):");
    if (!newAksi || habits.some(h => h.aksi === newAksi)) return;
    
    const newDampak = prompt(`Masukkan dampak terukur untuk: ${newAksi} (Contoh: Hemat 1 kemasan/hari):`);
    if (!newDampak) return;

    const newHabitObject = { aksi: newAksi, dampak: newDampak };

    setHabits((prev) => [...prev, newHabitObject]);

    setTracker((prev) => ({
      ...prev,
      [today]: { ...prev[today], [newAksi]: false },
    }));
  }

  // ❌ Hapus habit
  const removeHabit = (habitName) => {
    if (!window.confirm(`Yakin ingin menghapus kebiasaan "${habitName}"?`)) return
    
    setHabits((prev) => prev.filter((h) => h.aksi !== habitName))
    
    setTracker((prev) => {
        const updatedTracker = { ...prev };
        for (const date in updatedTracker) {
            if (updatedTracker[date].hasOwnProperty(habitName)) {
                delete updatedTracker[date][habitName];
            }
        }
        return updatedTracker;
    })
  }

  // Fungsi utilitas untuk mendapatkan dampak dari habit
  const getDampak = (habitName) => {
      const data = habits.find(item => item.aksi === habitName);
      return data ? data.dampak : "Dampak belum terdata (diperlukan reload).";
  }

  // Format tanggal DD-MM-YYYY
  const formatTanggal = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
  <div>
    <Header />
    <Background />
    <Footer />
    <div className="mt-18 p-4 max-w-lg mx-auto relative z-10"> 
      <h2 className="text-2xl font-bold mb-4 text-center">
         Lacak Aksi Hijaumu!
      </h2>
      <p className="text-sm text-green-600 mb-6 text-center">{formatTanggal(today)}</p>
      
      <button
        onClick={addHabit}
        className="w-full mb-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-colors"
      >
        <b>+</b> Tambah Aksi Baru
      </button>

      <div className="space-y-3">
        {habits
          .filter(habit => habit.aksi && habit.dampak) // hanya tampilkan habit yang ada nama & dampak
          .map((habit) => (
            <div 
              key={habit.aksi} 
              className="p-3 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between bg-white/90 transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="flex-grow min-w-0 pr-4">
                <div className="font-semibold text-base text-gray-800">
                  {habit.aksi}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">
                  {getDampak(habit.aksi)}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                  onClick={() => toggleHabit(habit.aksi)}
                  className={`w-7 h-7 min-w-7 min-h-7 flex items-center justify-center rounded-md border-2 transition-colors duration-150
                    ${tracker[today]?.[habit.aksi] ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}
                    shadow-inner cursor-pointer`}
                  aria-label={`Selesaikan ${habit.aksi}`}
                  type="button"
                >
                  {tracker[today]?.[habit.aksi] && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => removeHabit(habit.aksi)}
                   className="text-gray-500 text-sm hover:text-gray-700 p-1 transition-colors"
                  aria-label={`Hapus kebiasaan ${habit.aksi}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
    </div>
  )
}
