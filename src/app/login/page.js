'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed');
        return;
      }

      if (data.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/user');
      }
    } catch (error) {
      setErrorMsg('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Lama Restaurant</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-green-900 p-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl p-8 shadow-xl w-full max-w-md text-white">
          <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">👨‍🍳 Lama Restaurant Login</h1>

          {errorMsg && <p className="text-red-400 mb-4 text-center">{errorMsg}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-yellow-500 transition text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-yellow-400/50 ${
                loading ? 'opacity-70 cursor-not-allowed hover:shadow-none' : 'hover:bg-yellow-600'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-yellow-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
