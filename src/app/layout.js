import "../styles/globals.css";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RoadCare – Road Damage Report",
  description: "Website pelaporan jalan rusak berbasis lokasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-900`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
