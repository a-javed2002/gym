import React, { useState, useEffect } from 'react';
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';

const Fee_Show = () => {
  const url = "http://localhost:8000/api/Fees";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    fetchInfo();
  }, [year, month]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      initializeDataTable();
    }
  }, [data, loading]);

  const fetchInfo = () => {
    setLoading(true);
    fetch(`${url}?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const initializeDataTable = () => {
    $('#myTable').DataTable({
      responsive: true,
      destroy: true,
    });
  };

  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Fee Report', 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Father Name', 'Email', 'Subscription', 'Created At', 'Updated At', 'Status', 'Fees']],
      body: data.map(fee => [
        fee.User_Id_Fk?.User_Name || 'N/A',
        fee.User_Id_Fk?.User_FatherName || 'N/A',
        fee.User_Id_Fk?.User_Email || 'N/A',
        fee.User_Id_Fk?.Subscription || 'N/A',
        new Date(fee.createdAt).toLocaleDateString(),
        new Date(fee.User_Id_Fk?.updatedAt).toLocaleDateString(),
        fee.User_Id_Fk?.User_Status === '1' ? 'Active' : 'Due',
        fee.Monthly_Fees || 0
      ]),
      theme: 'grid',
    });
    doc.save('fee_report.pdf');
  };

  const prepareCsvData = () => {
    const headers = ['User Name', 'Father Name', 'Email', 'Subscription', 'Created At', 'Updated At', 'Status', 'Monthly Fees'];
    const rows = data.map(fee => [
      fee.User_Id_Fk?.User_Name || 'N/A',
      fee.User_Id_Fk?.User_FatherName || 'N/A',
      fee.User_Id_Fk?.User_Email || 'N/A',
      fee.User_Id_Fk?.Subscription || 'N/A',
      new Date(fee.createdAt).toLocaleDateString(),
      new Date(fee.User_Id_Fk?.updatedAt).toLocaleDateString(),
      fee.User_Id_Fk?.User_Status === '1' ? 'Active' : 'Due',
      fee.Monthly_Fees || 0
    ]);
    const total = data.reduce((sum, fee) => sum + (fee.Monthly_Fees || 0), 0);
    rows.push(['Total', '', '', '', '', '', '', total]);

    return [headers, ...rows];
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(fee => ({
      'User Name': fee.User_Id_Fk?.User_Name || 'N/A',
      'Father Name': fee.User_Id_Fk?.User_FatherName || 'N/A',
      'Email': fee.User_Id_Fk?.User_Email || 'N/A',
      'Subscription': fee.User_Id_Fk?.Subscription || 'N/A',
      'Created At': new Date(fee.createdAt).toLocaleDateString(),
      'Updated At': new Date(fee.User_Id_Fk?.updatedAt).toLocaleDateString(),
      'Status': fee.User_Id_Fk?.User_Status === '1' ? 'Active' : 'Due',
      'Monthly Fees': fee.Monthly_Fees || 0
    })));

    XLSX.utils.sheet_add_aoa(worksheet, [['Total', '', '', '', '', '', '', data.reduce((sum, fee) => sum + (fee.Monthly_Fees || 0), 0)]], { origin: -1 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees");
    XLSX.writeFile(workbook, "fee_report.xlsx");
  };

  function confirmDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deletedata(id);
    }
  }

  const deletedata = (id) => {
    fetch(`${url}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete data');
        alert("Data deleted successfully");
        fetchInfo();
      })
      .catch(() => alert("Error deleting data. Please try again."));
  };

  const updateStatus = (id, status) => {
    fetch(`http://localhost:8000/api/UserStatus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ User_Status: status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then(() => {
        alert("Status updated successfully");
        fetchInfo();
      })
      .catch(() => alert("Error updating status. Please try again."));
  };

  const handleStatusClick = (id, currentStatus) => {
    const newStatus = currentStatus === '1' ? '0' : '1';
    updateStatus(id, newStatus);
  };

  const style = `
    .active-status { color: green; background-color: lightgreen; }
    .disabled-status { color: red; background-color: rgb(255, 196, 196); }
  `;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
  
  const months = [
    { value: '', name: 'All' },
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' },
  ];

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-0">Fee Table</h4>
                <div className='row'>
                  <div className='col-6'></div>
                  <div className='col-6'>
                    <div className="export-buttons d-flex gap-3">
                      <button onClick={exportToPDF} className="btn btn-primary">
                        <FaFilePdf style={{ marginRight: "5px" }} />
                        Export to PDF
                      </button>

                      <CSVLink
                        data={prepareCsvData()}
                        filename="fee_report.csv"
                        className="btn btn-primary"
                      >
                        <FaFileCsv style={{ marginRight: "5px" }} />
                        Export to CSV
                      </CSVLink>

                      <button onClick={exportToExcel} className="btn btn-primary">
                        <FaFileExcel style={{ marginRight: "5px" }} />
                        Export to Excel
                      </button>
                    </div>
                  </div>
                </div>
                {/* Filters */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Filter by Year</label>
                    <select className="form-control" onChange={handleYearChange} value={year}>
                      <option value="">All</option>
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label>Filter by Month</label>
                    <select className="form-control" onChange={handleMonthChange} value={month}>
                      {months.map(month => (
                        <option key={month.value} value={month.value}>{month.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table" id="myTable">
                    <thead>
                      <tr>
                        <th>User Image</th>
                        <th>User Name</th>
                        <th>Father Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Subscription</th>
                        <th>Submission Date</th>
                        <th>Updated At</th>
                        <th>Monthly Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((fee) => (
                        <tr key={fee._id}>
                          <td>
                            <img
                              src={`http://localhost:8000/${fee.User_Id_Fk?.User_Image || 'default-image.jpg'}`} 
                              alt="user"
                              width="100"
                              height="100"
                            />
                          </td>
                          <td>{fee.User_Id_Fk?.User_Name || 'N/A'}</td>
                          <td>{fee.User_Id_Fk?.User_FatherName || 'N/A'}</td>
                          <td>{fee.User_Id_Fk?.User_Email || 'N/A'}</td>
                          <td>
                            <style>{style}</style>
                            <button
                              className={`btn ${fee.User_Id_Fk?.User_Status === '1' ? 'active-status' : 'disabled-status'}`}
                              onClick={() => handleStatusClick(fee.User_Id_Fk?._id, fee.User_Id_Fk?.User_Status)}
                            >
                              {fee.User_Id_Fk?.User_Status === '1' ? 'Active' : 'Due'}
                            </button>
                          </td>
                          <td>{fee.User_Id_Fk?.Subscription || 'N/A'}</td>
                          <td>{fee.createdAt ? new Date(fee.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td>{fee.User_Id_Fk?.updatedAt ? new Date(fee.User_Id_Fk.updatedAt).toLocaleDateString() : 'N/A'}</td>
                          <td>{fee.Monthly_Fees}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fee_Show;
