import React, { useState } from 'react';

export default function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Silakan isi alamat email Anda.');
      return;
    }
    // Logika untuk mengirim email reset password akan ditambahkan di sini
    alert(`Tautan reset password telah dikirim ke ${email}`);
    onNavigate('login'); // Kembali ke halaman login setelah submit
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Lupa Password</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        <p className="text-center mb-6 text-slate-600">
          Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>
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
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kirim Tautan Reset
        </button>
      </form>
      <p className="text-center mt-6 text-slate-600">
        Kembali ke{' '}
        <button onClick={() => onNavigate('login')} className="text-orange-500 hover:text-orange-600 hover:underline font-semibold">
          Login
        </button>
      </p>
    </div>
  );
}
