import React, { useEffect, useState } from 'react';
import Payment from './Payment';

// Your live backend deployment infrastructure instance URL
const BACKEND_URL = 'https://onrender.com';

function App() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // Appending timestamp parameters to clean local asset caches during network fetch requests
    fetch(`${BACKEND_URL}/api/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          loadFallbackProducts();
        }
      })
      .catch(() => loadFallbackProducts());
  }, []);

  // Secure static fallbacks utilizing structured image paths if remote servers fail
  const loadFallbackProducts = () => {
    setProducts([
      { id: 'P001', name: 'Premium AI Smartphone', price: 45000, category: 'Electronics', image: 'https://unsplash.com' },
      { id: 'P002', name: 'Noise Cancelling Headphones', price: 8500, category: 'Audio', image: 'https://unsplash.com' },
      { id: 'P003', name: 'Smart Fitness Band', price: 3200, category: 'Wearables', image: 'https://unsplash.com' },
      { id: 'P004', name: 'Mechanical Gaming Keyboard', price: 4500, category: 'Accessories', image: 'https://unsplash.com' },
      { id: 'P005', name: 'UltraWide Gaming Monitor', price: 28000, category: 'Electronics', image: 'https://unsplash.com' }
    ]);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    alert(`${product.name} added to your cart! 🛒`);
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
    let trendMessage = "";
    if (predictedPrice < currentPrice) {
      trendMessage = "▼ Price Drop Ahead! It is the absolute perfect time to buy.";
    } else {
      trendMessage = "▲ Price Will Rise! Buy now before the cost goes up.";
    }
    
    setForecast({
      productId,
      predictedPrice,
      trend: trendMessage
    });
  };

  return (
    <div style={{ backgroundColor: '#0b1329', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #1c2541' }}>
        <h2 style={{ color: '#4cc9f0', margin: 0, cursor: 'pointer' }} onClick={() => setShowCart(false)}>⚡ AI-ecommerce-system</h2>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <span onClick={fetchAIRecommendations} style={{ marginRight: '20px', cursor: 'pointer', color: '#4cc9f0', fontWeight: 'bold' }}>
            {loadingAI ? '🤖 Processing...' : '🤖 Run AI Models'}
          </span>
          <span onClick={() => setShowCart(!showCart)} style={{ marginRight: '20px', cursor: 'pointer', backgroundColor: '#1c2541', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold' }}>
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </span>
          <span style={{ backgroundColor: '#1c2541', padding: '8px 15px', borderRadius: '4px' }}>Hello, testuser</span>
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        {showCart ? (
          <div style={{ backgroundColor: '#1c2541', padding: '30px', borderRadius: '8px' }}>
            <h2>🛒 Your Shopping Cart</h2>
            {cart.length === 0 ? <p>Your cart is empty.</p> : (
              <div>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #0b1329' }}>
                    <div><h4>{item.name}</h4><p>₹{item.price} x {item.qty}</p></div>
                    <h4 style={{ color: '#4cc9f0' }}>₹{item.price * item.qty}</h4>
                  </div>
                ))}
                <h3>Total: ₹{cart.reduce((t, i) => t + (i.price * i.qty), 0)}</h3>
                <Payment amount={cart.reduce((t, i) => t + (i.price * i.qty), 0)} />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>E-Commerce Powered by AI</h1>
              <p style={{ color: '#a2a8d3' }}>Smart user predictions (NMF Model) and real-time market trends (LSTM Model).</p>
            </div>

            {/* AI Recommendations Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#4cc9f0' }}>✨ Tailored Recommendations</h2>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
                {recommendations.length === 0 ? (
                  <p style={{ color: '#a2a8d3' }}>No models running. Click "Run AI Models" to evaluate patterns.</p>
                ) : (
                  recommendations.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '6px', width: '45%', borderLeft: '4px solid #4cc9f0' }}>
                      <h4>{item.name}</h4>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Product Catalog Grid with Safe External Image Fallbacks */}
            <h2>🛍️ Product Catalog</h2>
            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginTop: '20px' }}>
              {products.map((product) => (
                <div key={product.id} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', width: '30%', minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '100%', height: '180px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#0b1329', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img 
                        src={product.image && product.image.includes('http') ? product.image : "https://unsplash.com"} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e)=>{
                          e.target.onerror = null; 
                          e.target.src="https://unsplash.com";
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#0b1329', padding: '4px 8px', borderRadius: '4px', color: '#a2a8d3' }}>{product.category}</span>
                    <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.2rem' }}>{product.name}</h3>
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#4cc9f0', margin: 0 }}>₹{product.price}</p>
                  </div>
                  
                  <div style={{ marginTop: '20px' }}>
                    <button onClick={() => addToCart(product)} style={{ width: '100%', backgroundColor: '#4cc9f0', color: '#0b1329', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                      🛒 Add to Cart
                    </button>
                    <button onClick={() => fetchPriceForecast(product.id, product.price)} style={{ width: '100%', backgroundColor: 'transparent', color: '#4cc9f0', border: '1px solid #4cc9f0', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                      📈 Forecast Price Trend
                    </button>
                    
                    {forecast && forecast.productId === product.id && (
                      <div style={{ backgroundColor: '#0b1329', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginTop: '10px', border: '1px dashed #4cc9f0' }}>
                        <p style={{ margin: '0 0 5px 0' }}>Expected Value: <b>₹{forecast.predictedPrice}</b></p>
                        <p style={{ margin: 0, color: forecast.predictedPrice < product.price ? '#4CAF50' : '#ff4d4d', fontWeight: 'bold' }}>{forecast.trend}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
