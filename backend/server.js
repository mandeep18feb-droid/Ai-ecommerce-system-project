const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Routes
const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

// 🛍️ 1. Product browsing route (Updated with real products list)
app.get('/api/products', (req, res) => {
    const productCatalog = [
        { id: 'P001', name: 'Premium AI Smartphone', price: 45000, category: 'Electronics' },
        { id: 'P002', name: 'Noise Cancelling Headphones', price: 8500, category: 'Audio' },
        { id: 'P003', name: 'Smart Fitness Band', price: 3200, category: 'Wearables' }
    ];
    res.json(productCatalog);
});

// 💳 2. Purchase route (placeholder)
app.post('/api/purchase', (req, res) => {
    res.json({ message: 'Purchase processed' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
