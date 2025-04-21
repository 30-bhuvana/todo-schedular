'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded" />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Sign Up</button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
      </div>
    </div>
  );
}