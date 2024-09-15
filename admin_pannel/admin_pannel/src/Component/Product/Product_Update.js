import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Product_Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8000/api/Product/${id}`; // Adjusted endpoint if needed

  const [productData, setProductData] = useState({
    name: '',
    weight: '',
    description: '',
    price: '',
    stock: '', // Default value
    image: null
  });

  const handleFileChange = (e) => {
    const imageFile = e.target.files[0];
    setProductData((prevData) => ({
      ...prevData,
      image: imageFile,
    }));
  };

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProductData(data))
      .catch((error) => console.error("Error fetching product details:", error));
  }, [url]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock); // Include stock status
    formData.append("weight", productData.weight);
    // Append the file only if it exists
    if (productData.image) {
      formData.append("image", productData.image);
    }
  
    fetch(url, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((updatedData) => {
            alert("Product updated successfully");
            navigate("/Product_Show");
          });
        } else {
          return res.json().then((data) => {
            throw new Error(data.error || "Error updating product");
          });
        }
      })
      .catch((error) => {
        console.error('Error updating product data:', error);
        alert('Error updating product data. Please try again.');
      });
  };
  

  return (
    <>
      <div className="content-body">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Edit Product</h4>
              <p className="text-muted m-b-15 f-s-12">
                Update the product details below.
              </p>
              <div className="basic-form">
                <form>
                  <label>Product Name</label>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-default"
                      placeholder="Enter Product Name"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <label>Description</label>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-default"
                      placeholder="Enter Description"
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label>weight</label>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-default"
                      placeholder="Enter weight"
                      name="weight"
                      value={productData.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label>Price</label>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control input-default"
                      placeholder="Enter Price"
                      name="price"
                      value={productData.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <label>Stock Status</label>
                  <div className="form-group">
                    <select
                      className="form-control input-default"
                      name="stock"
                      value={productData.stock}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="1">In Stock</option>
                      <option value="0">Out of Stock</option>
                    </select>
                  </div>

                  <label>Image</label>
                  <div className="form-group">
                    <input
                      type="file"
                      className="form-control input-default"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn mb-1 btn-primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product_Edit;
