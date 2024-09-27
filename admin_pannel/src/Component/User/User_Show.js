import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import { Modal, Button } from "react-bootstrap";
import { FaUserTie, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa'; // Import icons
import { useSelector, useDispatch } from 'react-redux';
// const loggedInUserId = localStorage.getItem('id');
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,  IconButton } from "@mui/material";
const User_Show = () => {
  const user = useSelector((state) => state.auth.user);
  const loggedInUserId = user.id;

  const url = "http://localhost:8000/api/User";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [exhibitorData, setExhibitorData] = useState(null);

  const navigate = useNavigate();

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

  const fetchExhibitorDetails = (id) => {
    fetch(`http://localhost:8000/api/Trainer/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Trainer data not found");
        }
        return res.json();
      })
      .then((d) => {
        setExhibitorData(d);
        console.log("Exhibitor Data:", d); // Correctly log the fetched data
      })
      .catch((error) => {
        console.error("Error fetching trainer details:", error);
        alert("Error fetching trainer details.");
      });
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsMainModalOpen(true); // Open main modal
    fetchExhibitorDetails(user._id); // Fetch trainer details after opening the main modal
  };

  const closeTrainerModal = () => {
    setIsTrainerModalOpen(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const tableRef = React.useRef(null);

  useEffect(() => {
    if (!loading && tableRef.current) {
      initializeDataTable();
    }
  }, [loading]);
  
  const initializeDataTable = () => {
    if (tableRef.current) {
      $(tableRef.current).DataTable({
        responsive: true
      });
    }
  };
  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deletedata(id);
    }
  };

  const deletedata = (id) => {
    fetch(`${url}/${id}`, {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
                  <Table ref={tableRef}  id="myTable" className="display table"  >
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>User Name</th>
                        <th>Email</th>


                        <th>Father Name</th>
                        <th>Phone</th>
                        <th>Subscription </th>


                        <th>R.Date</th>

                        <th>Status </th>
                        <th>Detail</th>

                        <th>Delete</th>
                      </tr>
                    </thead>
                    <TableBody>
                      {data.map((dataObj, index) => (
                      <tr key={dataObj._id}>

                          <td>
                            <img
                              src={`http://localhost:8000/${dataObj.User_Image}`}
                              alt="User"
                              style={{ width: '50px', height: '50px' }}
                              onError={(e) => {
                                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png';
                              }}
                            />
                          </td>


                          <td>{dataObj.User_Name}</td>
                          <td>{dataObj.User_Email}</td>

                          <td>{dataObj.User_FatherName}</td>
                          <td>{dataObj.User_Phone}</td>

                          <td>{dataObj.Subcribtion}</td>
                          <td>{new Date(dataObj.createdAt).toLocaleDateString()}</td>

                          <React.Fragment>
                            <style>{style}</style>
                            <td>
                              <button
                                className={`btn ${getStatusClass(dataObj.User_Status)}`}
                                onClick={() => handleStatusClick(dataObj._id, dataObj.User_Status)}
                              >
                                {dataObj.User_Status === '1' ? 'Active' : 'Disabled'}
                              </button>
                            </td>
                          </React.Fragment>
                          <td>
                            <button className="btn btn-primary" onClick={() => openModal(dataObj)}>
                              <FaInfoCircle /> Details
                            </button>
                          </td>
                          <td>
                            <button onClick={() => confirmDelete(dataObj._id)} className="btn btn-link p-0 text-danger border-0">
                              <i className="bi bi-trash" style={{ fontSize: '1.3rem' }}></i>
                            </button>
                          </td>
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

      {/* Main Modal */}
      <Modal show={isMainModalOpen} onHide={() => setIsMainModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>User Name:</strong> {selectedUser.User_Name}</p>
              <p><strong>Email:</strong> {selectedUser.User_Email}</p>
              <p><strong>Role:</strong> {selectedUser.User_Role}</p>
              <p><strong>Father Name:</strong> {selectedUser.User_FatherName}</p>
              <p><strong>Phone:</strong> {selectedUser.User_Phone}</p>
              <p><strong>Image:</strong></p>
              {selectedUser.User_Image && (
                <img src={`http://localhost:8000/${selectedUser.User_Image}`} alt="User" style={{ width: '100px', height: '100px' }} />
              )}
              <p><strong>Subscription:</strong> {selectedUser.Subcribtion}</p>
              <p><strong>Registration Date:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsMainModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setIsTrainerModalOpen(true)}>
            Show Trainer Details
          </Button>
          {selectedUser && (
            <Link to={`/User_Edit/${selectedUser._id}`} className="btn btn-primary btn-md">
              Edit
            </Link>
          )}
        </Modal.Footer>
      </Modal>


      <Modal show={isTrainerModalOpen} onHide={closeTrainerModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Trainer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {exhibitorData ? (
            <div>

              {exhibitorData.User_id_Fk.User_Image && (
                <div className="image-preview text-center">
                  <img
                    src={`http://localhost:8000/${exhibitorData.User_id_Fk.User_Image}`}
                    alt="Uploaded Preview"
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
              )}




              {/* Map through TrainerTimes array and display all time slots */}
              {exhibitorData.TrainerTimes && exhibitorData.TrainerTimes.length > 0 ? (
                <div>
                  <h5>Trainer Time Slots:</h5>
                  <ul>
                    {exhibitorData.TrainerTimes.map((timeSlot, index) => (
                      <li key={timeSlot._id}>
                        <p><strong>Time Slot {index + 1}</strong></p>
                        <p><strong>Arrival:</strong> {timeSlot.arrival}</p>
                        <p><strong>Departure:</strong> {timeSlot.departure}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No trainer times available</p>
              )}
              <div>
                <h5>User Details</h5>
                <p><strong>Name:</strong> {exhibitorData.User_id_Fk.User_Name}</p>
                <p><strong>Email:</strong> {exhibitorData.User_id_Fk.User_Email}</p>
                <p><strong>Phone:</strong> {exhibitorData.User_id_Fk.User_Phone}</p>

              </div>



            </div>
          ) : (
            <p>Loading trainer details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTrainerModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default User_Show;
