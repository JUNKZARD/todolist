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
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 mb-10 text-slate-800">
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
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          Tambah Tugas
        </button>
      </div>
    </div>
  );
}