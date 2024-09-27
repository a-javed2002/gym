import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Required for drag-and-drop
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WorkoutShow.css'; // Import custom CSS
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
const NutritionAndWorkout_Show = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;
  // const userId = localStorage.getItem('id');
  
  // URLs for API endpoints
  const nutritionUrl = `http://localhost:8000/api/NutritionUser/${userId}`;
  const workoutUrl = `http://localhost:8000/api/UserWorkout/${userId}`;
  const exerciseUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

  // State variables
  const [nutritionData, setNutritionData] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [combinedWorkoutData, setCombinedWorkoutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalType, setModalType] = useState('');

  // Fetch Nutrition and Workout Data
  const fetchData = async () => {
    try {
      // Fetch nutrition data
      const nutritionResponse = await fetch(nutritionUrl);
      if (!nutritionResponse.ok) throw new Error('Failed to fetch nutrition data');
      const nutritionData = await nutritionResponse.json();
      setNutritionData(nutritionData);

      // Fetch workout data
      const workoutResponse = await fetch(workoutUrl);
      if (!workoutResponse.ok) throw new Error('Failed to fetch workout data');
      const workoutData = await workoutResponse.json();

      // Fetch exercise data
      const exerciseResponse = await fetch(exerciseUrl);
      if (!exerciseResponse.ok) throw new Error('Failed to fetch exercises');
      const exerciseData = await exerciseResponse.json();

      // Combine workout data with exercises
      const combined = workoutData.map(workout => {
        const exercises = workout.exercise_id.map(id => exerciseData.find(ex => ex.id === id)).filter(ex => ex !== undefined);
        return { ...workout, exercises };
      });

      setWorkouts(workoutData);
      setCombinedWorkoutData(combined);
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

  const handleEventDrop = async (info) => {
    const updatedDate = info.event.startStr;
    const id = info.event.id;
    const type = info.event.title; // Use title to determine type

    try {
      let url = '';
      if (type === 'Nutrition') {
        url = `http://localhost:8000/api/NutritionDateUpdate/${id}`;
      } else if (type === 'Workout') {
        url = `http://localhost:8000/api/WorkoutDateUpdate/${id}`;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: updatedDate }),
      });

      if (!response.ok) throw new Error(`Failed to update ${type} date`);
      fetchData(); // Refetch data to reflect changes
    } catch (error) {
      console.error(`Error updating ${type} date:`, error);
    }
  };

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    
    if (modalType === 'Nutrition') {
      const nutritionForDate = nutritionData.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate === dateStr;
      });

      const formattedData = nutritionForDate.flatMap(item => item.foods.map(food => ({
        _id: food._id,
        date: item.date,
        foodName: food.name,
        quantity: food.quantity,
        calories: food.calories,
        macros: food.macros,
      })));

      setModalContent(formattedData);
      setShowNutritionModal(true);
    } else if (modalType === 'Workout') {
      const workoutsForDate = combinedWorkoutData.filter(workout => {
        const workoutDate = new Date(workout.date).toISOString().split('T')[0];
        return workoutDate === dateStr;
      });

      setModalContent(workoutsForDate);
      setShowWorkoutModal(true);
    }
  };

  const handleModalClose = () => {
    setShowNutritionModal(false);
    setShowWorkoutModal(false);
  };

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
                  dateClick={(info) => {
                    const clickedEvent = info.event;
                    if (clickedEvent.title === 'Nutrition') {
                      setModalType('Nutrition');
                      handleDateClick(info);
                    } else if (clickedEvent.title === 'Workout') {
                      setModalType('Workout');
                      handleDateClick(info);
                    }
                  }}
                  eventDrop={handleEventDrop}
                  events={[
                    ...nutritionData.map(nutrition => ({
                      id: nutrition._id,
                      title: 'Nutrition',
                      date: new Date(nutrition.date).toISOString().split('T')[0]
                    })),
                    ...combinedWorkoutData.map(workout => ({
                      id: workout._id,
                      title: 'Workout',
                      date: new Date(workout.date).toISOString().split('T')[0]
                    }))
                  ]}
                />
                {error && <div className="alert alert-danger mt-3">{error.message}</div>}
                {loading && <div>Loading...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for showing nutrition details */}
      <Modal
        show={showNutritionModal}
        onHide={handleModalClose}
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Nutrition Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent.length > 0 ? (
            modalContent.map((item) => (
              <div key={item._id} className="nutrition-details">
                <h5 className="nutrition-date">{new Date(item.date).toLocaleDateString()}</h5>
                <div className="food-container">
                  <div>
                    <strong>Food Name:</strong> {item.foodName || 'N/A'}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {item.quantity || 'N/A'}
                  </div>
                  <div>
                    <strong>Calories:</strong> {item.calories || 'N/A'}
                  </div>
                  <div>
                    <strong>Protein:</strong> {item.macros && item.macros.protein !== undefined ? item.macros.protein : 'N/A'}
                  </div>
                  <div>
                    <strong>Carbs:</strong> {item.macros && item.macros.carbs !== undefined ? item.macros.carbs : 'N/A'}
                  </div>
                  <div>
                    <strong>Fat:</strong> {item.macros && item.macros.fat !== undefined ? item.macros.fat : 'N/A'}
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

      {/* Modal for showing workout details */}
      <Modal
        show={showWorkoutModal}
        onHide={handleModalClose}
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Workout Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent.length > 0 ? (
            modalContent.map((workout) => (
              <div key={workout._id} className="workout-details">
                <h5 className="workout-date">{new Date(workout.date).toLocaleDateString()}</h5>
                <div className="exercise-container">
                  {workout.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((exercise, index) => (
                      <div key={index} className="exercise-item">
                        <strong>Exercise Name:</strong> {exercise.name || 'N/A'}
                        <br />
                        <strong>Reps:</strong> {exercise.reps || 'N/A'}
                        <br />
                        <strong>Sets:</strong> {exercise.sets || 'N/A'}
                      </div>
                    ))
                  ) : (
                    <p>No exercises available.</p>
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

export default NutritionAndWorkout_Show;
