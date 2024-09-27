import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery'; 
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
// Modal styles for the react-modal
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px'
  }
};

const Client_Show = () => {
  const user = useSelector((state) => state.auth.user);
  const loggedInUserId = user.id;
  // const loggedInUserId = localStorage.getItem('id'); 
  const url = `http://localhost:8000/api/Client/${loggedInUserId}`;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const openModal = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

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
      .then((data) => {
        console.log('Fetched data:', data); // Ensure data is printed
        if (Array.isArray(data)) {
          setData(data); // Ensure this matches the expected structure
        } else {
          console.error("Unexpected data structure:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  };

  const initializeDataTable = () => {
    if ($.fn.DataTable.isDataTable('#myTable')) {
      $('#myTable').DataTable().destroy();
    }
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
                <div className="table-responsive">
                  <table id="myTable" className="display table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Image</th>
                        <th>Details</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((dataObj, index) => (
                        dataObj.Client_id_Fk && dataObj.Client_id_Fk.map((client) => (
                          <tr key={client._id || index}>
                            <td>{client.User_Name || 'No User_Name'}</td>
                            <td>{client.User_Email || 'No Email'}</td>
                            <td>{client.User_Phone || 'No Phone'}</td>
                            <td>
                              {client.User_Image && (
                                <img src={`http://localhost:8000/${client.User_Image}`} alt="User" style={{ width: '50px', height: '50px ' }} />
                              )}
                            </td>
                            <td>
                              <Link to={`/Client_Detail/${client._id }`} className="text-info">
                                <i className="bi bi-pencil" style={{ fontSize: '1.5rem' }}></i>
                              </Link>
                            </td>
                            <td>
                              <button onClick={() => confirmDelete(client._id)} className="btn btn-link p-0 text-danger border-0" aria-label="Delete">
                                <i className="bi bi-trash" style={{ fontSize: '1.3rem' }}></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <h2>User Details</h2>
        {selectedUser && (
          <div>
            <p><strong>Name:</strong> {selectedUser.User_Name || 'No Name'}</p>
            <p><strong>Email:</strong> {selectedUser.User_Email || 'No Email'}</p>
            <p><strong>Role:</strong> {selectedUser.User_Role || 'No Role'}</p>
            <p><strong>Status:</strong> {selectedUser.User_Status || 'No Status'}</p>
            <p><strong>Father's Name:</strong> {selectedUser.User_FatherName || 'No Father\'s Name'}</p>
            <p><strong>Phone:</strong> {selectedUser.User_Phone || 'No Phone'}</p>
            <p><strong>Subscription:</strong> {selectedUser.Subcribtion || 'No Subscription'}</p>
            {selectedUser.User_Image && (
              <div>
                <strong>Image:</strong>
                <img src={`http://localhost:8000/${selectedUser.User_Image}`} alt="User" style={{ width: '100px', height: '100px' }} />
              </div>
            )}
            <button onClick={closeModal} className="btn btn-secondary">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Client_Show;
