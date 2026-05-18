"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface AuthFormProps {
  onSessionActive: () => void;
}

export default function AuthForm({ onSessionActive }: AuthFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("✅ Registrasi berhasil! Silakan cek email kamu untuk konfirmasi atau coba langsung masuk.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        onSessionActive();
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-slate-800">
      <h2 className="text-3xl font-black text-indigo-700 mb-2 text-center">
        {isRegister ? "Buat Akun" : "Selamat Datang"}
      </h2>
      <p className="text-slate-500 text-sm text-center mb-6">
        {isRegister ? "Daftar untuk mulai mengelola tugas kuliahmu." : "Masuk ke akun PanduFlow milikmu."}
      </p>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Email</label>
          <input
            type="email"
            className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="nama@kampus.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Password</label>
          <input
            type="password"
            className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Memproses..." : isRegister ? "Daftar Akun" : "Masuk"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-center font-medium text-slate-600">{message}</p>}

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          {isRegister ? "Sudah punya akun? Masuk di sini" : "Belum punya akun? Daftar di sini"}
        </button>
      </div>
    </div>
  );
}