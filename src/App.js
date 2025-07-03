import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";
import ArticleListPage from "./pages/ArticleListPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ReportPage from './pages/ReportPage';
import Notification from './components/Notification';

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeCalculator, setActiveCalculator] = useState("danaDarurat");
  const [activeArticle, setActiveArticle] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userTargets, setUserTargets] = useState([]);
  const [completedTargets, setCompletedTargets] = useState([]);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  const handleNavigate = (page, data = null) => {
    if (page === 'kalkulator' && !isLoggedIn) {
      showNotification('Silakan login untuk mengakses kalkulator.', 'error');
      setCurrentPage('login');
      window.scrollTo(0, 0);
      return;
    }
    setCurrentPage(page);
    if (page === 'kalkulator' && data && data.calculatorId) {
      setActiveCalculator(data.calculatorId);
    } else if (page === 'artikel') {
      setActiveArticle(data);
    } else if (page === 'report') {
      setActiveReport(data);
    }
    window.scrollTo(0, 0);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      handleNavigate('home');
      showNotification('Login berhasil!');
    } else {
      showNotification('Email atau password salah.', 'error');
    }
  };

  const handleRegister = (newUser) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === newUser.email);
    if (existingUser) {
      showNotification('Email sudah terdaftar.', 'error');
      return;
    }
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    showNotification('Registrasi berhasil! Silakan login.');
    handleNavigate('login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    handleNavigate('home');
    showNotification('Anda telah berhasil logout.');
  };

  const handleSaveTarget = (targetData) => {
    if (!currentUser) {
      showNotification('Anda harus login untuk menyimpan target.', 'error');
      handleNavigate('login');
      return;
    }
    if (parseFloat(targetData.terkumpul) >= parseFloat(targetData.target)) {
      const allCompleted = JSON.parse(localStorage.getItem('completedTargets')) || {};
      const userCompleted = allCompleted[currentUser.email] || [];
      const existingCompleted = userCompleted.find(t => t.nama === targetData.nama);
      if (!existingCompleted) {
        userCompleted.push({ ...targetData, status: 'selesai' });
      }
      allCompleted[currentUser.email] = userCompleted;
      localStorage.setItem('completedTargets', JSON.stringify(allCompleted));
      setCompletedTargets(userCompleted);
      const allTargets = JSON.parse(localStorage.getItem('userTargets')) || {};
      let userTargets = allTargets[currentUser.email] || [];
      userTargets = userTargets.filter(t => t.nama !== targetData.nama);
      allTargets[currentUser.email] = userTargets;
      localStorage.setItem('userTargets', JSON.stringify(allTargets));
      setUserTargets(userTargets);
      showNotification('Congrats! Target Anda telah selesai dan masuk ke riwayat.', 'success');
    } else {
      const allTargets = JSON.parse(localStorage.getItem('userTargets')) || {};
      const currentUserTargets = allTargets[currentUser.email] || [];
      const existingTargetIndex = currentUserTargets.findIndex(t => t.nama === targetData.nama);
      let newUserTargets;
      if (existingTargetIndex > -1) {
        newUserTargets = currentUserTargets.map((target, index) => 
          index === existingTargetIndex ? targetData : target
        );
      } else {
        newUserTargets = [...currentUserTargets, targetData];
      }
      allTargets[currentUser.email] = newUserTargets;
      localStorage.setItem('userTargets', JSON.stringify(allTargets));
      setUserTargets(newUserTargets);
      showNotification('Target berhasil disimpan! Anda akan diarahkan ke halaman profil.');
      handleNavigate('profile');
    }
  };

  const handleUpdateTargets = (updatedTargets) => {
    if (!currentUser) return;
    const allTargets = JSON.parse(localStorage.getItem('userTargets')) || {};
    allTargets[currentUser.email] = updatedTargets;
    localStorage.setItem('userTargets', JSON.stringify(allTargets));
    setUserTargets(updatedTargets);
  };

  const handleUpdateProfile = (profileData) => {
    if (!currentUser) return;
    const updatedUser = { 
      ...currentUser, 
      name: profileData.name,
      photoUrl: profileData.photoUrl
    };
    setCurrentUser(updatedUser);
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    showNotification('Profil berhasil diperbarui!');
  };

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      const savedUser = JSON.parse(loggedInUser);
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
      const allTargets = JSON.parse(localStorage.getItem('userTargets')) || {};
      const allCompleted = JSON.parse(localStorage.getItem('completedTargets')) || {};
      const savedTargets = allTargets[savedUser.email] || [];
      const savedCompleted = allCompleted[savedUser.email] || [];
      setUserTargets(savedTargets);
      setCompletedTargets(savedCompleted);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'kalkulator':
        return <CalculatorPage 
          activeCalculator={activeCalculator} 
          onCalculatorChange={setActiveCalculator} 
          onSaveTarget={handleSaveTarget} 
        />;
      case 'edukasi':
        return <ArticleListPage onNavigate={handleNavigate} />;
      case 'artikel':
        return <ArticlePage article={activeArticle} onBack={() => handleNavigate('edukasi')} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage 
          currentUser={currentUser} 
          userTargets={userTargets} 
          onUpdateProfile={handleUpdateProfile}
          onSaveTarget={handleSaveTarget}
        />;
      case 'report':
        return <ReportPage 
          currentUser={currentUser} 
          target={activeReport} 
          onBack={() => handleNavigate('history')} 
        />;
      case 'history':
        return <HistoryPage completedTargets={completedTargets} onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {notification && 
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      }
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-blue-600">
              <button onClick={() => { handleNavigate("home"); setIsMenuOpen(false); }} className="focus:outline-none flex items-center">
                <svg width="42" height="32" viewBox="0 0 105 80" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                  <g>
                      <path d="M2 55 L22 75 L42 55 L62 75 L82 45 L102 25 L108 27 L102 31 L82 49 L62 79 L42 59 L22 79 L2 59 Z" fill="#4C7F4C"/>
                      <path d="M2 50 L22 70 L42 50 L62 70 L82 40 L102 20 L108 22 L102 26 L82 44 L62 74 L42 54 L22 74 L2 54 Z" fill="#89C34A"/>
                      <polygon points="15,42 35,42 35,70 15,70" fill="#29B6F6"/>
                      <polygon points="35,42 40,38 40,66 35,70" fill="#0288D1"/>
                      <polygon points="45,22 65,22 65,70 45,70" fill="#29B6F6"/>
                      <polygon points="65,22 70,18 70,66 65,70" fill="#0288D1"/>
                      <polygon points="75,2 95,2 95,70 75,70" fill="#29B6F6"/>
                      <polygon points="95,2 100,-2 100,66 95,70" fill="#0288D1"/>
                  </g>
                </svg>
                <span>FinanKu</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button onClick={() => handleNavigate("home")} className="text-slate-700 hover:text-blue-600 font-semibold px-3 py-2 rounded-md">Beranda</button>
              <button onClick={() => handleNavigate("kalkulator")} className="text-slate-700 hover:text-blue-600 font-semibold px-3 py-2 rounded-md">Kalkulator</button>
              <button onClick={() => handleNavigate("edukasi")} className="text-slate-700 hover:text-blue-600 font-semibold px-3 py-2 rounded-md">Edukasi</button>
              <button onClick={() => handleNavigate("about")} className="text-slate-700 hover:text-blue-600 font-semibold px-3 py-2 rounded-md">Tentang Kami</button>
              
              {!isLoggedIn ? (
                <>
                  <button onClick={() => handleNavigate('login')} className="text-slate-700 hover:text-blue-600 font-semibold px-3 py-2 rounded-md">Login</button>
                  <button onClick={() => handleNavigate('register')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md transition duration-300">Daftar</button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <button 
                      onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-3 hover:bg-slate-100 p-1 rounded-full transition-colors duration-200"
                    >
                      <img 
                        src={currentUser.photoUrl || `https://ui-avatars.com/api/?name=${currentUser.name.replace(' ', '+')}&background=0D8ABC&color=fff&size=32`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                      />
                      <span className="font-semibold text-slate-700 pr-3 hidden sm:inline">{currentUser.name}</span>
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <button
                          onClick={() => { handleNavigate('profile'); setProfileDropdownOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Profil Saya
                        </button>
                        <button
                          onClick={() => { handleNavigate('history'); setProfileDropdownOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Riwayat
                        </button>
                        <button
                          onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-lg">
              <div className="pt-2 pb-4 flex flex-col items-start space-y-2">
                <button onClick={() => { handleNavigate("home"); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Beranda</button>
                <button onClick={() => { handleNavigate("kalkulator"); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Kalkulator</button>
                <button onClick={() => { handleNavigate("edukasi"); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Edukasi</button>
                <button onClick={() => { handleNavigate("about"); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Tentang Kami</button>
                
                <hr className="w-full border-t border-slate-200 my-2" />
                {!isLoggedIn ? (
                  <>
                    <button onClick={() => { handleNavigate('login'); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Login</button>
                    <button onClick={() => { handleNavigate('register'); setIsMenuOpen(false); }} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md transition duration-300 w-full mt-2">Daftar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { handleNavigate("history"); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Riwayat</button>
                    <button onClick={() => { handleNavigate('profile'); setIsMenuOpen(false); }} className="flex items-center space-x-3 py-2 rounded-md w-full text-left">
                      <img 
                        src={currentUser.photoUrl || `https://ui-avatars.com/api/?name=${currentUser.name.replace(' ', '+')}&background=0D8ABC&color=fff&size=32`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                      />
                      <span className="font-semibold text-slate-700">{currentUser.name}</span>
                    </button>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-slate-700 hover:text-blue-600 font-semibold py-2 rounded-md w-full text-left">Logout</button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="pb-12">
        {renderPage()}
      </main>

      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 FinanKu. Dibuat oleh Kelompok 24. Semua Hak Cipta Dilindungi.</p>
        </div>
      </footer>

      {showScroll && (
        <button
          onClick={scrollTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default App;
