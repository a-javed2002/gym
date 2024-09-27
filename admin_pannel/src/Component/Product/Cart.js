import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(new Map());
    const [total, setTotal] = useState(0);
    const navigate = useNavigate(); // Initialize navigate here

    useEffect(() => {
        loadCartFromLocalStorage();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [cart]);

    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('cart');
        console.log('Saved cart data:', savedCart); // Print raw data from localStorage
        if (savedCart) {
            try {
                const cartArray = JSON.parse(savedCart);
                console.log('Parsed cart data:', cartArray); // Print parsed data

                if (Array.isArray(cartArray)) {
                    // Convert array to Map
                    const loadedCart = new Map(cartArray.map(item => [item._id, item]));
                    setCart(loadedCart);
                } else {
                    console.error('Cart data is not in the expected format.');
                    setCart(new Map()); // Set to empty map if data format is incorrect
                }
            } catch (error) {
                console.error('Error parsing cart data from local storage:', error);
                setCart(new Map()); // Set to empty map if parsing fails
            }
        }
    };

    const saveCartToLocalStorage = () => {
        const cartArray = Array.from(cart.entries()).map(([key, value]) => value); // Convert Map to array of objects
        console.log('Saving cart data:', cartArray); // Print data to be saved
        localStorage.setItem('cart', JSON.stringify(cartArray));
    };

    const handleIncrease = (productId) => {
        const updatedCart = new Map(cart);
        const item = updatedCart.get(productId);
        if (item) {
            item.quantity += 1;
            updatedCart.set(productId, item);
            setCart(updatedCart);
            saveCartToLocalStorage();
        }
    };

    const handleDecrease = (productId) => {
        const updatedCart = new Map(cart);
        const item = updatedCart.get(productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                updatedCart.set(productId, item);
            } else {
                updatedCart.delete(productId);
            }
            setCart(updatedCart);
            saveCartToLocalStorage();
        }
    };

    const handleRemove = (productId) => {
        const updatedCart = new Map(cart);
        updatedCart.delete(productId);
        setCart(updatedCart);
        saveCartToLocalStorage();
    };

    const handleClearCart = () => {
        setCart(new Map());
        localStorage.removeItem('cart');
    };

    const calculateTotal = () => {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        setTotal(total);
    };

    const checkout = () => {
        navigate('/checkout'); // Use navigate here
        alert('Proceeding to checkout...');
    };

    return (
        <div className="content-body">
            <div className="col-lg-12">
                <div className="container mt-5">
                    <h1 className="text-center mb-4" style={{ color: '#7571f9' }}>Shopping Cart</h1>
                    <div className="row">
                        {cart.size > 0 ? (
                            <>
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.from(cart.entries()).map(([productId, item]) => (
                                                    <tr key={productId}>
                                                        <td>
                                                            <img src={`http://localhost:8000/${item.image}`} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                        </td>
                                                        <td>{item.name}</td>
                                                        <td>Rs.{item.price.toFixed(2)}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <button
                                                                    className="btn btn-custom-hover"
                                                                    onClick={() => handleDecrease(productId)}
                                                                >
                                                                    <FaMinus />
                                                                </button>
                                                                <span className="mx-2">{item.quantity}</span>
                                                                <button
                                                                    className="btn btn-custom-hover"
                                                                    onClick={() => handleIncrease(productId)}
                                                                >
                                                                    <FaPlus />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleRemove(productId)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-12 text-center mt-4">
                                    <h3>Total: {total.toFixed(2)} Rs</h3>
                                    <button
                                        className="btn btn-primary mx-2 mt-2"
                                        onClick={checkout}
                                        style={{ padding: '10px 20px' }}
                                    >
                                        <FaShoppingCart /> Checkout
                                    </button>
                                    <button
                                        className="btn btn-secondary mx-2 mt-2"
                                        onClick={handleClearCart}
                                        style={{ padding: '10px 20px' }}
                                    >
                                        <FaTrash /> Clear Cart
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="col-12 text-center">
                                <h4>Your cart is empty</h4>
                                <FaCheckCircle style={{ fontSize: '60px', color: '#7571f9' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
