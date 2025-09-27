'use client'

import Image from "next/image";
import Header from "./components/header";
import WasteBankPage from "./waste-bank/page";

export default function Home() {
  return (
    <div>
       <Header />
       <WasteBankPage />
    </div>
    
  );
}
