# AI-ecommerce-system

## Overview
A full‑stack e‑commerce platform that uses AI for product recommendations and price forecasting.  
The project includes:

- **Backend** (Node.js + Express) with secure JWT authentication.
- **Frontend** (React) with product browsing, cart, checkout, and Google Pay integration.
- **Machine Learning** (Python) for data preprocessing, recommendation (NMF) and price forecasting (LSTM).
- **CI/CD** pipeline using GitHub Actions.
- **Deployment** to GitHub Pages (frontend) and a cloud service (backend) for a live, always‑available site.

## Live Demo
Once deployed, the site will be accessible at:

```
https://<YOUR_GITHUB_USERNAME>.github.io/AI-ecommerce-system/
```

The backend API will be hosted on a cloud provider (e.g., Render) and the frontend will automatically call it.

## Project Structure

```
AI-ecommerce-system/
│
├─ backend/
│   ├─ auth.js               # Authentication routes
│   ├─ server.js             # Express server, product & purchase APIs
│   ├─ routes/
│   │   ├─ auth.js
│   │   ├─ products.js
│   │   └─ payment.js
│   ├─ package.json
│   └─ .env.example          # Environment variables template
│
├─ frontend/
│   ├─ src/
│   │   ├─ Payment.js        # Payment component with Card & Google Pay
│   │   └─ ...               # Other React components
│   ├─ public/
│   ├─ package.json
│   └─ .env.example          # Frontend env variables (REACT_APP_*)
│
├─ ml_models/
│   ├─ data_preprocessing.py
│   ├─ recommendation.py
│   └─ price_forecast.py
│
├─ .github/
│   └─ workflows/
│       └─ deploy.yml        # GitHub Actions CI/CD workflow
│
├─ .gitignore
├─ README.md
├─ system_design.md
├─ roadmap.md
└─ todo_list.md
```

## Getting Started (Local Development)

### Prerequisites
- **Node.js** (v18+)
- **npm** (or yarn)
- **Python** (3.11+)
- **PostgreSQL** (optional, for full DB integration)

### Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your secrets
cp .env.example .env
npm run dev   # starts