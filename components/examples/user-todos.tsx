"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4">
        <p>Please log in to view your todos.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-4 text-2xl font-bold">My Todos</h2>
      <p className="mb-4 text-sm text-gray-600">
        This demonstrates RLS - you can only see your own todos!
      </p>

      <form onSubmit={(e) => void addTodo(e)} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={!newTask.trim()}>
            Add
          </Button>
        </div>
      </form>

      {loading ? (
        <div>Loading todos...</div>
      ) : (
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500">No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-2 rounded-md border p-3"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => {
                    e.preventDefault();
                    void toggleTodo(todo.id, todo.completed);
                  }}
                  className="rounded"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? "text-gray-500 line-through" : ""
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
                  className="text-red-600 hover:text-red-700"
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
