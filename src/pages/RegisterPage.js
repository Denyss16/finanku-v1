import React, { useState } from 'react';

export default function RegisterPage({ onRegister, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Silakan lengkapi semua kolom.');
      return;
    }
    onRegister({ name, email, password });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Daftar Akun FinanKu</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-6">
          <label htmlFor="name" className="block text-slate-700 font-semibold mb-2">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Anda"
          />
        </div>
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
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Daftar
        </button>
      </form>
      <p className="text-center mt-6 text-slate-600">
        Sudah punya akun?{' '}
        <button onClick={() => onNavigate('login')} className="text-orange-500 hover:text-orange-600 hover:underline font-semibold">
          Login di sini
        </button>
      </p>
    </div>
  );
}
