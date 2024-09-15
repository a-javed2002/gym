import React, { useState, useEffect } from 'react';
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

const Fee_Show = () => {
  const url = "http://localhost:8000/api/Fees";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    fetchInfo();
  }, [year, month]); // Refetch data when filters change

  const fetchInfo = () => {
    fetch(`${url}?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d.data);
        setLoading(false);
        initializeDataTable();
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const initializeDataTable = () => {
    $('#myTable').DataTable({
      responsive: true,
      destroy: true, // Ensure it resets on reload
    });
  };


  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Add a title
    doc.text('Fee Report', 14, 22);
  
    // Add autoTable with custom columns and data
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Father Name', 'Email', 'Subscription', 'Created At', 'Updated At', 'Status', 'Fees']],
      body: [
        ...data.map(fee => [
          fee.User_Id_Fk.User_Name,
          fee.User_Id_Fk.User_FatherName,
          fee.User_Id_Fk.User_Email,
          fee.User_Id_Fk.Subcribtion,
          new Date(fee.createdAt).toLocaleDateString(),
          new Date(fee.User_Id_Fk.updatedAt).toLocaleDateString(),
          fee.User_Id_Fk.User_Status === '1' ? 'Active' : 'Due',
          fee.Monthly_Fees
        ]),
        // Add a total row at the end
        ['Total', '', '', '', '', '', '', data.reduce((sum, fee) => sum + fee.Monthly_Fees, 0)] // Sum up the fees
      ],
      theme: 'grid',
    });
  
    // Save the PDF
    doc.save('fee_report.pdf');
  };
  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees");
    XLSX.writeFile(workbook, "fee_report.xlsx");
  };

  function confirmDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Call the delete function if the user confirms
      deletedata(id);
    }
  }
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

  const updateStatus = (id, status) => {
    fetch(`http://localhost:8000/api/UserStatus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ User_Status: status }),
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
    const newStatus = currentStatus === '1' ? '0' : '1'; // Toggle status
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
    return status === '1' ? 'active-status' : 'disabled-status';
  };
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-0">Fee Table</h4>

                {/* Filters */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Filter by Year</label>
                    <select className="form-control" onChange={handleYearChange}>
                      <option value="">All</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      {/* Add more years as needed */}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label>Filter by Month</label>
                    <select className="form-control" onChange={handleMonthChange}>
                      <option value="">All</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      {/* Add more months */}
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table  className="table">
                    <thead>
                      <tr>
                        {/* Your table headers */}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((fee) => (
                          <tr key={fee._id}>
                          <td>{fee.User_Id_Fk.User_Name}</td>
                          <td>{fee.User_Id_Fk.User_FatherName}</td>
                          <td>{fee.User_Id_Fk.User_Email}</td>
                      
                          <td>
                          <React.Fragment>
                          <style>{style}</style>
                            <button
                              className={`btn ${getStatusClass(fee.User_Id_Fk.User_Status)}`}
                              onClick={() => handleStatusClick(fee.User_Id_Fk._id, fee.User_Id_Fk.User_Status)}
                            >
                              {fee.User_Id_Fk.User_Status === '1' ? 'Active' : 'Due'}
                            </button>
                            </React.Fragment>

                          </td>
               

                          <td>{fee.User_Id_Fk.Subcribtion}</td>
                          <td>{new Date(fee.createdAt).toLocaleDateString()}</td>
                          <td>{new Date(fee.User_Id_Fk.updatedAt).toLocaleDateString()}</td>
                          <td>
                            <img
                              src={`http://localhost:8000/${fee.User_Id_Fk.User_Image}`}
                              alt={`${fee.User_Id_Fk.User_Name}'s image`}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          </td>
                          <td>{fee.Monthly_Fees}</td>
                          <td>
                            <button onClick={() => confirmDelete(fee._id)} className="btn btn-link p-0 text-danger border-0">
                              <i className="bi bi-trash" style={{ fontSize: '1.3rem' }}></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Export Buttons */}
                <div className="mt-4">
                  <button className="btn btn-primary" onClick={exportToPDF}>Download PDF</button>
                  <CSVLink data={data} filename={"fee_report.csv"} className="btn btn-secondary ml-2">Download CSV</CSVLink>
                  <button className="btn btn-success ml-2" onClick={exportToExcel}>Download Excel</button>
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

export default Fee_Show;
