import express from 'express';
import { db } from './db.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/todos', (_req, res) => {
  const todos = db.prepare('SELECT id, title, completed, created_at FROM todos ORDER BY id DESC').all();
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title || title.length > 200) {
    return res.status(400).json({ error: 'Title must contain 1 to 200 characters.' });
  }
  const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);
  const todo = db.prepare('SELECT id, title, completed, created_at FROM todos WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const completed = req.body?.completed;
  if (!Number.isSafeInteger(id) || id < 1 || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'A valid id and boolean completed value are required.' });
  }
  const result = db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  if (result.changes === 0) return res.status(404).json({ error: 'Todo not found.' });
  return res.json(db.prepare('SELECT id, title, completed, created_at FROM todos WHERE id = ?').get(id));
});

app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid todo id.' });
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Todo not found.' });
  return res.status(204).end();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Todo API listening on http://localhost:${port}`));
}

export default app;
