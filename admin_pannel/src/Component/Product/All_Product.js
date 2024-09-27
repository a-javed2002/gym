import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingBag, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { height } from "@mui/system";

const All_Product = () => {
    const url = "http://localhost:8000/api/Product";
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchInfo();
        loadCartFromLocalStorage();
    }, []);

    const fetchInfo = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity when opening the modal
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProduct(null);
    };

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const addToCart = () => {
        if (selectedProduct && selectedProduct.stock > 0) {
            const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
            const productIndex = existingCart.findIndex(item => item._id === selectedProduct._id);

            if (productIndex > -1) {
                existingCart[productIndex].quantity += quantity;
            } else {
                existingCart.push({
                    ...selectedProduct,
                    quantity
                });
            }

            localStorage.setItem('cart', JSON.stringify(existingCart));
            closeModal();
        }
    };

    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const product = JSON.parse(savedCart);
            setSelectedProduct(product);
        }
    };

    const customStyles = {
        overlay: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '10px',
            padding: '20px',
            width: '90%',
         
            maxWidth: '600px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            backgroundColor: '#fff',
        },
    };

    return (
        <div className="content-body">
            <div className="col-lg-12">
                <div className="container mt-4">
                    <div className="row">
                        {data.map((product) => (
                            <div className="col-md-4 mb-4" key={product._id}>
                                <div className="card shadow-lg border-light rounded-3 overflow-hidden">
                                    <p className="card-text text-end">
                                        <span
                                            className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} text-white`}
                                            style={{
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '20px',
                                                textTransform: 'uppercase',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                            }}
                                        >
                                            {product.stock > 0 ? (
                                                <>
                                                    <FaShoppingBag />
                                                    In Stock
                                                </>
                                            ) : (
                                                <>
                                                    <FaShoppingBag />
                                                    Out of Stock
                                                </>
                                            )}
                                        </span>
                                    </p>
                                    <img
                                        src={`http://localhost:8000/${product.image}`}
                                        alt={product.name}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h1 className="card-title text-center " style={{ color: '#7571f9 !important' }}>
                                            {product.name}
                                        </h1>

                                        <p className="card-text text-center">Rs.{product.price}</p>
                                        <p className="card-text text-center"><strong>Weight:</strong> {product.weight} </p>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-primary px-4 py-2"
                                                onClick={() => openModal(product)}
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '35px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                }}
                                            >
                                                <FaShoppingBag />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && <div className="alert alert-danger mt-3">{error.message}</div>}
                    {loading && <div className="alert alert-info mt-3">Loading...</div>}

                    {selectedProduct && (
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Product Details"
                      
                        >
                            <div className="text-center mb-3 position-relative">
                                <button
                                    onClick={closeModal}
                                    style={{
                                        position: 'absolute',
                                        top: '-21px',
                                        right: '-7px',
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '24px',
                                        color: '#7571f9',
                                    }}
                                >
                                    <FaTimes />
                                </button>
                                <div className="row">
                                    <div className="col-6">
                                        <img
                                            src={`http://localhost:8000/${selectedProduct.image}`}
                                            alt={selectedProduct.name}
                                            className="img-fluid"
                                            style={{ height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <h1 className="fw-bolder" style={{ color: '#7571f9' }}>{selectedProduct.name}</h1>
                                        <h3 className="text-start">Rs. {selectedProduct.price}</h3>
                                        <p className="text-start" style={{ color: 'grey' }}>{selectedProduct.weight}</p>

                                        <p className="mb-3 text-start">{selectedProduct.description}</p>

                                        <div className="d-flex align-items-center justify-content-between mb-3" style={{ backgroundColor: 'white', width: '100%', borderRadius: '35px', border: '2px solid #7571f9', padding: '5px' }}>
                                            <button
                                                onClick={handleDecrease}
                                                disabled={quantity <= 1}
                                                className="btn btn-outline-secondary"
                                                style={{ border: 'none', padding: '0', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <i className="bi bi-dash fw-500" style={{ fontSize: '30px', color: '#7571f9' }}></i>
                                            </button>

                                            <p
                                                className="mx-2 fw-500"
                                                style={{ width: '35px', textAlign: 'center', color: '#7571f9', borderRadius: '5px', background: 'transparent', margin: 0 }}
                                            >
                                                {quantity}
                                            </p>

                                            <button
                                                onClick={handleIncrease}
                                                className="btn btn-outline-secondary"
                                                style={{ border: 'none', padding: '0', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <i className="bi bi-plus fw-500" style={{ fontSize: '30px', color: '#7571f9' }}></i>
                                            </button>
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                onClick={addToCart} // Add to cart only when stock > 0
                                                className="btn btn-primary py-2 px-4 w-100"
                                                style={{ borderRadius: '35px' }}
                                                disabled={selectedProduct.stock <= 0} // Disable button if stock is 0
                                            >
                                                <FaShoppingCart /> {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default All_Product;
