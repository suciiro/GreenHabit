import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '700'], // Pilih ketebalan yang diinginkan (contoh: normal dan bold)
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins', // Mendefinisikan variabel CSS
});


    

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GreenHabit",
  icons: {
    icon: "/favicon.ico",   
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      
    </html>
  );
}
