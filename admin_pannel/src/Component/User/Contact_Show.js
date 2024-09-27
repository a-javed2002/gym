import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import Modal from 'react-modal';

const Ticket_Show = () => {
  const url = "http://localhost:8000/api/Contact";
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
      responsive: true
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
        fetchInfo();
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data. Please try again.");
      });
  };


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
  function confirmDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Call the delete function if the user confirms
      deletedata(id);
    }
  }
  
  return (
    <div className="content-body">
 
      <div className="container-fluid">
        <div className="row">

          <div className="col-12">

            <div className="card">

              <div className="card-body">

                  <h4 className="card-title mb-0">Contact Table</h4>
             
             
                <div className="table-responsive">
                  <table id="myTable" className="display">
                    <thead>
                      <tr>
                      
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Subject</th>
                        <th>Message</th>
             
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((dataObj) => (
                        <tr key={dataObj._id}>

<td>{dataObj.Name}</td>   
<td>{dataObj.Email}</td>   
<td>{dataObj.Subject}</td>   
<td>{dataObj.Msg}</td>   
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

export default Ticket_Show;
