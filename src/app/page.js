'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link";


export default function HomePage() {
  return (
    <div>
      <Header />
      <Footer />
      {/* Tambahkan pt-16 agar konten tidak tertutup Header yang fixed */}
      <div className="min-h-screen flex flex-col pt-16">

        {/* HERO SECTION */}
        {/* Perubahan di sini: Mengubah items-center (default) menjadi items-start, lalu md:items-center */}
        <section className="flex-1 relative flex items-start md:items-center justify-center md:justify-start text:left px-6 md:px-16 pt-10 md:pt-24 overflow-hidden"> 
          
          {/* 1. Background Ilustrasi untuk MOBILE (Hanya Tampil di Layar Kecil) */}
          <Image
            src="/images/earth-girl-mobile.jpeg" // Menggunakan gambar khusus mobile
            alt="Gadis memegang globe bumi sebagai latar belakang mobile"
            fill
            className="object-cover object-right z-0 md:hidden" // Tampil di mobile, Sembunyi di desktop
            quality={100}
            priority={true} 
          />
          
          {/* 2. Background Ilustrasi untuk DESKTOP (Hanya Tampil di Layar Besar) */}
          <Image
            src="/images/earth-girl.png" 
            alt="Gadis memegang globe bumi sebagai latar belakang desktop"
            fill
            className="object-cover z-0 hidden md:block" // Sembunyi di mobile, Tampil di desktop
            quality={100}
            priority={true} 
          />

          {/* Overlay Teks (Memastikan Teks Terlihat Jelas di atas Gambar) */}
          <div className="absolute inset-0 bg-black/10 md:bg-transparent z-0"></div>

          {/* Konten Teks */}
          {/* Menghapus mb-20 dan menambahkan mt-10 agar tidak terlalu menempel ke Header di mobile */}
          
          <div className="relative max-w-lg space-y-6 z-10 mt-10 md:-mt-40"> 
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-700 leading-tight">
              SATU LANGKAH <br /> SAYANGI <br/> BUMI KITA
            </h1>
            {/* Mengubah background paragraf agar selalu mudah dibaca di atas gambar apa pun */}
            <p className="text-gray-700 text-sm md:text-md lg:text-lg mr-40 md:mr-30 lg:mr-10 bg-white/90 p-3 rounded-2xl">
              <b>GreenHabit</b> adalah teman harianmu dalam aksi peduli lingkungan. Mulai dari kebiasaan terkecil, lihatlah dampak nyata yang telah kamu ciptakan untuk bumi.
            </p>
            <Link href="/tracker">
                <button className=" px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-md hover:bg-blue-700">
                  Mulai Lacak Aksi Hijaumu
                </button>
            </Link>

          </div>
          
        </section>
      </div>
    </div>
  );
}