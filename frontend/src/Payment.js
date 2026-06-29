import React, { useState } from 'react';
import GooglePayButton from '@google-pay/button-react';

const Payment = ({ amount = 100, onSuccess }) => { // Default amount 100 set kiti hai testing layi
    const [method, setMethod] = useState('card');
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });
    const [loading, setLoading] = useState(false);

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardInfo((prev) => ({ ...prev, [name]: value }));
    };

    // 🚀 1. CARD PAYMENT NU LIVE BACKEND NAAL JODAN DA LOGIC
    const submitCardPayment = async () => {
        setLoading(true);
        try {
            // Render de live backend te request bhej rahe han
            const response = await fetch('https://onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    cardInfo: cardInfo,
                    paymentMethod: 'card'
                }),
            });

            const data = await response.json();
            console.log('Backend response:', data);

            if (response.ok) {
                alert('Payment Successful via Live Backend! 🎉');
                onSuccess && onSuccess();
            } else {
                alert('Payment Failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error connecting to backend:', error);
            alert('Server error, but frontend worked!');
        }
        setLoading(false);
    };

    // 🚀 2. GPAY PAYMENT NU LIVE BACKEND NAAL JODAN DA LOGIC
    const handleGPaySuccess = async (paymentData) => {
        try {
            const response = await fetch('https://onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    paymentData: paymentData,
                    paymentMethod: 'gpay'
                }),
            });

            if (response.ok) {
                alert('GPay Payment Verified by Backend! 🚀');
                onSuccess && onSuccess();
            }
        } catch (error) {
            console.error('GPay Backend Error:', error);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', maxWidth: '400px', margin: '0 auto' }}>
            <h3>Select Payment Method</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    <input
                        type="radio"
                        name="method"
                        value="card"
                        checked={method === 'card'}
                        onChange={() => setMethod('card')}
                    />
                    Credit / Debit Card
                </label>
                <label style={{ marginLeft: '1rem' }}>
                    <input
                        type="radio"
                        name="method"
                        value="gpay"
                        checked={method === 'gpay'}
                        onChange={() => setMethod('gpay')}
                    />
                    Google Pay (GPay)
                </label>
            </div>

            {method === 'card' && (
                <div>
                    <input
                        type="text"
                        name="number"
                        placeholder="Card Number"
                        value={cardInfo.number}
                        onChange={handleCardChange}
                        style={{ width: '100%', marginBottom: '0.5rem', padding: '8px' }}
                    />
                    <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={handleCardChange}
                        style={{ width: '45%', marginRight: '5%', padding: '8px' }}
                    />
                    <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={cardInfo.cvv}
                        onChange={handleCardChange}
                        style={{ width: '45%', padding: '8px' }}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name on Card"
                        value={cardInfo.name}
                        onChange={handleCardChange}
                        style={{ width: '100%', marginTop: '0.5rem', padding: '8px' }}
                    />
                    <button
                        onClick={submitCardPayment}
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        {loading ? 'Processing...' : `Pay ₹${amount}`}
                    </button>
                </div>
            )}

            {method === 'gpay' && (
                <GooglePayButton
                    environment="TEST"
                    paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                            {
                                type: 'CARD',
                                parameters: {
                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                },
                                tokenizationSpecification: {
                                    type: 'PAYMENT_GATEWAY',
                                    parameters: {
                                        gateway: 'example',
                                        gatewayMerchantId: 'exampleGatewayMerchantId',
                                    },
                                },
                            },
                        ],
                        merchantInfo: {
                            merchantId: '01234567890123456789',
                            merchantName: 'AI eCommerce',
                        },
                        transactionInfo: {
                            totalPriceStatus: 'FINAL',
                            totalPriceLabel: 'Total',
                            totalPrice: amount.toString(),
                            currencyCode: 'INR',
                            countryCode: 'IN',
                        },
                    }}
                    onLoadPaymentData={handleGPaySuccess}
                    onError={(err) => console.error('GPay error', err)}
                    existingPaymentMethodRequired={false}
                    buttonColor="black"
                    buttonType="short"
                />
            )}
        </div>
    );
};

export default Payment;
