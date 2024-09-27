import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';

const Expense_Show = () => {
  const url = "http://localhost:8000/api/Expense";
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
      responsive: true,
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
        fetchInfo(); // Refresh the data after deletion
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data. Please try again.");
      });
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deletedata(id);
    }
  };

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="card-title mb-0">Expense Table</h4>
                  <Link to="/Expense_Insert" className="btn btn-primary text-light text-decoration-none">
                    Add Expense
                  </Link>
                </div>
                <div className="table-responsive">
                  <table id="myTable" className="display">
                    <thead>
                      <tr>
                   
                        <th>Type</th>
                        <th>Decided Amount</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((dataObj) => (
                        <tr key={dataObj._id}>
                     
                          <td>{dataObj.type}</td>
                          <td>{dataObj.Dicided_Amount}</td>
                          <td>
                            <Link to={`/Expense_Edit/${dataObj._id}`} className="text-info">
                              <i className="bi bi-pencil" style={{ fontSize: '1.5rem' }}></i>
                            </Link>
                          </td>
                          <td>
                            <button
                              onClick={() => confirmDelete(dataObj._id)}
                              className="btn btn-link p-0 text-danger border-0"
                            >
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
    </div>
  );
};

export default Expense_Show;
