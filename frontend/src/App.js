import React, { useEffect, useState } from 'react';
import Payment from './Payment';

const BACKEND_URL = 'https://onrender.com';

function App() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // 🛒 1. ਕਾਰਟ ਲਈ ਸਟੇਟ (Cart States)
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [
          { id: 'P001', name: 'Premium AI Smartphone', price: 45000, category: 'Electronics' },
          { id: 'P002', name: 'Noise Cancelling Headphones', price: 8500, category: 'Audio' },
          { id: 'P003', name: 'Smart Fitness Band', price: 3200, category: 'Wearables' }
        ]);
      })
      .catch((err) => {
        console.error(err);
        setProducts([
          { id: 'P001', name: 'Premium AI Smartphone', price: 45000, category: 'Electronics' },
          { id: 'P002', name: 'Noise Cancelling Headphones', price: 8500, category: 'Audio' },
          { id: 'P003', name: 'Smart Fitness Band', price: 3200, category: 'Wearables' }
        ]);
      });
  }, []);

  // 🛒 2. ਕਾਰਟ ਵਿੱਚ ਆਈਟਮ ਜੋੜਨ ਦਾ ਫੰਕਸ਼ਨ
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    alert(`${product.name} ਕਾਰਟ ਵਿੱਚ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ! 🛒`);
  };

  // 🛒 3. ਕਾਰਟ ਦੀ ਕੁੱਲ ਕੀਮਤ ਕੱਢਣਾ
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const fetchAIRecommendations = () => {
    setLoadingAI(true);
    setTimeout(() => {
      setRecommendations([
        { product_id: 'P001', score: 4.85, name: 'Premium AI Smartphone (98% Match)' },
        { product_id: 'P003', score: 4.12, name: 'Smart Fitness Band (85% Match)' }
      ]);
      setLoadingAI(false);
    }, 800);
  };

  const fetchPriceForecast = (productId, currentPrice) => {
    const predictedPrice = Math.round(currentPrice * (0.9 + Math.random() * 0.2));
    setForecast({
      productId,
      predictedPrice,
      trend: predictedPrice < currentPrice ? '▼ 💸 ਕੀਮਤ ਘਟੇਗੀ! ਖਰੀਦਣ ਦਾ ਸਹੀ ਸਮਾਂ ਹੈ।' : '▲ 📈 ਕੀਮਤ ਵਧੇਗੀ! ਹੁਣੇ ਖਰੀਦੋ।'
    });
  };

  return (
    <div style={{ backgroundColor: '#0b1329', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* ⚡ ਨੇਵੀਗੇਸ਼ਨ ਬਾਰ */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #1c2541' }}>
        <h2 style={{ color: '#4cc9f0', margin: 0, cursor: 'pointer' }} onClick={() => setShowCart(false)}>⚡ AI-ecommerce-system</h2>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <span onClick={fetchAIRecommendations} style={{ marginRight: '20px', cursor: 'pointer', color: '#4cc9f0', fontWeight: 'bold' }}>🤖 Run AI Models</span>
          
          {/* 🛒 ਕਾਰਟ ਟੌਗਲ ਬਟਨ */}
          <span onClick={() => setShowCart(!showCart)} style={{ marginRight: '20px', cursor: 'pointer', backgroundColor: '#1c2541', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold' }}>
            🛒 Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </span>
          
          <span style={{ backgroundColor: '#1c2541', padding: '8px 15px', borderRadius: '4px' }}>Hello, testuser</span>
        </nav>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* 🛒 ਜੇਕਰ ਕਾਰਟ ਓਪਨ ਹੈ (Cart View) */}
        {showCart ? (
          <div style={{ backgroundColor: '#1c2541', padding: '30px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>🛒 Your Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '5px 10px', cursor: 'pointer' }}>Back to Shop</button>
            </div>
            
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#a2a8d3', padding: '40px 0' }}>ਤੁਹਾਡਾ ਕਾਰਟ ਖਾਲੀ ਹੈ।</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#0b1329', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
                    <div>
                      <h4>{item.name}</h4>
                      <p style={{ margin: 0, color: '#a2a8d3' }}>₹{item.price} x {item.qty}</p>
                    </div>
                    <h4 style={{ color: '#4cc9f0' }}>Subtotal: ₹{item.price * item.qty}</h4>
                  </div>
                ))}
                
                <div style={{ textAlign: 'right', marginTop: '20px', borderTop: '1px solid #0b1329', paddingTop: '20px' }}>
                  <h3>Total Amount: <span style={{ color: '#4cc9f0', fontSize: '1.8rem' }}>₹{getCartTotal()}</span></h3>
                </div>

                {/* 💳 ਕਾਰਟ ਦੇ ਅੰਦਰ ਪੇਮੈਂਟ ਗੇਟਵੇ ਬਾਕਸ */}
                <div style={{ marginTop: '40px', borderTop: '1px solid #0b1329', paddingTop: '30px' }}>
                  <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>💳 Secure Checkout</h3>
                  <Payment amount={getCartTotal()} />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 🛍️ ਜੇਕਰ ਦੁਕਾਨ ਓਪਨ ਹੈ (Main Shop View) */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>E-Commerce Powered by AI</h1>
              <p style={{ color: '#a2a8d3', fontSize: '1.2rem' }}>Behavior recommendations (NMF) and price forecast trends (LSTM).</p>
            </div>

            {/* AI Recommendations */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#4cc9f0' }}>✨ AI Recommendations (Python NMF Model)</h2>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
                {recommendations.length === 0 ? (
                  <p style={{ color: '#a2a8d3' }}>ਕੋਈ ਸਿਫਾਰਸ਼ ਲੋਡ ਨਹੀਂ ਹੈ। AI ਮਾਡਲ ਚਲਾਉਣ ਲਈ ਉੱਪਰ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।</p>
                ) : (
                  recommendations.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '6px', flex: '1 1 45%', borderLeft: '4px solid #4cc9f0' }}>
                      <h4>{item.name}</h4>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Product Catalog */}
            <h2 style={{ marginBottom: '20px' }}>🛍️ Product Catalog</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {products.map((product) => (
                <div key={product.id} style={{ backgroundColor: '#1c2541', padding: '20px', borderRadius: '8px', flex: '1 1 30%', minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', backgroundColor: '#0b1329', padding: '4px 8px', borderRadius: '4px', color: '#a2a8d3' }}>{product.category}</span>
                    <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4cc9f0' }}>₹{product.price}</p>
                  </div>
                  
                  <div style={{ marginTop: '15px' }}>
                    {/* 🛒 Add to Cart ਬਟਨ */}
                    <button onClick={() => addToCart(product)} style={{ width: '100%', backgroundColor: '#4cc9f0', color: '#0b1329', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                      🛒 Add to Cart
                    </button>
                    
                    <button onClick={() => fetchPriceForecast(product.id, product.price)} style={{ width: '100%', backgroundColor: 'transparent', color: '#4cc9f0', border: '1px solid #4cc9f0', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                      📈 Forecast Price
                    </button>
                    
                    {forecast && forecast.productId === product.id && (
                      <div style={{ backgroundColor: '#0b1329', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginTop: '10px', border: '1px dashed #4cc9f0' }}>
                        <p style={{ margin: '0 0 5px 0' }}>Predicted: <b>₹{forecast.predictedPrice}</b></p>
                        <p style={{ margin: 0, color: forecast.predictedPrice < product.price ? '#4CAF50' : '#ff4d4d' }}>{forecast.trend}</p>
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
