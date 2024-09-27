SEE MY DATA STRUCTURE IN NETWORK PAYLOAD WHY DATA IS NOT SHOWING PLESE DEBUG
[{_id: "66bbb8863c03d7f144fd8467",…}, {_id: "66c4a23099901db28fa654b8",…}]
0
: 
{_id: "66bbb8863c03d7f144fd8467",…}
1
: 
{_id: "66c4a23099901db28fa654b8",…}
date
: 
"2024-08-20T13:53:51.701Z"
foods
: 
[,…]
0
: 
{macros: {protein: "12.5", carbs: "0.7", fat: "9.7"}, name: "egg", quantity: "100", calories: "147",…}
calories
: 
"147"
macros
: 
{protein: "12.5", carbs: "0.7", fat: "9.7"}
carbs
: 
"0.7"
fat
: 
"9.7"
protein
: 
"12.5"
name
: 
"egg"
quantity
: 
"100"
_id
: 
"66c4a23099901db28fa654b9"
meal_type
: 
"breakfast"
user_id
: 
{_id: "66b3defde5d4b793a56d7b60", User_Name: "Huzaifa", User_Email: "admin@gmail.com",…}
Subcribtion
: 
""
User_Email
: 
"admin@gmail.com"
User_FatherName
: 
"Abid"
User_Image
: 
"1723412687407-sasuke-uchiha-mh.jpg"
User_Name
: 
"Huzaifa"
User_Password
: 
"$2b$10$KHXV44mBYVQW6UZpZ3liD.As2EanPd6bfQ3R9XH11z10qooA6dG.K"
User_Phone
: 
"12345678"
User_Role
: 
"Admin"
User_Status
: 
"1"
age
: 
20
createdAt
: 
"2024-08-07T20:54:21.105Z"
gender
: 
"Male"
height
: 
3
updatedAt
: 
"2024-08-11T21:44:47.572Z"
weight
: 
20
__v
: 
0
_id
: 
"66b3defde5d4b793a56d7b60"
__v
: 
0
_id
: 
"66c4a23099901db28fa654b8"


import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Required for drag-and-drop
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WorkoutShow.css'; // Import custom CSS
import { useNavigate, Link } from "react-router-dom";
import './WorkoutShow.css'; 

const Nutrition_Show = () => {
  const navigate = useNavigate();
  const Id = localStorage.getItem('id');
  const url = `http://localhost:8000/api/NutritionUser/${Id}`;

  const [Nutrition, setNutrition] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('No Data Available');
      const data = await response.json();
      setNutrition(data);
      setCombinedData(data); // Assuming the data from the API matches your needs
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/Nutrition_Update/${id}`);
  };

  const deletedata = (id) => {
    fetch(`http://localhost:8000/api/Nutrition/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete data');
        }
        alert("Data deleted successfully");
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data. Please try again.");
      });
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deletedata(id);
    }
  };

  const handleEventDrop = async (info) => {
    const updatedDate = info.event.startStr;
    const workoutId = info.event.id;

    try {
      const response = await fetch(`http://localhost:8000/api/NutritionDateUpdate/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: updatedDate }),
      });

      if (!response.ok) throw new Error('Failed to update workout date');
      fetchData(); // Refetch data to reflect changes
    } catch (error) {
      console.error('Error updating workout date:', error);
    }
  };

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    const dataForDate = combinedData.filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === dateStr;
    });

    setModalContent(dataForDate);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="card-title">Nutrition Table</h4>
                  <Link to="/NutritionInsert" className="btn btn-primary text-light">Add Nutrition</Link>
                </div>
            
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  editable={true}
                  dateClick={handleDateClick}
                  eventDrop={handleEventDrop}
                  events={combinedData.map(workout => ({
                    id: workout._id,
                    title: 'Nutrition',
                    date: new Date(workout.date).toISOString().split('T')[0]
                  }))}
                />
                {error && <div className="alert alert-danger mt-3">{error.message}</div>}
                {loading && <div>Loading...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for showing workout details */}
      <Modal
        show={showModal} // Change from isOpen to show
        onHide={handleModalClose} // Change from onRequestClose to onHide
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Workout Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  {modalContent.length > 0 ? (
    modalContent.map((item) => (
      <div key={item._id} className="workout-details">
        <h5 className="workout-date">{new Date(item.date).toLocaleDateString()}</h5>
        <div className="exercise-container">
          <div>
            <strong>Food Name:</strong> {item.name } {/* Updated to item.name */}
          </div>
          <div>
            <strong>Quantity:</strong> {item.quantity}
          </div>
          <div>
            <strong>Calories:</strong> {item.calories || 'N/A'}
          </div>
          <div>
            <strong>Protein:</strong> {item.macros?.protein || 'N/A'} {/* Safe navigation */}
          </div>
          <div>
            <strong>Carbs:</strong> {item.macros?.carbs || 'N/A'} {/* Safe navigation */}
          </div>
          <div>
            <strong>Fat:</strong> {item.macros?.fat || 'N/A'} {/* Safe navigation */}
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No details available.</p>
  )}
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Nutrition_Show;
