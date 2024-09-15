import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Style.css';
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap modal components
import { FaTrash, FaPlus } from 'react-icons/fa';

function User_Update() {
  const { id } = useParams(); // Get user id from URL params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({

    User_Role: "User",
    Trainer_id_Fk: "",
    Subcribtion: "",
    TrainerArrivalTime: "",
    TrainerDepartureTime: "",
    UserTiming: "",

  });

  useEffect(() => {
    // Fetch existing user data by id
    fetch(`http://localhost:8000/api/User/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      User_Image: imageFile,
    }));
  };

  const handleTrainerSelection = (trainerId) => {

    setFormData((prevData) => ({
      ...prevData,
      Trainer_id_Fk: trainerId,
    }));
    setShowModal(false);
  };

  const handleUpdateUser = () => {
    const data = { ...formData };
    fetch(`http://localhost:8000/api/updateUserData/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            alert("Data Updated successfully");

          });
        } else {
          return res.json().then((data) => {
            throw new Error(data.error || "Error updating user");
          });
        }
      })
      .catch((error) => {
        console.error("Error updating User:", error);
        alert("Error updating user data: " + error.message);
      });
  };

  const [data1, setData1] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/Trainer")
      .then((res) => res.json())
      .then((d) => setData1(d))
      .catch((error) => console.error("Error fetching trainer data:", error));
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);

  const handleCardClick = (trainerId) => {
    setFormData((prevData) => ({
      ...prevData,
      Trainer_id_Fk: trainerId,
    }));
    setShowModal(false);
    handleTrainerSelection(trainerId);
  };
  return (

    <div className="content-body d-flex  justify-content-center " style={{ overflowY: 'auto', height: '500px', maxHeight: '2000px', }}>
      <div className="col-lg-6 ">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update User</h4>
            <p className="text-muted m-b-15 f-s-12"> <code>User Profile Here</code></p>
            <div className="basic-form">
              <form encType="multipart/form-data">
                {formData.User_Image && (
                  <div className="image-preview text-center">
                    <img
                      src={`http://localhost:8000/${formData.User_Image}`}
                      alt="Uploaded Preview"
                      style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <label>User Name</label>
                <div className="form-group">
                  <input type="text" disabled className="form-control input-default" placeholder="Enter Your Name" name="User_Name" value={formData.User_Name} onChange={handleInputChange} />
                </div>
                <label>Email</label>
                <div className="form-group">
                  <input type="email" disabled className="form-control input-default" placeholder="Enter Your Email" name="User_Email" value={formData.User_Email} onChange={handleInputChange} />
                </div>

                <label>Father's Name</label>
                <div className="form-group">
                  <input type="text" disabled className="form-control input-default" placeholder="Enter Father's Name" name="User_FatherName" value={formData.User_FatherName} onChange={handleInputChange} />
                </div>
                <label>Phone</label>
                <div className="form-group">
                  <input type="text" disabled className="form-control input-default" placeholder="Enter Your Phone" name="User_Phone" value={formData.User_Phone} onChange={handleInputChange} />
                </div>

                <label>Change Timing</label>
                <div className="form-group">
                  <input type="time" className="form-control input-default" placeholder="Change Time" name="UserTiming" value={formData.UserTiming} onChange={handleInputChange} />
                </div>



                <label>Subscription</label>
                <div className="row">
                  <div className="radio-group col-6 d-flex justify-content-between">
                    <label className={`radio-label ${formData.Subcribtion === "Basic" ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="Subcribtion"
                        value="Basic"
                        checked={formData.Subcribtion === "Basic"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Basic
                    </label>

                    <label className={`radio-label ${formData.Subcribtion === "Premium" ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="Subcribtion"
                        value="Premium"
                        checked={formData.Subcribtion === "Premium"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Premium
                    </label>
                  </div>
                  {formData.Subcribtion === "Premium" && (
                    <>

                      <Button
                        variant="primary"
                        className="d-block mb-4"
                        onClick={() => setShowModal(true)}
                      >
                        <FaPlus className="me-2" /> {/* Adds a plus icon with right margin */}
                        Add Trainer
                      </Button>

                    </>
                  )}
                </div>
                <div className="text-center">
                  <button type="button" className="btn  btn-primary text-center" onClick={handleUpdateUser}>Update</button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="trainer-time-slots-modal"
        style={{ margin: 'auto', overflowY: 'hidden' }}
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Trainer Time Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {data1.map((trainer) => (
              <div
                key={trainer._id}
                className="col-md-6 mb-4"
                style={{
                  border: (trainer._id === formData.Trainer_id_Fk || trainer._id === selectedTrainerId) ? '2px solid blue' : '1px solid gray',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick(trainer._id)}
              >
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {trainer.User_id_Fk?.User_Name || 'N/A'}
                    </h5>
                    <p className="card-text">
                      Clients: {trainer.Client_id_Fk?.length || 0}
                    </p>
                    <div className="time-slots">
                      {trainer.TrainerTimes.length > 0 ? (
                        trainer.TrainerTimes.map((time, idx) => (
                          <p key={idx} className="mb-1">
                            <strong>Arrival:</strong> {time.arrival} | <strong>Departure:</strong> {time.departure}
                          </p>
                        ))
                      ) : (
                        <p>No time slots available</p>
                      )}
                    </div>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click event
                        handleTrainerSelection(trainer.User_id_Fk._id);
                      }}
                    >
                      Select {trainer.User_id_Fk?.User_Name || 'Trainer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

    </div>

  );
}

export default User_Update;
