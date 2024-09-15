import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Required for drag-and-drop
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WorkoutShow.css'; // Import custom CSS
import { useSelector, useDispatch } from 'react-redux';
const Workout_Show = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;
  // const userId = localStorage.getItem('id');
  const workoutUrl = `http://localhost:8000/api/UserWorkout/${userId}`;
  const exerciseUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

  const [workouts, setWorkouts] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  // Fetch workouts and exercises data
  const fetchData = async () => {
    try {
      const workoutResponse = await fetch(workoutUrl);
      if (!workoutResponse.ok) throw new Error('No Data Available');
      const workoutData = await workoutResponse.json();

      const exerciseResponse = await fetch(exerciseUrl);
      if (!exerciseResponse.ok) throw new Error('Failed to fetch exercises');
      const exerciseData = await exerciseResponse.json();

      const combined = workoutData.map(workout => {
        const exercises = workout.exercise_id.map(id => exerciseData.find(ex => ex.id === id)).filter(ex => ex !== undefined);
        return { ...workout, exercises };
      });

      setWorkouts(workoutData);
      setCombinedData(combined);
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

  // Handle dragging and dropping of events
  const handleEventDrop = async (info) => {
    const updatedDate = info.event.startStr;
    const workoutId = info.event.id;

    try {
      const response = await fetch(`http://localhost:8000/api/WorkoutDateUpdate/${workoutId}`, {
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

  // Handle date click for showing workout details
  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    const workoutsForDate = combinedData.filter(workout => {
      const workoutDate = new Date(workout.date).toISOString().split('T')[0];
      return workoutDate === dateStr;
    });

    setModalContent(workoutsForDate);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => setShowModal(false);

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-0">Workout Calendar</h4>
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  editable={true} // Enable drag-and-drop
                  dateClick={handleDateClick}
                  eventDrop={handleEventDrop}
                  events={combinedData.map(workout => ({
                    id: workout._id,
                    title: 'Workout',
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
      <Modal show={showModal} onHide={handleModalClose} className="custom-modal"  style={{margin: 'auto',overflowY:'hidden' }}>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Workout Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          {modalContent.length > 0 ? (
            modalContent.map((workout) => (
              <div key={workout._id} className="workout-details">
                <h5 className="workout-date">{new Date(workout.date).toLocaleDateString()}</h5>
                <div className="exercise-container">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-item">
                      <strong>{exercise.name || 'N/A'}</strong><br />
                      <div className="exercise-info">
                        <span>Category: {exercise.category || 'N/A'}</span><br />
                        <span>Mechanic: {exercise.mechanic || 'N/A'}</span><br />
                        <span>Primary Muscles: {exercise.primaryMuscles.join(', ') || 'N/A'}</span><br />
                        <span>Secondary Muscles: {exercise.secondaryMuscles.join(', ') || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No workouts on this date.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Workout_Show;
