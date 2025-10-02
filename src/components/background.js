'use client'
import Image from "next/image";

export default function Background () {
    return (
        // Gunakan 'fixed inset-0' untuk menutupi seluruh viewport dan menguncinya.
        // z-0 memastikan gambar ini adalah lapisan paling belakang.
        <div className="fixed inset-0 z-0"> 
            <Image
                // Asumsi: Gambar '/images/background.png' sudah disiapkan untuk resolusi tinggi
                // dan bisa bekerja baik di mobile maupun desktop.
                src="/images/background.png" 
                alt="Latar belakang penuh layar yang responsif"
                fill
                // object-cover memastikan gambar mengisi seluruh wadah tanpa distorsi
                className="object-cover w-full h-full" 
                quality={100}
                priority={true} 
            />
        </div>
    )
}
