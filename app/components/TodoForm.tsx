"use client";

import { useState } from "react";

interface TodoFormProps {
  onAdd: (task: string, priority: string, deadline: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = () => {
    if (!task.trim() || !deadline) return;
    onAdd(task, priority, deadline);
    setTask("");
    setDeadline("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 mb-10 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="md:col-span-3 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder-slate-400 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 transition-colors"
          placeholder="Apa tugas kamu hari ini?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <select
          className="p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none cursor-pointer text-slate-800 dark:text-slate-100 transition-colors"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">🔴 High Priority</option>
          <option value="Medium">🟡 Medium Priority</option>
          <option value="Low">🟢 Low Priority</option>
        </select>

        <input
          type="datetime-local"
          className="p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none flex-1 text-slate-800 dark:text-slate-100 transition-colors"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95"
        >
          Tambah Tugas
        </button>
      </div>
    </div>
  );
}
