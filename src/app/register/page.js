"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await registerUser(name, email, password);
    setLoading(false);
    if (res.ok) {
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        src="/images/welcoming-home-page.jpg"
        alt="Welcoming"
        className="fixed top-0 left-0 w-full h-full object-cover blur-lg scale-105"
        style={{ objectPosition: "center", zIndex: 0 }}
      />
      <div className="relative z-10 card w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Register"}
          </button>
        </form>
        <div className="text-center text-sm">
          Sudah punya akun?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
