'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <nav className="bg-zinc-800 text-white px-6 py-3 md:px-14 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold">Todo List</Link>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 px-4 md:px-7 py-2 rounded">Logout</button>
    </nav>
  );
}