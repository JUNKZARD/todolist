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
      <p className="text-center text-slate-400 dark:text-slate-500 animate-pulse py-10 transition-colors">
        Menunggu tugas...
      </p>
    );
  }

 
  if (todos.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <p className="text-slate-400 dark:text-slate-500 font-medium">
          Semua tugas beres, waktunya istirahat.
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
