import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Required for drag-and-drop
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import './WorkoutShow.css'; // Import custom CSS
import { useSelector, useDispatch } from 'react-redux';
const Nutrition_Show = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const Id = user.id;
  // const Id = localStorage.getItem('id');
  const url = `http://localhost:8000/api/NutritionUser/${Id}`;

  const [nutrition, setNutrition] = useState([]);
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
      console.log("Fetched Data:", data); // Debugging statement
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

  const deleteData = (id) => {
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
      deleteData(id);
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
    console.log("Selected Date:", dateStr);

    const dataForDate = combinedData.filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      console.log("Item Date:", itemDate);
      return itemDate === dateStr;
    });

    console.log("Filtered Data:", dataForDate);
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
        show={showModal}
        onHide={handleModalClose}
        className="custom-modal"
        style={{margin: 'auto',overflowY:'hidden' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nutrition Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent.length > 0 ? (
            modalContent.map((item) => (
              <div key={item._id} className="workout-details">
                <h5 className="workout-date">{new Date(item.date).toLocaleDateString()}</h5>
                <div className="exercise-container">
                  {item.foods && item.foods.length > 0 ? (
                    item.foods.map((food) => (
                      <div key={food._id} className="exercise-container">
                        
                        <div >
                          <strong>Food Name:</strong> {food.name || 'N/A'}
                        </div>
                        <div>
                          <strong>Quantity:</strong> {food.quantity || 'N/A'}
                        </div>
                        <div>
                          <strong>Calories:</strong> {food.calories || 'N/A'}
                        </div>
                        <div>
                          <strong>Protein:</strong> {food.macros?.protein || 'N/A'}
                        </div>
                        <div>
                          <strong>Carbs:</strong> {food.macros?.carbs || 'N/A'}
                        </div>
                        <div>
                          <strong>Fat:</strong> {food.macros?.fat || 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No food details available.</p>
                  )}
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
