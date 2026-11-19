import { useEffect, useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  async function loadTodos() {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Could not load todos');
      setTodos(await response.json());
      setError('');
    } catch {
      setError('Unable to reach the API. Is the server running?');
    }
  }

  useEffect(() => { loadTodos(); }, []);

  async function addTodo(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: cleanTitle }),
    });
    if (response.ok) {
      setTitle('');
      await loadTodos();
    } else {
      setError('Could not add todo. Keep the title under 200 characters.');
    }
  }

  async function toggleTodo(todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    await loadTodos();
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    await loadTodos();
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">REACT + NODE + SQLITE</p>
        <h1>My Todo List</h1>
        <p className="subtitle">A small app for demonstrating automated security checks.</p>
      </header>
      <form onSubmit={addTodo} className="add-form">
        <input
          aria-label="New todo"
          maxLength={200}
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add todo</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      <section aria-label="Todo items">
        {todos.length === 0 ? <p className="empty">No todos yet. Add your first task.</p> : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <label className={todo.completed ? 'completed' : ''}>
                  <input type="checkbox" checked={Boolean(todo.completed)} onChange={() => toggleTodo(todo)} />
                  <span>{todo.title}</span>
                </label>
                <button className="delete" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer>{todos.filter((todo) => !todo.completed).length} task(s) remaining</footer>
    </main>
  );
}
