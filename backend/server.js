const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Routes
const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

// Product browsing route (placeholder)
app.get('/api/products', (req, res) => {
    res.json({ message: 'Product catalog' });
});

// Purchase route (placeholder)
app.post('/api/purchase', (req, res) => {
    res.json({ message: 'Purchase processed' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});