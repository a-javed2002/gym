import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import Modal from 'react-modal';
import Carousel from 'react-bootstrap/Carousel';
import { FaUserTie,FaEdit , FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa'; // Import icons
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";
const Trainer_Show = () => {
  const url = "http://localhost:8000/api/Trainer";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [exhibitorData, setExhibitorData] = useState(null);

  const navigate = useNavigate();





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
    fetch(`http://localhost:8000/api/User/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete user');
        }
        alert("Data deleted successfully");
        fetchInfo();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      });
  };

  function confirmDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deletedata(id);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="content-body">
      <div className="row page-titles mx-0">
        <div className="col p-md-0">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="javascript:void(0)">Dashboard</a></li>
            <li className="breadcrumb-item active"><a href="javascript:void(0)">Home</a></li>
          </ol>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">User Table</h4>
                <TableContainer component={Paper} style={{ maxWidth: '100%' }}>
                  <Table id="myTable" className="display table"  >
                    <TableHead>
                      <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Arrival / Departure</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((dataObj, index) => (
                        <tr key={index}>
                         <TableCell>{dataObj.User_id_Fk?.User_Name || 'N/A'}   </TableCell>
                         <TableCell>{dataObj.User_id_Fk?.User_Email || 'N/A'}   </TableCell>
                         <TableCell>{dataObj.User_id_Fk?.User_Role || 'N/A'}   </TableCell>
                         <TableCell>{dataObj.User_id_Fk?.User_Status || 'N/A'}   </TableCell>
                         <TableCell>{dataObj.User_id_Fk?.User_Phone || 'N/A'}   </TableCell>
                        
                         <TableCell>
                            {dataObj.User_id_Fk?.User_Image && (
                              <img
                                src={`http://localhost:8000/${dataObj.User_id_Fk.User_Image}`}
                                alt="User"
                                style={{ width: '50px', height: '50px' }}
                              />
                            )}
                             </TableCell>

                         <TableCell>
                            <table className="table">
                              {dataObj.TrainerTimes.map((ds, index) =>

                                <tr>
                                 <TableCell>
                                    {ds.arrival}
                                 
                                     </TableCell>

                                 <TableCell>
                               
                                    {ds.departure}
                                     </TableCell>
                                </tr>
                              )}
                            </table>
                             </TableCell>
                         <TableCell>
                            <table className="table">
                              {dataObj.SalaryDetails.map((ds, index) =>

                                <tr>
                                 <TableCell>
                                    {ds.Amount}
                                 
                                     </TableCell>

                           
                                </tr>
                              )}
                            </table>
                             </TableCell>
                          <TableCell className="center hidden-phon p-3">
                          <Link to={`/Trainer_Update/${dataObj.User_id_Fk._id}`} className="btn btn-info btn-md text-light">
                           <FaEdit/>
                          </Link>
                           </TableCell>
                         <TableCell>
                            <button
                              onClick={() => confirmDelete(dataObj._id)}
                              className="btn btn-link p-0 text-danger border-0"
                            >
                              <i className="bi bi-trash" style={{ fontSize: '1.3rem' }}></i>
                            </button>
                             </TableCell>
                        </tr>
                      ))}
                    </TableBody>
                  </Table>

                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Trainer_Show;
