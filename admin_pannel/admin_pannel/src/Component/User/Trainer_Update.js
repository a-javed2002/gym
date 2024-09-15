import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'; // Import DateTime styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap modal components
import { FaTrash, FaPlus } from 'react-icons/fa';

function Trainer_Update() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get trainerId from URL parameters

  const [formData, setFormData] = useState({
    User_Name: "",
    User_Email: "",
    User_Phone: "",
    User_Status: "1",
    User_Role: "Trainer",
    Trainer_id_Fk: "",
    TrainerTimes: [{ arrival: "", departure: "" }],
    SalaryDetails: [{ Amount: "", Status: "1", DateReceived: new Date().toISOString() }],
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTrainerData();
    }
  }, [id]);

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/TrainerEdit/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data,
          TrainerTimes: data.TrainerTimes || [] ,
          SalaryDetails: data.SalaryDetails || [] 
        });
      } else {
        throw new Error("Failed to fetch trainer data");
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "Amount") {
      // Update the Amount field in the first SalaryDetails object
      const updatedSalaryDetails = [...formData.SalaryDetails];
      if (updatedSalaryDetails.length > 0) {
        updatedSalaryDetails[0].Amount = value;
      } else {
        updatedSalaryDetails.push({ Amount: value, Status: "1", DateReceived: new Date().toISOString() });
      }
      setFormData((prevData) => ({
        ...prevData,
        SalaryDetails: updatedSalaryDetails,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleTimeChange = (index, field, value) => {
    const newTimes = [...formData.TrainerTimes];
    newTimes[index][field] = value ? value.format("HH:mm") : "";
    setFormData((prevData) => ({
      ...prevData,
      TrainerTimes: newTimes,
    
    }));
  };

  const addTimeSlot = () => {
    setFormData((prevData) => ({
      ...prevData,
      TrainerTimes: [...prevData.TrainerTimes, { arrival: "", departure: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      TrainerTimes: prevData.TrainerTimes.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTrainer = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/TrainerUpdateTimeSlots/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",  // Make sure to set the content type to JSON
        },
        body: JSON.stringify({ TrainerTimes: formData.TrainerTimes, SalaryDetails: formData.SalaryDetails }),  // Send TrainerTimes as JSON
      });

      if (response.ok) {
        const result = await response.json();
        alert("Data updated successfully");
        navigate("/Trainer_Show");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating User:", error);
      alert("Error updating user data: " + error.message);
    }
  };


  const style = {
    backgroundColor: '#6f42c1',
    color: 'white',
  };

  return (
    <div className="content-body d-flex  justify-content-center " style={{ overflowY: 'auto',height:'700px' }}>
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update Trainer</h4>
            <div className="basic-form">
              <form>
                {formData?.User_id_Fk?.User_Image && (
                  <div className="image-preview text-center">
                    <img
                      src={`http://localhost:8000/${formData?.User_id_Fk?.User_Image}`}
                      alt="Uploaded Preview"
                      style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Other form fields */}
                <label>Trainer Name</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Your Name"
                    name="User_Name"
                    disabled
                    value={formData?.User_id_Fk?.User_Name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Email</label>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control input-default"
                    placeholder="Enter Your Email"
                    disabled
                    name="User_Email"
                    value={formData?.User_id_Fk?.User_Email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Phone</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Your Phone"
                    disabled
                    name="User_Phone"
                    value={formData?.User_id_Fk?.User_Phone || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Salary</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Trainer Salary"
            
                    name="Amount"
                    value={formData?.SalaryDetails?.[0]?.Amount || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  variant="primary"
                  className="d-block mb-4"
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus className="me-2" />
                  Edit Time Slots
                </Button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateTrainer}>
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="trainer-time-slots-modal"
        style={{ margin: 'auto', overflowY: 'hidden' }}
      >
        <Modal.Header closeButton className="bg-primary text-white" style={style}>
          <Modal.Title>Trainer Time Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData.TrainerTimes.map((timeSlot, index) => (
            <div key={index} className="form-group mb-4">
              <div className="time-slot-container">
                <div className="text-end">
                  <Button
                    variant="danger"
                    size="sm"
                    className="remove-slot-btn"
                    onClick={() => removeTimeSlot(index)}
                    style={{ backgroundColor: 'red' }}
                  >
                    <FaTrash />
                  </Button>
                </div>
                <div className="time-slot">
                  <label className="form-label">Arrival Time</label>
                  <DateTime
                    value={timeSlot.arrival}
                    onChange={(value) => handleTimeChange(index, 'arrival', value)}
                    dateFormat={false}
                    timeFormat="hh:mm A"
                    className="time-picker"
                  />
                </div>
                <div className="time-slot">
                  <label className="form-label">Departure Time</label>
                  <DateTime
                    value={timeSlot.departure}
                    onChange={(value) => handleTimeChange(index, 'departure', value)}
                    dateFormat={false}
                    timeFormat="hh:mm A"
                    className="time-picker"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-center">
            <Button variant="success" className="add-slot-btn" onClick={addTimeSlot}>
              <FaPlus className="me-2" /> Add Time Slot
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Trainer_Update;
