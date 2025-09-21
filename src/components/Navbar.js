"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../lib/auth";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary text-white grid place-items-center font-bold">
            R
          </div>
          <span className="text-lg font-semibold">RoadCare</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-primary px-3 py-2 rounded-lg">
            Home
          </Link>
          <Link href="/report" className="hover:text-primary px-3 py-2 rounded-lg">
            Tambah Laporan
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-2 rounded-lg bg-primary text-white hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                {user.name}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow">
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      router.replace("/");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-danger"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu */}
          <button
            className="md:hidden px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => router.push("/map")}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
