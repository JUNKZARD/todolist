"use client";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  dead_line: string; // Menyesuaikan snake_case nama kolom database kamu
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, status: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
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
    <div
      className={`flex items-center justify-between p-5 rounded-2xl shadow-sm transition-all hover:shadow-md ${getCardStyle(
        todo.priority
      )}`}
    >
      <div className="flex items-center gap-5">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          className="w-6 h-6 accent-indigo-600 cursor-pointer"
        />
        <div className="text-slate-800">
          <h3
            className={`text-lg font-bold ${
              todo.completed ? "line-through text-slate-400" : "text-slate-800"
            }`}
          >
            {todo.text}
          </h3>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
            📅{" "}
            {todo.dead_line
              ? new Date(todo.dead_line).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Makassar", // Memaksa browser menampilkan zona waktu WITA dengan akurat
                })
              : "Tidak ada tenggat"}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      >
        🗑️
      </button>
    </div>
  );
}
