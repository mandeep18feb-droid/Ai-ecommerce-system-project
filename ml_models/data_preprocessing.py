import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import json

class DataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.encoder = OneHotEncoder(drop='first', sparse_output=False)
        self.numeric_features = ['price', 'quantity', 'user_age', 'user_income']
        self.categorical_features = ['category', 'user_location', 'payment_method']
        self.feature_transformer = ColumnTransformer(
            transformers=[
                ('num', self.scaler, self.numeric_features),
                ('cat', self.encoder, self.categorical_features)
            ])
        
    def load_transaction_data(self, file_path):
        """Load and clean transaction data"""
        df = pd.read_csv(file_path)
        
        # Handle missing values
        df['price'] = df['price'].fillna(df['price'].median())
        df['quantity'] = df['quantity'].fillna(df['quantity'].median())
        df['category'] = df['category'].fillna('unknown')
        
        # Remove outliers (price > 3 standard deviations from mean)
        price_mean = df['price'].mean()
        price_std = df['price'].std()
        df = df[df['price'] <= (price_mean + 3 * price_std)]
        
        return df
    
    def create_user_features(self, df):
        """Create user-level features from transaction history"""
        user_features = df.groupby('user_id').agg({
            'price': ['mean', 'sum', 'count'],
            'quantity': 'sum',
            'category': lambda x: x.mode().iloc[0] if not x.empty else 'unknown'
        }).reset_index()
        
        user_features.columns = ['user_id', 'avg_price', 'total_spent', 'purchase_count', 
                                'total_quantity', 'preferred_category']
        return user_features
    
    def create_product_features(self, df):
        """Create product-level features"""
        product_features = df.groupby('product_id').agg({
            'price': ['mean', 'std', 'min', 'max'],
            'quantity': 'sum',
            'category': lambda x: x.mode().iloc[0] if not x.empty else 'unknown'
        }).reset_index()
        
        product_features.columns = ['product_id', 'avg_price', 'price_std', 'min_price', 
                                   'max_price', 'total_sold', 'category']
        return product_features
    
    def prepare_training_data(self, df):
        """Prepare data for ML model training"""
        # Create user and product features
        user_features = self.create_user_features(df)
        product_features = self.create_product_features(df)
        
        # Merge features back to original data
        df = df.merge(user_features, on='user_id', how='left')
        df = df.merge(product_features, on='product_id', how='left')
        
        # Feature engineering for time-based patterns
        df['hour_of_day'] = pd.to_datetime(df['timestamp']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        
        return df
    
    def transform_features(self, df):
        """Transform features for ML models"""
        # Select features for transformation
        feature_cols = self.numeric_features + self.categorical_features + \
                      ['hour_of_day', 'day_of_week', 'is_weekend', 'avg_price', 
                       'total_spent', 'purchase_count', 'price_std', 'total_sold']
        
        X = df[feature_cols]
        
        # Transform features
        X_transformed = self.feature_transformer.fit_transform(X)
        
        return X_transformed, feature_cols
    
    def save_preprocessed_data(self, df, output_path):
        """Save preprocessed data"""
        df.to_csv(output_path, index=False)
        print(f"Preprocessed data saved to {output_path}")
    
    def run_preprocessing_pipeline(self, input_path, output_path):
        """Run the complete preprocessing pipeline"""
        print("Loading transaction data...")
        df = self.load_transaction_data(input_path)
        
        print("Creating user and product features...")
        df = self.prepare_training_data(df)
        
        print("Transforming features...")
        X_transformed, feature_cols = self.transform_features(df)
        
        # Save preprocessed data
        self.save_preprocessed_data(df, output_path)
        
        return X_transformed, feature_cols, df

# Example usage
if __name__ == "__main__":
    preprocessor = DataPreprocessor()
    
    # Example file paths (replace with actual paths)
    input_file = 'data/transactions.csv'
    output_file = 'data/preprocessed_transactions.csv'
    
    try:
        X_transformed, feature_cols, processed_df = preprocessor.run_preprocessing_pipeline(
            input_file, output_file
        )
        print(f"Preprocessing completed. Shape: {X_transformed.shape}")
        print(f"Features: {feature_cols}")
    except FileNotFoundError:
        print(f"Input file {input_file} not found. Please provide valid file paths.")