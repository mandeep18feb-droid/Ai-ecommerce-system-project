# System Design Document: AI-ecommerce-system

## 1. Database Schema Design
The system will use a relational database (e.g., PostgreSQL) to ensure data integrity and complex querying capabilities.

### Entities and Relationships:
- **Users**: `user_id` (PK), `username`, `email`, `password_hash`, `created_at`, `role` (customer/admin).
- **Products**: `product_id` (PK), `name`, `description`, `category`, `base_price`, `current_price`, `stock_quantity`, `created_at`.
- **Transactions**: `transaction_id` (PK), `user_id` (FK), `transaction_date`, `total_amount`, `payment_status`.
- **Transaction_Items**: `item_id` (PK), `transaction_id` (FK), `product_id` (FK), `quantity`, `price_at_purchase`.
- **User_Behavior**: `behavior_id` (PK), `user_id` (FK), `product_id` (FK), `action` (view/click/add_to_cart), `timestamp`.
- **Price_History**: `history_id` (PK), `product_id` (FK), `price`, `timestamp`.

## 2. Authentication Flow
- **Registration**: User provides email/password $\rightarrow$ Password hashed using bcrypt $\rightarrow$ Stored in `Users` table.
- **Login**: User provides credentials $\rightarrow$ System verifies hash $\rightarrow$ Issues a JWT (JSON Web Token) for session management.
- **Authorization**: Middleware checks JWT for valid session and user role before granting access to protected routes (e.g., `/checkout`, `/admin`).

## 3. Module Descriptions
### Product Browsing Module
- **Catalog View**: Fetches products from the database with filtering and sorting.
- **Search**: Full-text search for product names and descriptions.
- **AI Recommendations**: Integrates with the ML model to display "Recommended for You" sections.

### Purchasing Module
- **Cart Management**: Temporary storage of selected items.
- **Checkout Process**: Validates stock $\rightarrow$ Calculates total $\rightarrow$ Initiates payment.
- **Order Fulfillment**: Updates `Transactions` and `Transaction_Items` tables $\rightarrow$ Decrements product stock.

## 4. Data Preprocessing and ML Model Training
### Data Preprocessing
- **Cleaning**: Handling missing values in transaction data and removing outliers.
- **Feature Engineering**: Creating user profiles (preferred categories, average spend) and time-series features for pricing (seasonal trends).
- **Normalization**: Scaling numerical data for better model convergence.

### ML Models
- **Product Recommendations**: 
  - *Collaborative Filtering*: Using Matrix Factorization to suggest products based on similar user behaviors.
  - *Content-Based Filtering*: Suggesting products based on product attributes (category, description).
- **Price Forecasting**:
  - *LSTM (Long Short-Term Memory)*: A recurrent neural network used to predict future price trends based on `Price_History` time-series data.

## 5. Dashboard Design
### User Activity Dashboard
- **Metrics**: Total orders, average order value, most viewed categories.
- **Visuals**: Line charts for activity over time, pie charts for category distribution.

### Trend Visualization Dashboard
- **Price Trends**: Interactive line graphs showing historical vs. predicted prices.
- **Demand Heatmap**: Visualizing which products are trending in specific timeframes.

## 6. Test Cases
### Recommendation Accuracy
- **Test Case 1**: Verify that a user who views "Laptop" is recommended "Mouse" or "Keyboard" (Cross-selling).
- **Test Case 2**: Verify that a user is not recommended products they have already purchased.
- **Metric**: Mean Average Precision (MAP) and Recall@K.

### System Responsiveness
- **Test Case 1**: Load testing the product catalog with 1000+ concurrent users.
- **Test Case 2**: Measuring API response time for the recommendation engine (Target: < 200ms).

## 7. Payment Gateway Integration
- **Provider**: Integration with Stripe or PayPal API.
- **Flow**: 
  1. Frontend sends order details to Backend.
  2. Backend creates a PaymentIntent with the gateway.
  3. Gateway provides a secure payment page/element.
  4. User completes payment $\rightarrow$ Gateway sends a Webhook notification to Backend.
  5. Backend updates `payment_status` to 'Paid'.
- **Security**: TLS encryption, PCI-DSS compliance, and tokenization of payment details.