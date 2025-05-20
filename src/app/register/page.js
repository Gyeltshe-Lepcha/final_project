'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, router]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match!");
      setSuccessMsg('');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong!');
        setSuccessMsg('');
        setLoading(false);
        return;
      }

      setSuccessMsg(`Registration successful! Welcome, ${name}. Redirecting you to login...`);
      setErrorMsg('');
      setName('');
      setContact('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg('Failed to register. Please try again.');
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Lama Restaurant</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-green-900 p-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl p-8 shadow-xl w-full max-w-md text-white">
          <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">📝 Lama Restaurant Sign Up</h1>

          {errorMsg && <p className="text-red-400 mb-4 text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 mb-4 text-center">{successMsg}</p>}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Contact</label>
              <input
                type="tel"
                autoComplete="tel"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="+1 234 567 8900"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

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
                autoComplete="new-password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Confirm Password</label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
