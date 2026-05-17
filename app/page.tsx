"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  deadline: string;
} 

export default function PanduFlow() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchTodos() {
    setLoading(true);
    const { data } = await supabase
      .from("todos")
      .select("*")
      .order("priority", { ascending: false });

    if (data) {
      setTodos(data);
    }
    setLoading(false);
  }

 useEffect(() => {
    const fetchData = async () => {
      await fetchTodos();
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!task.trim() || !deadline) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: task, priority, deadline, completed: false }])
      .select();

    if (!error && data) {
      setTodos([data[0], ...todos]);
      setTask("");
      setDeadline("");
    }
  };

  const toggleComplete = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (!error) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !currentStatus } : t
        )
      );
    }
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) setTodos(todos.filter((t) => t.id !== id));
  };

  // Helper untuk warna prioritas
  const getCardStyle = (p: string) => {
    switch (p) {
      case "High":
        return "border-l-8 border-red-500 bg-red-50";
      case "Medium":
        return "border-l-8 border-yellow-500 bg-yellow-50";
      case "Low":
        return "border-l-8 border-green-500 bg-green-50";
      default:
        return "bg-white";
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-10 flex flex-col items-center text-slate-800">
      <div className="w-full max-w-3xl">
        {/* Header Personal */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-indigo-700 tracking-tight">
            PanduFlow.
          </h1>
          <p className="text-slate-500 font-medium italic">
            Navigating your tasks, Gung Pandu.
          </p>
        </header>

        {/* Form Input */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="md:col-span-3 p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Apa tugas kampus hari ini?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <select
              className="p-4 bg-slate-50 border rounded-2xl outline-none cursor-pointer"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>
            <input
              type="datetime-local"
              className="p-4 bg-slate-50 border rounded-2xl outline-none flex-1"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              Tambah Tugas
            </button>
          </div>
        </div>

        {/* List Tugas */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-slate-400 animate-pulse">
              Menghubungkan ke database...
            </p>
          ) : (
            todos
              .sort((a) => (a.priority === "High" ? -1 : 1))
              .map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-5 rounded-2xl shadow-sm transition-all hover:shadow-md ${getCardStyle(
                    todo.priority
                  )}`}
                >
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.completed)}
                      className="w-6 h-6 accent-indigo-600 cursor-pointer"
                    />
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          todo.completed
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {todo.text}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                        📅{" "}
                        {new Date(todo.deadline).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    🗑️
                  </button>
                </div>
              ))
          )}
          {!loading && todos.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">
                Semua tugas beres, Gung! Waktunya istirahat.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
