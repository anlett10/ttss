import { createFileRoute, Outlet } from '@tanstack/react-router';
import { triplitRoute } from '@triplit/tanstack';
import { triplit } from '@/triplit/triplitClient';
import type { QueryBuilder, CollectionQuery, WithInclusion, Models } from '@triplit/client';
import { type Todo } from '@/triplit/schema';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// ✅ Reusable form component
function TodoForm({
  onSubmit,
  value,
  onChange,
}: {
  onSubmit: (e: React.FormEvent) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mb-6 flex items-center space-x-2">
      <Input
        value={value}
        onChange={onChange}
        placeholder="Add a new task..."
      />
      <Button type="submit" disabled={!value.trim()}>
        Add
      </Button>
    </form>
  );
}

type TodosProps = {
  results: Todo[];
  error: unknown;
  updateQuery: (
    newQuery: QueryBuilder<
      Models,
      'todos',
      WithInclusion<CollectionQuery<Models, 'todos'>, never>
    >
  ) => void;
};

// ✅ Main component
function Todos({ results }: TodosProps) {
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
  
    await triplit.insert('todos', {
      text,
      completed: false,
      created_at: new Date().toISOString(), // ⬅️ Set timestamp
    });
  
    setNewTodo("");
  }, [newTodo]);  

  const toggleCompleted = useCallback(async (todo: Todo) => {
    await triplit.update('todos', todo.id, { completed: !todo.completed });
  }, []);

  const deleteTodo = useCallback(async (todo: Todo) => {
    await triplit.delete('todos', todo.id);
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg py-10">
      <Card>
        <CardHeader>
          <CardTitle>TODO List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <TodoForm
            onSubmit={handleAddTodo}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          {results.length === 0 ? (
            <div>Todo not found</div>
          ) : (
            <ul>
              {results.map((todo) => (
                <li key={todo.id} className="mb-4 p-2 border rounded">
                  <div className="font-bold">{todo.text}</div>
                  <div>Status: {todo.completed ? '✅ Completed' : '❌ Not Completed'}</div>
                  <div>Created: {new Date(Number(todo.created_at)).toLocaleString()}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => toggleCompleted(todo)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Toggle Complete
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this todo?")) {
                          deleteTodo(todo);
                        }
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Outlet />
    </div>
  );
}

function TodosWrapper(props: {
  results: Record<string, any>[];
  error: unknown;
  updateQuery: (q: any) => void;
}) {
  const typedResults = props.results.map((todo: any) => ({
    ...todo,
    created_at: new Date(todo.created_at),
  })) as Todo[];

  return (
    <Todos
      results={typedResults}
      error={props.error}
      updateQuery={props.updateQuery}
    />
  );
}

// ✅ Route export
export const Route = createFileRoute('/_authed/todos')(
  triplitRoute(triplit, () => triplit.query('todos'), TodosWrapper)
);
