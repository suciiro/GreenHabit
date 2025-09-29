'use client'

import Image from "next/image";
import Header from "../components/header";
import WasteBankPage from "../waste-bank/page";
import HabitChart from "@/habit-chart/page";
import DailyTracker from "@/tracker/page";
import Summary from "@/weekly-summary/page";
import Leaderboard from "@/leaderboard/page";

export default function Home() {
  return (
    <div>
       <Header />
       <DailyTracker />
       <Summary />
       <HabitChart />
       <Leaderboard />
       <WasteBankPage />
    </div>
    
  );
}
