import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Expense_Insert() {
  const navigate = useNavigate();
  const [newExpenseData, setNewExpenseData] = useState({

    type: "Basic", // Default value for the dropdown
    Dicided_Amount: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch("http://localhost:8000/api/Expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpenseData),
    })
      .then((res) => {
        // Check if the response is successful
        if (res.ok) {
          if (res.status === 201) {
            return res.json().then((data) => {
              alert("Data inserted successfully");
              navigate("/Expense_Show");
            });
          }
        } else {
          // Handle error responses
          return res.json().then((data) => {
            if (res.status === 409) {
              alert(data.error || "Expense type must be unique");
            } else {
              alert(data.error || "Error adding Expense");
            }
            throw new Error(data.error || "Error adding Expense");
          });
        }
      })
      .catch((error) => {
        // Handle fetch or network errors
        console.error("Error adding Expense:", error);
      });
  };
  
  return (
    <>
      <div className="content-body">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Expense</h4>
              <p className="text-muted m-b-15 f-s-12">
                Enter the expense details below.
              </p>
              <div className="basic-form">
                <form>
             
    

                  <div className="form-group">
                    <label>Expense Type</label>
                    <select
                      className="form-control"
                      name="type"
                      value={newExpenseData.type}
                      onChange={handleInputChange}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Decided Amount</label>
                    <input
                      type="text"
                      className="form-control input-default"
                      placeholder="Enter Decided Amount"
                      name="Dicided_Amount"
                      value={newExpenseData.Dicided_Amount}
                      onChange={handleInputChange}
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

export default Expense_Insert;
