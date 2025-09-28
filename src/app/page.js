'use client'

import Image from "next/image";
import Header from "./components/header";
import WasteBankPage from "../waste-bank/page";
import HabitChart from "@/habit-chart/page";
import DailyTracker from "@/tracker/page";
import WeeklySummary from "@/weekly-summary/page";

export default function Home() {
  return (
    <div>
       <Header />
       <DailyTracker />
       <WeeklySummary />
       <HabitChart />
       <WasteBankPage />
    </div>
    
  );
}
