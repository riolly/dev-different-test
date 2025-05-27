"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface Todo {
  id: string;
  user_id: string;
  task: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function UserTodos() {
  const authResult = useAuth();
  const { user, loading: authLoading } = authResult;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchTodos = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error);
      } else {
        setTodos((data as Todo[]) || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      void fetchTodos();
    }
  }, [user, fetchTodos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.trim()) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data, error } = await supabase
        .from("todos")
        .insert([{ task: newTask, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error("Error adding todo:", error);
      } else if (data) {
        setTodos([data as Todo, ...todos]);
        setNewTask("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) {
        console.error("Error updating todo:", error);
      } else {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo,
          ),
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        console.error("Error deleting todo:", error);
      } else {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (authLoading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-white">Please log in to view your todos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">My Todos</h2>
        <p className="text-sm text-white/70">
          This demonstrates RLS - you can only see your own todos!
        </p>
      </div>

      <form onSubmit={(e) => void addTodo(e)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="newTask"
            className="block text-sm font-semibold text-white"
          >
            Add New Todo
          </label>
          <div className="flex gap-3">
            <Input
              id="newTask"
              type="text"
              variant="default"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newTask.trim()}
              className="bg-white font-semibold text-black hover:bg-gray-100 disabled:opacity-50"
            >
              Add
            </Button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="py-8 text-center">
          <p className="text-white/70">Loading todos...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/60">No todos yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => {
                    e.preventDefault();
                    void toggleTodo(todo.id, todo.completed);
                  }}
                  className="h-4 w-4 rounded border-white/30 bg-white/20 text-white focus:ring-white/50"
                />
                <span
                  className={`flex-1 text-white ${
                    todo.completed ? "text-white/50 line-through" : ""
                  }`}
                >
                  {todo.task}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    void deleteTodo(todo.id);
                  }}
                  className="border-red-500/50 bg-red-500/20 text-red-300 hover:border-red-400 hover:bg-red-500/30"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
