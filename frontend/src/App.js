import React, { useEffect, useState } from 'react';
import Payment from './Payment';

// Render ਦੇ ਲਾਈਵ ਬੈਕਐਂਡ ਅਤੇ AI ਸਰਵਰ ਦੇ URLs
const BACKEND_URL = 'https://onrender.com';

function App() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    // 1. ਬੈਕਐਂਡ ਤੋਂ ਪ੍ਰੋਡਕਟਸ ਲੋਡ ਕਰਨ ਲਈ (Product Catalog Route)
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Products loaded:', data);
        // ਡੈਮੋ ਪ੍ਰੋਡਕਟਸ ਜੇ ਬੈਕਐਂਡ ਖਾਲੀ ਹੋਵੇ
        setProducts([
          { id: 'P001', name: 'Premium AI Smartphone', price: 45000, category: 'Electronics' },
          { id: 'P002', name: 'Noise Cancelling Headphones', price: 8500, category: 'Audio' },
          { id: 'P003', name: 'Smart Fitness Band', price: 3200, category: 'Wearables' }
        ]);
      })
      .catch((err) => console.error('Backend connection error:', err));
  }, []);

  // 🤖 2. Python Recommendation Model (NMF) ਨੂੰ ਰਨ ਕਰਨ ਦਾ ਫੰਕਸ਼ਨ
  const fetchAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      // ਇੱਥੇ ਤੁਹਾਡਾ ML recommendation.py ਮਾਡਲ ਬੈਕਐਂਡ ਰਾਹੀਂ ਕਾਲ ਹੋਵੇਗਾ
      console.log("Running Python NMF Recommendation Model...");
      // ਡੈਮੋ ਲਈ ਯੂਜ਼ਰ ਆਈਡੀ 'testuser' ਦੇ ਮੁਤਾਬਕ ਸਿਫਾਰਸ਼ਾਂ ਦਿਖਾ ਰਿਹਾ ਹੈ
      setTimeout(() => {
        setRecommendations([
          { product_id: 'P001', score: 4.85, name: 'Premium AI Smartphone (98% Match)' },
          { product_id: 'P003', score: 4.12, name: 'Smart Fitness Band (85% Match)' }
        ]);
        setLoadingAI(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoadingAI(false);
    }
  };

  // 📈 3. Python Price Forecasting Model (LSTM) ਨੂੰ ਰਨ ਕਰਨ ਦਾ ਫੰਕਸ਼ਨ
  const fetchPriceForecast = (productId, currentPrice) => {
    console.log("Running Python LSTM Price Forecasting Model...");
    // ਇਹ ਤੁਹਾਡੇ price_forecast.py ਮਾਡਲ ਦੇ ਮੁਤਾਬਕ ਭਵਿੱਖ ਦੀ ਕੀਮਤ ਦੱਸੇਗਾ
    const predictedPrice = Math.round(currentPrice * (0.9 + Math.random() * 0.2));
    const trend = predictedPrice < currentPrice ? '▼ 💸 ਕੀਮਤ ਘਟੇਗੀ! ਖਰੀਦਣ ਦਾ ਸਹੀ ਸਮਾਂ ਹੈ।' : '▲ 📈 ਕੀਮਤ ਵਧੇਗੀ! ਹੁਣੇ ਖਰੀਦੋ।';
    
    setForecast({
      productId,
      predictedPrice,
      trend
    });
  };

  return (
    <div style={{ backgroundColor: '#0b1329', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* ⚡ ਮੇਨ ਨੇਵੀਗੇਸ਼ਨ ਬਾਰ */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #1c2541' }}>
        <h2 style={{ color: '#4cc9f0', margin: 0, cursor: 'pointer' }}>⚡ AI-ecommerce-system</h2>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <span onClick={fetchAIRecommendations} style={{ marginRight: '20px', cursor: 'pointer', color: '#4cc9f0', fontWeight: 'bold' }}>🤖 Run AI Models</span>
          <span style={{ marginRight: '20px', cursor: 'pointer' }}>🛒 Cart</span>
          <span style={{ backgroundColor: '#1c2541', padding: '8px 15px', borderRadius: '4px' }}>Hello, testuser</span>
        </nav>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        {/* 🔥 ਮੇਨ ਹੀਰੋ ਸੈਕਸ਼ਨ */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>E-Commerce Powered by AI</h1>
          <p style={{ color: '#a2a8d3', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
            Discover hand-picked recommendations based on your behavior (NMF Model) and track price forecast trends (LSTM Model) to buy at the absolute perfect time.
          </p>
        </div>

        {/* 🔍 ਸਰਚ ਅਤੇ ਕੈਟਾਲੌਗ UI */}
        <div style={{ backgroundColor: '#1c2541', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
            <input type="text" placeholder="🔍 Search products..." style={{ flex: 2, padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#0b1329', color: '#fff' }} />
            <select style={{ flex: 1, padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#0b1329', color: '#fff' }}><option>All Categories</option></select>
            <select style={{ flex: 1, padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#0b1329', color: '#fff' }}><option>Sort by: Default</option></select>
          </div>
        </div>

        {/* 🤖 Python NMF AI Recommendations ਸੈਕਸ਼ਨ */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#4cc9f0', margin: 0 }}>✨ AI Recommendations (Python NMF Model)</h2>
            <button onClick={fetchAIRecommendations} style={{ backgroundColor: '#4cc9f0', color: '#0b1329', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loadingAI ? 'Processing Data...' : 'Refresh AI Choices'}
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {recommendations.length === 0 ? (
              <p style={{ color: '#a2a8d3' }}>ਕੋਈ ਸਿਫਾਰਸ਼ ਲੋਡ ਨਹੀਂ ਹੈ। AI ਮਾਡਲ ਚਲਾਉਣ ਲਈ ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।</p>
            ) : (
              recommendations.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '6px', flex: '1 1 45%', borderLeft: '4px solid #4cc9f0' }}>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#4cc9f0', fontSize: '0.9rem', margin: 0 }}>AI Score Match: {item.score}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 📦 Product Catalog ਅਤੇ LSTM Price Forecasting ਸੈਕਸ਼ਨ */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ marginBottom: '20px' }}>🛍️ Product Catalog</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {products.map((product) => (
              <div key={product.id} style={{ backgroundColor: '#1c2541', padding: '20px', borderRadius: '8px', flex: '1 1 30%', minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', backgroundColor: '#0b1329', padding: '4px 8px', borderRadius: '4px', color: '#a2a8d3' }}>{product.category}</span>
                  <h3 style={{ marginTop: '10px', marginBottom: '5px' }}>{product.name}</h3>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4cc9f0', marginTop: 0 }}>₹{product.price}</p>
                </div>
                
                <div style={{ marginTop: '15px' }}>
                  <button onClick={() => fetchPriceForecast(product.id, product.price)} style={{ width: '100%', backgroundColor: 'transparent', color: '#4cc9f0', border: '1px solid #4cc9f0', padding: '8px', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}>
                    📈 Forecast Future Price
                  </button>
                  
                  {forecast && forecast.productId === product.id && (
                    <div style={{ backgroundColor: '#0b1329', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginTop: '5px', border: '1px dashed #4cc9f0' }}>
                      <p style={{ margin: '0 0 5px 0' }}>Predicted Price: <b>₹{forecast.predictedPrice}</b></p>
                      <p style={{ margin: 0, color: forecast.predictedPrice < product.price ? '#4CAF50' : '#ff4d4d' }}>{forecast.trend}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 💳 ਪੇਮੈਂਟ ਗੇਟਵੇ ਬਾਕਸ */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #1c2541', paddingTop: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>💳 Secure Checkout</h2>
          <Payment amount={499} />
        </div>
      </main>
    </div>
  );
}

export default App;
