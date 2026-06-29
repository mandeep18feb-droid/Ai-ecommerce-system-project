import React, { useState } from 'react';
import GooglePayButton from '@google-pay/button-react';

/**
 * Simple payment component that supports two flows:
 * 1. Credit/Debit Card entry (default)
 * 2. Google Pay (GPay) – opens the native UPI app or shows the QR scanner
 *
 * When the user selects "Google Pay", we do NOT display card input fields.
 * Instead we render the Google Pay button which, on click, launches the
 * device's UPI handling flow (e.g., scanner or the installed UPI app).
 *
 * This component can be imported into the checkout page.
 */
const Payment = ({ amount, onSuccess }) => {
    const [method, setMethod] = useState('card'); // 'card' or 'gpay'
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardInfo((prev) => ({ ...prev, [name]: value }));
    };

    const submitCardPayment = () => {
        // Placeholder – integrate with your real payment gateway here
        console.log('Processing card payment', cardInfo);
        onSuccess && onSuccess();
    };

    const handleGPaySuccess = (paymentData) => {
        // paymentData contains token and other details from Google Pay
        console.log('GPay payment successful', paymentData);
        onSuccess && onSuccess();
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
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
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={handleCardChange}
                        style={{ width: '48%', marginRight: '4%' }}
                    />
                    <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={cardInfo.cvv}
                        onChange={handleCardChange}
                        style={{ width: '48%' }}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name on Card"
                        value={cardInfo.name}
                        onChange={handleCardChange}
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    />
                    <button
                        onClick={submitCardPayment}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                    >
                        Pay ₹{amount}
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
                                        gateway: 'example', // replace with your gateway
                                        gatewayMerchantId: 'exampleGatewayMerchantId',
                                    },
                                },
                            },
                        ],
                        merchantInfo: {
                            merchantId: '01234567890123456789', // replace with your merchant ID
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