"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AuthForm from "./components/AuthForm";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
// 1. Import tipe data Session resmi dari SDK Supabase
import { Session } from "@supabase/supabase-js";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  dead_line: string;
  user_id: string;
}

export default function PanduFlow() {
  // 2. Ganti tipe <any> menjadi <Session | null> agar sesuai standar TypeScript
  const [session, setSession] = useState<Session | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);

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
      .order("id", { ascending: false });

    if (!error && data) setTodos(data);
    setLoading(false);
  }

  // [CREATE]
  const handleAdd = async (
    task: string,
    priority: string,
    deadline: string
  ) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          text: task,
          priority,
          dead_line: deadline,
          completed: false,
          user_id: session.user.id,
        },
      ])
      .select();

    if (!error && data) setTodos([data[0], ...todos]);
  };

  // [UPDATE]
  const toggleComplete = async (id: number, currentStatus: boolean) => {
    const previousTodos = [...todos];
    setTodos(todos.filter((t) => t.id !== id));
    const { error } = await supabase
      .from("todos")
      .update({ completed: !currentStatus })
      .eq("id", id);
    if (error) {
      console.error("Gagal memperbarui database:", error.message);
      setTodos(previousTodos);
      alert("Koneksi gagal, silakan coba lagi!");
    }
  };

  // DELETE
  const deleteTodo = async (id: number) => {
    const previousTodos = [...todos];
    setTodos(todos.filter((t) => t.id !== id));
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Gagal menghapus data:", error.message);
      setTodos(previousTodos);
    }
  };

  // Fungsi Keluar Sistem
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setTodos([]);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500 font-medium animate-pulse">
        Memeriksa autentikasi...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-10 flex flex-col items-center justify-center text-slate-800">
      {!session ? (
        <AuthForm onSessionActive={fetchTodos} />
      ) : (
        <div className="w-full max-w-3xl">
          {/* Dashboard Header */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-indigo-700 tracking-tight">
                To do List App
              </h1>
              <p className="text-slate-500 font-medium italic">
                Logged in as: {session.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-5 py-2 rounded-2xl text-sm transition-all"
            >
              Logout
            </button>
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
