import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '10px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
};

export const ViewUsers = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function openModal(user) {
    setSelectedUser(user);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedUser(null);
  }

  const url = "http://localhost:8000/api/users";
  const [data, setdata] = useState([]);

  const FetchUser = () => {
    return fetch(url)
      .then((res) => res.json())
      .then((d) => setdata(d));
  };

  useEffect(() => {
    FetchUser();
  }, []);

  const Delete = (id) => {
    fetch(${url}/${id}, {
      method: "DELETE",
    })
      .then(() => {
        alert("Data deleted successfully");
        return FetchUser();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      });
  };

  return (
    <>
      <main className="content">
        <div className="container-fluid p-0">
          <div className="row justify-content-between align-items-center mb-3">
            <div className="col-4">
              <h1 className="mb-0">Users</h1>
            </div>
            <div className="col-4 text-end">
              <Link className="btn btn-primary fs-5" to={'/addusers'}>
                Create Users
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Role</th>
                        <th scope="col">Image</th>
                        <th scope="col">View</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <th>{index}</th>
                          <td>{item.Username}</td>
                          <td>{item.Role}</td>
                          <td>
                            <img src={http://localhost:8000/Profile/${item.file}} height={100} width={100} alt="User Profile"/>
                          </td>
                          <td>
                            <button className="btn btn-success" onClick={() => openModal(item)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                              </svg>
                            </button>
                          </td>
                          <td>
                            <Link className="btn btn-primary" to={/editusers/${item._id}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                              </svg>
                            </Link>
                          </td>
                          <td>
                            <button className="btn btn-danger" onClick={() => { Delete(item._id) }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
                  <h2>User Details</h2>
                  {selectedUser && (
                    <div>
                      <p><strong>ID:</strong> {selectedUser._id}</p>
                      <p><strong>Name:</strong> {selectedUser.Username}</p>
                      <p><strong>Role:</strong> {selectedUser.Role}</p>
                      <p><strong>Password:</strong> {selectedUser.Password}</p>
                      <img src={http://localhost:8000/Profile/${selectedUser.file}} height={100} width={100} alt="User Profile"/>
                    </div>
                  )}
                  <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}