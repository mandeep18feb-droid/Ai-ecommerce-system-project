import pandas as pd
import numpy as np
from sklearn.decomposition import NMF
from sklearn.metrics.pairwise import cosine_similarity
import joblib

class ProductRecommender:
    def __init__(self, n_factors=10):
        self.n_factors = n_factors
        self.model = NMF(n_components=n_factors, random_state=42)
        self.user_item_matrix = None
        self.user_mapping = {}
        self.item_mapping = {}
        
    def fit(self, df):
        """
        Fit the recommendation model on transaction data.
        df should have user_id, product_id, and interaction rating columns.
        """
        # Create user-item matrix
        self.user_item_matrix = df.pivot_table(
            index='user_id', 
            columns='product_id', 
            values='rating', 
            fill_value=0
        )
        
        # Store mappings
        self.user_mapping = {user_id: idx for idx, user_id in enumerate(self.user_item_matrix.index)}
        self.item_mapping = {product_id: idx for idx, product_id in enumerate(self.user_item_matrix.columns)}
        
        # Fit NMF model
        self.user_features = self.model.fit_transform(self.user_item_matrix)
        self.item_features = self.model.components_
        
        return self
    
    def recommend_for_user(self, user_id, n_recommendations=5):
        """Get product recommendations for a specific user."""
        if user_id not in self.user_mapping:
            return self._get_popular_items(n_recommendations)
        
        user_idx = self.user_mapping[user_id]
        user_scores = np.dot(self.user_features[user_idx], self.item_features)
        
        # Get top recommendations
        top_indices = np.argsort(user_scores)[::-1][:n_recommendations]
        recommendations = []
        
        for idx in top_indices:
            product_id = self.user_item_matrix.columns[idx]
            score = user_scores[idx]
            recommendations.append({'product_id': product_id, 'score': float(score)})
        
        return recommendations
    
    def _get_popular_items(self, n):
        """Fallback for new users - recommend popular items."""
        popular = self.user_item_matrix.mean().sort_values(ascending=False).head(n)
        return [{'product_id': pid, 'score': float(score)} for pid, score in popular.items()]
    
    def save_model(self, path):
        joblib.dump({
            'model': self.model,
            'user_item_matrix': self.user_item_matrix,
            'user_mapping': self.user_mapping,
            'item_mapping': self.item_mapping,
            'user_features': self.user_features,
            'item_features': self.item_features
        }, path)
    
    def load_model(self, path):
        data = joblib.load(path)
        self.model = data['model']
        self.user_item_matrix = data['user_item_matrix']
        self.user_mapping = data['user_mapping']
        self.item_mapping = data['item_mapping']
        self.user_features = data['user_features']
        self.item_features = data['item_features']
        return self

if __name__ == "__main__":
    # Example usage
    print("Product Recommender Model")
    print("Use recommender.fit(df) to train on transaction data")
    print("Use recommender.recommend_for_user(user_id) to get recommendations")</arg_value>
<arg_key>task_progress</arg_key>
<arg_value>- [x] Design database for products, users, and transactions.
- [x] Set up backend project structure (backend directory, server.js, auth.js).
- [x] Implement secure authentication (registration, login, JWT).
- [x] Set up frontend project structure (frontend directory, basic pages).
- [x] Develop product browsing module (API route /api/products).
- [x] Develop purchasing module (API route /api/purchase).
- [x] Preprocess historical transaction data (data_preprocessing.py).
- [x] Train recommendation model (ml_models/recommendation.py).
- [ ] Train price forecasting model (ml_models/price_forecast.py).
- [ ] Integrate interactive dashboards (React components).
- [ ] Test recommendation accuracy (unit tests, evaluation metrics).
- [ ] Test system responsiveness (load testing).
- [ ] Implement payment gateway integration (Stripe/PayPal).
- [ ] Write comprehensive documentation (system_design.md, roadmap.md).
- [ ] Set up CI/CD pipeline (GitHub Actions).
- [ ] Deploy to GitHub with a single link for easy access.</arg_value>
</tool_call>