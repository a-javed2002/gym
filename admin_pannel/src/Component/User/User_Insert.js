
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Style.css';
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap modal components
import { FaTrash, FaPlus } from 'react-icons/fa';
function User_Insert() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    User_Name: "",
    User_Email: "",
    User_Password: "",
    User_FatherName: "",
    User_Image: null,
    User_Phone: "",
    User_Status: "1",
    User_Role: "User",
    Trainer_id_Fk: "",
    Subcribtion: "",
    TrainerArrivalTime: "",
    TrainerDepartureTime: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    UserTiming: ""
  });
  const [errors, setErrors] = useState({
    User_Phone: "",
    User_Password: "",
    formInvalid: false,
  });

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
    setFormData({
      ...formData,
      Trainer_id_Fk: trainerId,
    });
    console.log(`aaaaa ${trainerId}`)
    setShowModal(false);  // Close the modal after selection
  };
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};


    // Password must be at least 3 characters long
    if (formData.User_Password.length < 3) {
      newErrors.User_Password = "Password must be at least 3 characters long.";
      isValid = false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.User_Phone)) {
      newErrors.User_Phone = "Phone number format is not correct. It must be 10 digits.";
      isValid = false;
    }
 // Email validation
 const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 if (!emailRegex.test(formData.User_Email)) {
   newErrors.User_Email = "Email format is not correct.";
   isValid = false;
 }

    // User Name must be at least 3 characters long and contain only letters
    const nameRegex = /^[A-Za-z]{3,}$/;
    if (!nameRegex.test(formData.User_Name)) {
      newErrors.User_Name = "User name must be at least 3 letters long and contain only alphabets.";
      isValid = false;
    }

    // Password must be at least 3 characters long
    if (formData.User_Password.length < 3) {
      newErrors.User_Password = "Password must be at least 3 characters long.";
      isValid = false;
    }

    // Age must be greater than or equal to 1
    if (Number(formData.age) < 1) {
      newErrors.age = "Age must be greater than or equal to 1.";
      isValid = false;
    }

    // Father's Name should only contain letters
    const fatherNameRegex = /^[A-Za-z]+$/;
    if (!fatherNameRegex.test(formData.User_FatherName)) {
      newErrors.User_FatherName = "Father's name must contain only letters.";
      isValid = false;
    }

    // Check if any required field is empty
    const requiredFields = ['User_Name', 'User_Email', 'User_Password', 'User_FatherName', 'User_Phone', 'gender', 'age'];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        isValid = false;
        newErrors.formInvalid = "All required fields must be filled out.";
      }
    });
    setErrors(newErrors); // Set the errors state with new errors

    return isValid;
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // If form is invalid, stop the form submission
    }

    const Data = new FormData();
    // Append form data
    Data.append("User_Name", formData.User_Name);
    Data.append("User_Email", formData.User_Email);
    Data.append("User_Password", formData.User_Password);
    Data.append("User_FatherName", formData.User_FatherName);
    Data.append("User_Phone", formData.User_Phone);
    Data.append("User_Status", formData.User_Status);
    Data.append("User_Role", formData.User_Role);
    Data.append("Trainer_id_Fk", formData.Trainer_id_Fk);
    Data.append("Subcribtion", formData.Subcribtion);
    Data.append("TrainerArrivalTime", formData.TrainerArrivalTime);
    Data.append("TrainerDepartureTime", formData.TrainerDepartureTime);
    Data.append("User_Image", formData.User_Image);
    Data.append("gender", formData.gender);
    Data.append("age", formData.age);
    Data.append("height", formData.height);
    Data.append("weight", formData.weight);
    Data.append("UserTiming", formData.UserTiming);

    fetch("http://localhost:8000/api/User", {
      method: "POST",
      body: Data,
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json().then((data) => {
            alert("Data Inserted successfully");
            navigate("/User_Show");
          });
        } else {
          return res.json().then((data) => {
            throw new Error(data.error || "Error adding user");
          });
        }
      })
      .catch((error) => {
        console.error("Error adding User:", error);
        alert("Error adding user data: " + error.message);
      });
  };

  const url1 = "http://localhost:8000/api/Trainer";
  const [data1, setData1] = useState([]);

  useEffect(() => {
    fetch(url1)
      .then((res) => res.json())
      .then((d) => setData1(d))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const [showModal, setShowModal] = useState(false); // Manage modal visibility
  const style2 = {
    backgroundColor: '#6f42c1 ',
    color: 'white',

  };
  return (
    <div className="content-body">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">User</h4>
            <p className="text-muted m-b-15 f-s-12"><code>This section pertains to the client registration form for the gym.</code> </p>
            <div className="basic-form">
              <form encType="multipart/form-data" onSubmit={handleAddUser}>
                <label>User Name</label>
                <div className="form-group">
                  <input type="text" className="form-control input-default" required placeholder="Enter Your Name" name="User_Name" value={formData.User_Name} onChange={handleInputChange} />
                  {errors.User_Name && <small className="text-danger">{errors.User_Name}</small>}
                </div>
                <label>User Email</label>
                <div className="form-group">
                  <input type="email" required className="form-control input-default" placeholder="Enter Your Email" name="User_Email" value={formData.User_Email} onChange={handleInputChange} />
                  {errors.User_Email && <small className="text-danger">{errors.User_Email}</small>}
                </div>
                <label>User Password</label>
                <div className="form-group">
                  <input type="password" required className="form-control input-default" placeholder="Enter Your Password" name="User_Password" value={formData.User_Password} onChange={handleInputChange} />
                  {errors.User_Password && <small className="text-danger">{errors.User_Password}</small>}
                </div>
                <label>User Father Name</label>
                <div className="form-group">
                  <input type="text" required className="form-control input-default" placeholder="Enter Father's Name" name="User_FatherName" value={formData.User_FatherName} onChange={handleInputChange} />
                  {errors.User_FatherName && <small className="text-danger">{errors.User_FatherName}</small>}
                </div>
                <label>User Phone</label>
                <div className="form-group">
                  <input type="text" required className="form-control input-default" placeholder="Enter Your Phone" name="User_Phone" value={formData.User_Phone} onChange={handleInputChange} />
                  {errors.User_Phone && <small className="text-danger">{errors.User_Phone}</small>}
                </div>

                <label>Gender</label>
                <div className="form-group row">
                  <div className="radio-group col-4 d-flex justify-content-between">
                    <label className={`radio-label ${formData.gender === "male" ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Male
                    </label>

                    <label className={`radio-label ${formData.gender === "female" ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Female
                    </label>

                    <label className={`radio-label ${formData.gender === "other" ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      Other
                    </label>
                  </div>
                </div>

                <label>Age</label>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control input-default"
                    placeholder="Enter Age"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                  {errors.age && <small className="text-danger">{errors.age}</small>}
                </div>

                <label>Height (cm)</label>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control input-default"
                    placeholder="Enter Height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>

                <label>Weight (kg)</label>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control input-default"
                    placeholder="Enter Weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>

                <label>Subscription</label>
                <div className="row">
                  <div className="radio-group col-2 d-flex justify-content-between">
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

                    <label>Timing</label>
                    <div className="form-group">
                      <input
                        type="Time"
                        className="form-control input-default"
                        placeholder="Enter Time"
                        name="UserTiming"
                        value={formData.UserTiming}
                        onChange={handleInputChange}
                      />
                    </div>

                  </>
                )}

                <label>User Image URL</label>
                <div className="form-group">
                  <input type="file" className="form-control input-default" name="User_Image" onChange={handleFileChange} />
                </div>
                <p>                {errors.formInvalid && <small className="text-danger">{errors.formInvalid}</small>}</p>
                <button type="submit" className="btn mb-1 btn-primary" >Submit</button>

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
          <Modal.Title className="modal-title-custom">Trainer Time Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {data1.map((Trainer) => (
              <div key={Trainer._id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {Trainer.User_id_Fk?.User_Name || 'N/A'}
                    </h5>
                    <p className="card-text">
                      Clients: {Trainer.Client_id_Fk?.length || 0}
                    </p>
                    <div className="time-slots">
                      {Trainer.TrainerTimes.length > 0 ? (
                        Trainer.TrainerTimes.map((time, idx) => (
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
                      onClick={() => handleTrainerSelection(Trainer.User_id_Fk._id)}
                    >
                      Select {Trainer.User_id_Fk?.User_Name || 'Trainer'}
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

export default User_Insert;
