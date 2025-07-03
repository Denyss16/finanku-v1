import React, { useState } from 'react';

export default function LoginPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      alert('Silakan isi email dan password.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Login ke FinanKu</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-6">
          <label htmlFor="email" className="block text-slate-700 font-semibold mb-2">Alamat Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contoh@email.com"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-slate-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          <div className="text-right mt-2">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
            >
              Lupa Password?
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-6 text-slate-600">
        Belum punya akun?{' '}
        <button onClick={() => onNavigate('register')} className="text-orange-500 hover:text-orange-600 hover:underline font-semibold">
          Daftar di sini
        </button>
      </p>
    </div>
  );
}
