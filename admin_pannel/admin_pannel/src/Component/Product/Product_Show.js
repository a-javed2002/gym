import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import Modal from 'react-modal';
import { format } from 'date-fns'; // Import date-fns for formatting dates

const Product_Show = () => {
  const url = "http://localhost:8000/api/Product";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    if (!loading) {
      initializeDataTable();
    }
  }, [loading]);

  const fetchInfo = () => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  };

  const initializeDataTable = () => {
    $('#myTable').DataTable({
      responsive: true
    });
  };

  const deletedata = (id) => {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete data');
        }
        alert("Data deleted successfully");
        fetchInfo();
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data. Please try again.");
      });
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function openModal(product) {
    setSelectedProduct(product);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedProduct(null);
  }

  const customStyles = {
    overlay: {
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      borderRadius: '10px',
      padding: '20px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
  };

  function confirmDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deletedata(id);
    }
  }

  const adminToken = localStorage.getItem('Admin_token');

  const updateStatus = (id, status) => {
    fetch(`http://localhost:8000/api/ProductStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock: status }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update status');
        }
        return res.json();
      })
      .then(() => {
        alert("Status updated successfully");
        fetchInfo();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Error updating status. Please try again.");
      });
  };

  const handleStatusClick = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status
    updateStatus(id, newStatus);
  };
  const style = `
  .active-status {
    color: green;
    background-color: lightgreen;
  }
  .active-status:hover {
    color: green;
    background-color: lightgreen;
  }
  .disabled-status {
    color: red;
    background-color: rgb(255, 196, 196);
  }
  .disabled-status:hover {
    color: red;
    background-color: rgb(255, 196, 196);
  }
`;

const getStatusClass = (status) => {
  return status === 1 ? 'active-status' : 'disabled-status';
};
  return (
    <div className="content-body">
      <div className="container-fluid" style={{ overflowY: 'scroll' }}>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="card-title mb-0">Product List</h4>
                  {adminToken && (
                    <Link
                      to="/Product_Insert"
                      className="btn btn-primary"
                      style={{ color: 'white' }} // Ensure text color is white
                    >
                      Add Product
                    </Link>
                  )}
                </div>
                <div className="table-responsive">
                  <table id="myTable" className="display">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Weight</th>
                        <th>Image</th>
                  
             
                        <th>CreatedAt</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((product) => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>${product.price.toFixed(2)}</td> {/* Format price */}
                          <td>
  <React.Fragment>
    <style>{style}</style>
    <button
      className={`btn ${getStatusClass(product.stock)}`}
      onClick={() => handleStatusClick(product._id, product.stock)}
    >
      {(typeof product.stock === 'string' && product.stock === '1') ||
      (typeof product.stock === 'number' && product.stock === 1)
        ? 'In Stock'
        : 'Out of Stock'}
    </button>
  </React.Fragment>
</td>


                          <td>{product.weight}</td>
                          <td>
                            {product.image && (
                              <img
                                src={`http://localhost:8000/${product.image}`}
                                alt={product.name}
                                style={{ width: '100px', height: 'auto' }}
                              />
                            )}
                          </td>
                          <td>
                            {product.createdAt && format(new Date(product.createdAt), 'MMMM dd, yyyy ')}
                          </td>
                          <td>
                            <Link to={`/Product_Edit/${product._id}`} className="text-info">
                              <i className="bi bi-pencil" style={{ fontSize: '1.5rem' }}></i>
                            </Link>
                          </td>
                          <td>
                            <button onClick={() => confirmDelete(product._id)} className="btn btn-link p-0 text-danger border-0">
                              <i className="bi bi-trash" style={{ fontSize: '1.3rem' }}></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {error && <div className="alert alert-danger mt-3">{error.message}</div>}
                {loading && <div>Loading...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Product Details"
      >
        {selectedProduct && (
          <div>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p>Price: ${selectedProduct.price}</p>
            <p>Stock: {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            {selectedProduct.image && (
              <img
                src={`http://localhost:8000/${selectedProduct.image}`}
                alt={selectedProduct.name}
                style={{ width: '200px', height: 'auto' }}
              />
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Product_Show;
