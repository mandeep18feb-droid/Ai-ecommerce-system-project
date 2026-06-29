const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Routes
const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

// 🛍️ Product browsing route updated with 5 items containing image URLs
app.get('/api/products', (req, res) => {
    const productCatalog = [
        { 
            id: 'P001', 
            name: 'Premium AI Smartphone', 
            price: 45000, 
            category: 'Electronics',
            image: 'https://media-amazon.com' 
        },
        { 
            id: 'P002', 
            name: 'Noise Cancelling Headphones', 
            price: 8500, 
            category: 'Audio',
            image: 'https://media-amazon.com' 
        },
        { 
            id: 'P003', 
            name: 'Smart Fitness Band', 
            price: 3200, 
            category: 'Wearables',
            image: 'https://media-amazon.com' 
        },
        { 
            id: 'P004', 
            name: 'Mechanical Gaming Keyboard', 
            price: 4500, 
            category: 'Accessories',
            image: 'https://media-amazon.com' 
        },
        { 
            id: 'P005', 
            name: 'UltraWide Gaming Monitor', 
            price: 28000, 
            category: 'Electronics',
            image: 'https://media-amazon.com' 
        }
    ];
    res.json(productCatalog);
});

// 💳 Purchase route
app.post('/api/purchase', (req, res) => {
    res.json({ message: 'Purchase processed successfully' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
