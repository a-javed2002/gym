import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Product_Insert() {
  const navigate = useNavigate();
  const [newProductData, setNewProductData] = useState({
    name: '',
    weight: '',
    description: '',
    price: '',
    stock: 1,
    image: null
  });

  const handleFileChange = (e) => {
    const imageFile = e.target.files[0];
    setNewProductData((prevData) => ({
      ...prevData,
      image: imageFile,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", newProductData.name);
    formData.append("description", newProductData.description);
    formData.append("price", newProductData.price);
    formData.append("image", newProductData.image);
    formData.append("stock", newProductData.stock);
    formData.append("weight", newProductData.weight);
    fetch("http://localhost:8000/api/Product", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            alert("Product inserted successfully");
            navigate("/Product_Show");
          });
        } else {
          return res.json().then((data) => {
            throw new Error(data.error || "Error adding product");
          });
        }
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  return (
    <>
      <div className="content-body">
      <div className="container-fluid" style={{overflowY:'auto'}}>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Product</h4>
              <p className="text-muted m-b-15 f-s-12">
                Enter the product details below.
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
                      value={newProductData.name}
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
                      value={newProductData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label>Weight</label>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-default"
                      placeholder="Enter weight"
                      name="weight"
                      value={newProductData.weight}
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
                      value={newProductData.price}
                      onChange={handleInputChange}
                    />
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
      </div>
    </>
  );
}

export default Product_Insert;
