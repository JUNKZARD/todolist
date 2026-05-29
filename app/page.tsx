"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AuthForm from "./components/AuthForm";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { Session } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  dead_line: string;
  user_id: string;
}

export default function PanduFlow() {
  const [session, setSession] = useState<Session | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);

  // --- DARK MODE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };
  // --- DARK MODE ---

  // 1. Validasi Sesi Pengguna secara Real-Time
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Muat Data Otomatis saat Sesi Terdeteksi
  useEffect(() => {
    if (session?.user) {
      fetchTodos();
    }
  }, [session]);

  // [READ]
  async function fetchTodos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("completed", false)
      .order("id", { ascending: false });

    if (!error && data) {
      setTodos(data);
      // Jalankan pengecekan notifikasi di sini
      cekTenggatWaktuTugas(data);
    }
    setLoading(false);
  }

  // Fungsi Pengecekan Notifikasi Waktu Kritis & Expired
  const cekTenggatWaktuTugas = (daftarTugas: Todo[]) => {
    const sekarang = new Date().getTime();

    daftarTugas.forEach((todo) => {
      if (!todo.dead_line) return;

      const dateObj = new Date(todo.dead_line);
      const waktuTenggat = dateObj.getTime();
      const selisihWaktu = waktuTenggat - sekarang;

      // 1. Jika tugas sudah LEWAT/EXPIRED
      if (selisihWaktu < 0) {
        toast.error(`⚠️ Tugas "${todo.text}"  melewati batas waktu!`, {
          duration: 6000,
          id: `expired-${todo.id}`, // Cegah pop-up ganda
        });
      }
      // 2. Jika tugas KRITIS (Kurang dari 2 jam lagi)
      else if (selisihWaktu > 0 && selisihWaktu <= 2 * 60 * 60 * 1000) {
        toast(
          `⏰ Pengingat: Tugas "${todo.text}" akan berakhir kurang dari 2 jam lagi!`,
          {
            icon: "⏳",
            duration: 6000,
            id: `kritis-${todo.id}`,
          }
        );
      }
    });
  };

  // [CREATE]
  const handleAdd = async (
    task: string,
    priority: string,
    deadline: string
  ) => {
    if (!session?.user) return;

    const formattedDeadline = new Date(deadline).toISOString();

    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          text: task,
          priority,
          dead_line: formattedDeadline,
          completed: false,
          user_id: session.user.id,
        },
      ])
      .select();

    if (!error && data) setTodos([data[0], ...todos]);
  };

  // [UPDATE] - Optimistic Update
  const toggleComplete = async (id: number, currentStatus: boolean) => {
    const previousTodos = [...todos];
    // Langsung hilangkan dari UI
    setTodos(todos.filter((t) => t.id !== id));

    const { error } = await supabase
      .from("todos")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Gagal memperbarui database:", error.message);
      setTodos(previousTodos); // Rollback jika error
      alert("Koneksi gagal, silakan coba lagi!");
    }
  };

  // [DELETE] - Optimistic Update
  const deleteTodo = async (id: number) => {
    const previousTodos = [...todos];
    // Langsung hilangkan dari UI
    setTodos(todos.filter((t) => t.id !== id));

    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Gagal menghapus data:", error.message);
      setTodos(previousTodos); // Rollback jika error
    }
  };

  // Fungsi Keluar Sistem
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setTodos([]);
  };

  // Layar Loading Awal
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500 font-medium animate-pulse">
        Memeriksa autentikasi...
      </div>
    );
  }

  // Tampilan Utama
  return (
    // 💡 Perhatikan tambahan class "dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300"
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 p-4 md:p-10 flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
      {!session ? (
        <AuthForm onSessionActive={fetchTodos} />
      ) : (
        <div className="w-full max-w-3xl">
          {/* Dashboard Header */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-indigo-700 dark:text-indigo-400 tracking-tight">
                To do List App
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                Logged in as: {session.user?.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleDarkMode}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-2xl text-sm transition-all shadow-sm"
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 font-bold px-5 py-2 rounded-2xl text-sm transition-all"
              >
                Logout
              </button>
            </div>
          </header>

          <TodoForm onAdd={handleAdd} />

          <TodoList
            todos={todos}
            loading={loading}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
          />
        </div>
      )}
    </main>
  );
}
