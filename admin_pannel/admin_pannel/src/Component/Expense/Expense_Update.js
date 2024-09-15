import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Expense_Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8000/api/Expense/${id}`;
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching the expense data based on the ID
  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch expense details');
        }
        return res.json();
      })
      .then((data) => {
        setExpenseData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expense details:", error);
        setError(error);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading expense details: {error.message}</div>;
  }

  // Handling input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handling the form submission to update the expense
  const handleSubmit = () => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update expense');
        }
        return res.json();
      })
      .then(() => {
        alert('Expense updated successfully');
        navigate('/Expense_Show');
      })
      .catch((error) => {
        console.error('Error updating expense data:', error);
        alert('Error updating expense data. Please try again.');
      });
  };

  return (
    <div className="content-body">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Edit Expense</h4>
            <p className="text-muted m-b-15 f-s-12">
              <code>Update the expense details below.</code>
            </p>
            <div className="basic-form">
              <form>
          
                <label>Type</label>
                <div className="form-group">
                  <select
                    className="form-control input-default"
                    name="type"
                    value={expenseData.type}
                    onChange={handleInputChange}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>

                <label>Decided Amount</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Decided Amount"
                    name="Dicided_Amount"
                    value={expenseData.Dicided_Amount}
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
  );
}

export default Expense_Edit;
