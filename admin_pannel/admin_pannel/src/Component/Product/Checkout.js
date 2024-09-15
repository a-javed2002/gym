import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaAddressCard, FaTag } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
const Checkout = () => {
    const [billingAddress, setBillingAddress] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [orderSummary, setOrderSummary] = useState([]);
    const navigate = useNavigate(); // Initialize the navigate hook

    useEffect(() => {
        // Retrieve cart data from local storage
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setOrderSummary(cartData);
    }, []);
    const user = useSelector((state) => state.auth.user);
    const userId = user.id;
    const handleOrder = async () => {
        const orderData = {
            userId: userId, // Assuming user ID is stored in local storage
            items: orderSummary.map(item => ({
                productId: item._id, // Assuming each item has an ID
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: calculateTotal(),
            billingAddress: 'Ancholi Gulberg Town, Karachi, Karachi City, Sindh Pakistan',
            status: 'Pending', // Initial status
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            const response = await fetch('http://localhost:8000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Order submitted', result);

            // Show an alert and redirect to /all_product
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            navigate('/all_product'); // Redirect to the all_product page

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const calculateTotal = () => {
        return orderSummary.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="content-body">
            <div className="container mt-5">
                <h1 className="text-center mb-4" style={{ color: '#7571f9' }}>Checkout</h1>
                <div className="row">
                    <div className="col-md-8 mb-4 mb-md-0">
                        <div className="card shadow-sm border-light">
                            <div className="card-body">
                                <h3 className="mb-4">Order Summary</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderSummary.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>Rs.{item.price.toFixed(2)}</td>
                                                    <td>Rs.{(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <div className="mb-4">
                                    <h3><FaAddressCard /> Billing Address</h3>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter billing address"
                                        value={billingAddress}
                                        onChange={(e) => setBillingAddress(e.target.value)}
                                    />
                                </div> */}

                                {/* Uncomment if you want to use Payment Details */}
                                {/* <div className="mb-4">
                                    <h3><FaCreditCard /> Payment Details</h3>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter payment details"
                                        value={paymentDetails}
                                        onChange={(e) => setPaymentDetails(e.target.value)}
                                    />
                                </div> */}

                                <button
                                    className="btn btn-primary"
                                    onClick={handleOrder}
                                    style={{ borderRadius: '35px', padding: '10px 20px' }}
                                >
                                    <FaShoppingCart /> Place Order
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm border-light">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <FaTag style={{ fontSize: '24px', color: '#7571f9' }} />
                                    <h4 className="card-title ml-2">Order Total</h4>
                                </div>
                                <h3 className="card-text" style={{ color: '#333' }}>
                                    Rs.{calculateTotal()}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
