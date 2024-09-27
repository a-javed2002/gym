import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'; // Import DateTime styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap modal components
import { FaTrash, FaPlus } from 'react-icons/fa';
function Trainer_Insert() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    User_Name: "",
    User_Email: "",
    User_Password: "",
    User_FatherName: "",
    User_Image: null,
    User_Phone: "",
    User_Status: "1",
    User_Role: "Trainer",
    Trainer_id_Fk: "",
    Subcribtion: "",
    
    TrainerTimes: [{ TrainerArrivalTime: "", TrainerDepartureTime: "" }], 
    SalaryDetails: [{ Amount: "", Status: "1" }], 
  });

  const [showModal, setShowModal] = useState(false); // Manage modal visibility

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
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

  const handleAddUser = async () => {
    const data = new FormData();
  for (const key in formData) {
    if (Array.isArray(formData[key])) {
      formData[key].forEach((item, index) => {
        for (const subKey in item) {
          data.append(`${key}[${index}][${subKey}]`, item[subKey]);
        }
      });
    } else if (formData[key]) {
      data.append(key, formData[key]);
    }
  }
    try {
      const response = await fetch("http://localhost:8000/api/User", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Data Inserted successfully");
        navigate("/Trainer_Show");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error adding user");
      }
    } catch (error) {
      console.error("Error adding User:", error);
      alert("Error adding user data: " + error.message);
    }
  };
  const style = {
    backgroundColor:  '#6f42c1',
    color: 'white',

  };
  const style2 = {
    backgroundColor: '#6f42c1 ',
    color: 'white',
    
  };
  
  return (
    <div className="content-body">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Add Trainer</h4>
            <div className="basic-form">
              <form>
                {/* Form Fields */}
                <label>Trainer Name</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Your Name"
                    name="User_Name"
                    value={formData.User_Name}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Email</label>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control input-default"
                    placeholder="Enter Your Email"
                    name="User_Email"
                    value={formData.User_Email}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Password</label>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control input-default"
                    placeholder="Enter Your Password"
                    name="User_Password"
                    value={formData.User_Password}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Image</label>
                <div className="form-group">
                  <input
                    type="file"
                    className="form-control input-default"
                    name="User_Image"
                    onChange={handleInputChange}
                  />
                </div>
                <label>Trainer Phone</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Your Phone"
                    name="User_Phone"
                    value={formData.User_Phone}
                    onChange={handleInputChange}
                  />
                </div>
                <label>Salary</label>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control input-default"
                    placeholder="Enter Trainer Salary"
                    name="SalaryDetails[0].Amount" // Corrected field name for SalaryDetails
                    value={formData.SalaryDetails[0].Amount}
                    onChange={(e) => {
                      const { value } = e.target;
                      setFormData((prevData) => {
                        const newSalaryDetails = [...prevData.SalaryDetails];
                        newSalaryDetails[0].Amount = value;
                        return {
                          ...prevData,
                          SalaryDetails: newSalaryDetails,
                        };
                      });
                    }}
                  />
                </div>
                <Button
                  variant="primary"
                  className="d-block mb-4"
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus className="me-2" /> {/* Adds a plus icon with right margin */}
                  Add Time Slots
                </Button>
                <button type="button" className="btn btn-primary" onClick={handleAddUser}>
                  Submit
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
        style={{margin: 'auto',overflowY:'hidden' }}
      >
        <Modal.Header closeButton className="bg-primary text-white" style={style2}>


          <Modal.Title className="modal-title-custom">Trainer Time Slots</Modal.Title>


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
                    style={{backgroundColor:'red'}}
                  >
                    <FaTrash /> {/* Trash icon */}
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
              <FaPlus className="me-2" /> Add Time Slot {/* Plus icon */}
            </Button>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  );
}

export default Trainer_Insert;
