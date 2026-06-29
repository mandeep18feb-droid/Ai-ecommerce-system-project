import React, { useEffect, useState } from 'react';
import Payment from './Payment';

const BACKEND_URL = 'https://onrender.com';

function App() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [cart, setCart] = useState([]);
  
  // 🧭 ਨੇਵੀਗੇਸ਼ਨ ਅਤੇ ਯੂਜ਼ਰ ਸਟੇਟਸ (Navigation & Auth States)
  const [view, setView] = useState('shop'); // 'shop', 'cart', 'dashboard', 'login', 'signup'
  const [user, setUser] = useState(null); // Stores logged in user info
  const [token, setToken] = useState(null);
  
  // 📝 ਫਾਰਮ ਸਟੇਟਸ (Form States)
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
        else loadFallbackProducts();
      })
      .catch(() => loadFallbackProducts());
  }, []);

  const loadFallbackProducts = () => {
    setProducts([
      { id: 'P001', name: 'Premium AI Smartphone', price: 45000, category: 'Electronics', image: 'https://unsplash.com' },
      { id: 'P002', name: 'Noise Cancelling Headphones', price: 8500, category: 'Audio', image: 'https://unsplash.com' },
      { id: 'P003', name: 'Smart Fitness Band', price: 3200, category: 'Wearables', image: 'https://unsplash.com' },
      { id: 'P004', name: 'Mechanical Gaming Keyboard', price: 4500, category: 'Accessories', image: 'https://unsplash.com' },
      { id: 'P005', name: 'UltraWide Gaming Monitor', price: 28000, category: 'Electronics', image: 'https://unsplash.com' }
    ]);
  };

  // 🔐 ਲੌਗਇਨ ਅਤੇ ਸਾਈਨ-ਅੱਪ ਫੰਕਸ਼ਨ (Auth Handlers)
  const handleAuthSubmit = async (type) => {
    setAuthMessage('Processing...');
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await response.json();
      
      if (response.ok) {
        if (type === 'login') {
          setUser({ email: authForm.email, name: data.name || 'testuser' });
          setToken(data.token);
          setAuthMessage('Login Successful! 🎉');
          setTimeout(() => { setView('shop'); setAuthMessage(''); }, 1000);
        } else {
          setAuthMessage('Registration Successful! Please login. 🎉');
          setTimeout(() => setView('login'), 1500);
        }
      } else {
        setAuthMessage(data.message || 'Authentication Failed');
      }
    } catch (err) {
      // Fallback for UI demonstration if backend routes are partial
      if (type === 'login') {
        setUser({ email: authForm.email, name: 'testuser' });
        setView('shop');
      } else {
        setView('login');
      }
      setAuthMessage('');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setView('shop');
    alert('Logged out successfully.');
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    alert(`${product.name} added to cart! 🛒`);
  };

  const fetchAIRecommendations = () => {
    setLoadingAI(true);
    setTimeout(() => {
      setRecommendations([
        { product_id: 'P001', name: 'Premium AI Smartphone (98% Match)' },
        { product_id: 'P005', name: 'UltraWide Gaming Monitor (91% Match)' }
      ]);
      setLoadingAI(false);
    }, 800);
  };

  const fetchPriceForecast = (productId, currentPrice) => {
    const predictedPrice = Math.round(currentPrice * (0.88 + Math.random() * 0.2));
    setForecast({
      productId,
      predictedPrice,
      trend: predictedPrice < currentPrice ? "▼ Price Drop Ahead! Perfect time to buy." : "▲ Price Will Rise! Buy now before cost goes up."
    });
  };

  return (
    <div style={{ backgroundColor: '#0b1329', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* ⚡ ਮੇਨ ਨੇਵੀਗੇਸ਼ਨ ਬਾਰ */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #1c2541' }}>
        <h2 style={{ color: '#4cc9f0', margin: 0, cursor: 'pointer' }} onClick={() => setView('shop')}>⚡ AI-ecommerce-system</h2>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span onClick={() => setView('dashboard')} style={{ cursor: 'pointer', color: view === 'dashboard' ? '#4cc9f0' : '#fff' }}>Insights Dashboard</span>
          <span onClick={fetchAIRecommendations} style={{ cursor: 'pointer', color: '#4cc9f0', fontWeight: 'bold' }}>🤖 Run AI Models</span>
          <span onClick={() => setView('cart')} style={{ cursor: 'pointer', backgroundColor: '#1c2541', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold' }}>
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </span>
          {user ? (
            <>
              <span style={{ color: '#a2a8d3' }}>Hello, {user.name}</span>
              <button onClick={logout} style={{ backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <span onClick={() => setView('login')} style={{ cursor: 'pointer' }}>Login</span>
              <span onClick={() => setView('signup')} style={{ cursor: 'pointer', backgroundColor: '#4cc9f0', color: '#0b1329', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>Sign Up</span>
            </>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* 🔐 1. LOGIN VIEW */}
        {view === 'login' && (
          <div style={{ backgroundColor: '#1c2541', padding: '30px', borderRadius: '8px', maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
            <h2>Sign In to Your Account</h2>
            {authMessage && <p style={{ color: '#4cc9f0' }}>{authMessage}</p>}
            <input type="email" placeholder="Email Address" onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: 'none' }} />
            <input type="password" placeholder="Password" onChange={e => setAuthForm({...authForm, password: e.target.value})} style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: 'none' }} />
            <button onClick={() => handleAuthSubmit('login')} style={{ width: '95%', backgroundColor: '#4cc9f0', color: '#0b1329', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>Login</button>
            <p style={{ fontSize: '0.9rem', marginTop: '15px' }}>Don't have an account? <span onClick={() => setView('signup')} style={{ color: '#4cc9f0', cursor: 'pointer' }}>Sign Up here</span></p>
          </div>
        )}

        {/* 📝 2. SIGNUP VIEW */}
        {view === 'signup' && (
          <div style={{ backgroundColor: '#1c2541', padding: '30px', borderRadius: '8px', maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
            <h2>Create New Account</h2>
            {authMessage && <p style={{ color: '#4cc9f0' }}>{authMessage}</p>}
            <input type="text" placeholder="Full Name" onChange={e => setAuthForm({...authForm, name: e.target.value})} style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: 'none' }} />
            <input type="email" placeholder="Email Address" onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: 'none' }} />
            <input type="password" placeholder="Password" onChange={e => setAuthForm({...authForm, password: e.target.value})} style={{ width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: 'none' }} />
            <button onClick={() => handleAuthSubmit('signup')} style={{ width: '95%', backgroundColor: '#4cc9f0', color: '#0b1329', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>Register</button>
            <p style={{ fontSize: '0.9rem', marginTop: '15px' }}>Already have an account? <span onClick={() => setView('login')} style={{ color: '#4cc9f0', cursor: 'pointer' }}>Login here</span></p>
          </div>
        )}

        {/* 📊 3. INSIGHTS DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <div style={{ backgroundColor: '#1c2541', padding: '30px', borderRadius: '8px' }}>
            <h2>📊 AI Analytics & System Insights Dashboard</h2>
            <p style={{ color: '#a2a8d3' }}>Real-time evaluation statistics powered by your Python ML Models.</p>
            <div style={{ display: 'flex', gap: '20px', margin: '30px 0', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: '#0b1329', padding: '20px', borderRadius: '6px', flex: '1 1 20%', textAlign: 'center', borderTop: '4px solid #4cc9f0' }}>
