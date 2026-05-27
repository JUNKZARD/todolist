"use client";

import TodoItem from "./TodoItem";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  dead_line: string;
}

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: number, status: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({
  todos,
  loading,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (loading) {
    return (
      <p className="text-center text-slate-400 animate-pulse py-10">
        Memuat data dari database...
      </p>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400">
          Semua tugas beres, Waktunya istirahat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos
        .sort((a) => (a.priority === "High" ? -1 : 1))
        .map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}
