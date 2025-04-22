'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return window.location='/login';
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchTodos();
  }, [date]);

  async function fetchTodos() {
    const res = await axios.get(`/api/todos?date=${date}`);
    setTodos(res.data);
  }

  async function addTodo() {
    if (!text) return;
    await axios.post('/api/todos', { text, dueDate: date });
    setText('');
    fetchTodos();
  }

  async function deleteTodo(id) {
    await axios.delete(`/api/todos?id=${id}`);
    fetchTodos();
  }

  return (
    <div className="min-h-screen bg-gray-100 text-zinc-900">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white p-6 mt-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">Welcome to ToDo Scheduler!</h1>
        <h1 className="text-2xl font-bold mb-4">Todos for {date}</h1>
        <input 
          type="date" 
          value={date} 
          onChange={e=>setDate(e.target.value)} 
          className="mb-4 w-full border border-zinc-300 text-zinc-900 rounded px-3 py-2" 
        />
        <div className="flex space-x-2 mb-4">
          <input
            className="flex-grow px-3 py-2 border border-zinc-300 text-zinc-900 rounded"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="New task"
          />
          <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add</button>
        </div>
        <ul className="space-y-2">
          {todos.map(t => (
            <li key={t._id} className="flex justify-between items-center border-b border-zinc-300 py-2">
              <span className="text-zinc-900">{t.text}</span>
              <button onClick={() => deleteTodo(t._id)} className="text-red-500 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
