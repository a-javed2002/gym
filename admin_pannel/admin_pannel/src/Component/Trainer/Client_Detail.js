import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Container, Row, Col, Card, Image, Button, Modal } from 'react-bootstrap';
import { FaAppleAlt, FaDumbbell } from 'react-icons/fa';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Required for drag-and-drop
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientDetail.css'; // Import your custom CSS
import './WorkoutShow.css'; // Import custom CSS

const Client_Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get userId from URL params
    const url = `http://localhost:8000/api/User/${id}`;

    // State variables
    const [userData, setUserData] = useState(null);
    const [nutritionData, setNutritionData] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [combinedWorkoutData, setCombinedWorkoutData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [modalType, setModalType] = useState('');
    const [inputValues, setInputValues] = useState({});
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
    const [exercise, setexeercise] = useState(null);
    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserData();
    }, [url]);

    // Fetch Nutrition and Workout Data
    const fetchData = async () => {
        try {
            // Fetch nutrition data
            const nutritionResponse = await fetch(`http://localhost:8000/api/NutritionUser/${id}`);
            if (nutritionResponse.ok) {
                const nutritionData = await nutritionResponse.json();
                setNutritionData(nutritionData);
            } else if (nutritionResponse.status === 404) {
                console.log('No nutrition data found for this user.');
                setNutritionData([]);
            } else {
                throw new Error('Failed to fetch nutrition data');
            }

            // Fetch workout data
            const workoutResponse = await fetch(`http://localhost:8000/api/UserWorkout/${id}`);
            if (workoutResponse.ok) {
                const workoutData = await workoutResponse.json();

                // Fetch exercise data
                const exerciseResponse = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
                if (!exerciseResponse.ok) throw new Error('Failed to fetch exercises');
                const exerciseData = await exerciseResponse.json();

                // Combine workout data with exercises
                const combined = workoutData.map(workout => {
                    const exercises = workout.exercise_id.map(id => exerciseData.find(ex => ex.id === id)).filter(ex => ex !== undefined);
                    return { ...workout, exercises };
                });

                setWorkouts(workoutData);
                setCombinedWorkoutData(combined);
            } else if (workoutResponse.status === 404) {
                console.log('No workout data found for this user.');
                setWorkouts([]);
                setCombinedWorkoutData([]);
            } else {
                throw new Error('Failed to fetch workout data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [id]);

    const handleEventDrop = async (info) => {
        const updatedDate = info.event.startStr;
        const id = info.event.id;
        const type = info.event.extendedProps.type; // Use type to determine type


    
    try {
        let url = '';
        if (type === 'Nutrition') {
            url = `http://localhost:8000/api/NutritionDateUpdate/${id}`;
        } else if (type === 'Workout') {
            url = `http://localhost:8000/api/TrainerWorkoutDateUpdate/${id}`;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: updatedDate }),
        });

        if (!response.ok) throw new Error(`Failed to update ${type} date`);
        await fetchData(); // Refetch data to reflect changes
    } catch (error) {
        console.error(`Error updating ${type} date:`, error);
    }
};

const handleEventClick = (info) => {
    const event = info.event;
    const dateStr = new Date(event.startStr).toISOString().split('T')[0];
    console.log('Clicked Event:', event);
    console.log('Date String:', dateStr);

    if (event.extendedProps.type === 'Nutrition') {
        if (!nutritionData || nutritionData.length === 0) return; // Ensure nutritionData is not empty

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
            macros: food.macros || { protein: 'N/A', carbs: 'N/A', fat: 'N/A' }, // Default macros
        })));

        console.log('Formatted Nutrition Data:', formattedData);
        setModalContent(formattedData);
        setShowNutritionModal(true);
    } else if (event.extendedProps.type === 'Workout') {
        if (!combinedWorkoutData || combinedWorkoutData.length === 0) return; // Ensure combinedWorkoutData is not empty

        const workoutsForDate = combinedWorkoutData.filter(workout => {
            const workoutDate = new Date(workout.date).toISOString().split('T')[0];
            return workoutDate === dateStr;
        });

        console.log('Filtered Workout Data:', workoutsForDate);


        setModalContent(workoutsForDate);
        setShowWorkoutModal(true);
    }
};

const handleModalClose = () => {
    setShowNutritionModal(false);
    setShowWorkoutModal(false);
};

if (!userData) {
    return <div className="loading">Loading...</div>;
}

// Calculate BMI
const bmi = userData.weight && userData.height ? (userData.weight / ((userData.height / 100) ** 2)).toFixed(2) : 'N/A';


const handleInputChange = (workoutId, e) => {
    setInputValues({
        ...inputValues,
        [workoutId]: e.target.value,
    });
};

// Handle form submit
const handleFormSubmit = (workoutId) => {
    if (inputValues[workoutId]) {
        handlePutRequest(workoutId, inputValues[workoutId]);
    } else {
        alert("Please enter a value before submitting.");
    }
};
const handlePutRequest = async (workoutId, inputValue) => {
    try {
        const response = await fetch(`http://localhost:8000/api/Workout/${workoutId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Calorie_Burn: inputValue }),
        });

        if (response.ok) {
            alert('Progress updated successfully!');
        } else {
            alert('Failed to update progress.');
        }
    } catch (error) {
        console.error('Error during PUT request:', error);
        alert('An error occurred. Please try again.');
    }
};

const updateStatus = (workoutId, status) => {
    fetch(`http://localhost:8000/api/Workout/${workoutId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ Status: status }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to update status');
            }
            return res.json();
        })
        .then(() => {
            alert("Status updated successfully");
            setShowWorkoutModal(false);
            navigate('Client_Show')
        })


        .catch((error) => {
            console.error("Error updating status:", error);
            alert("Error updating status. Please try again.");
        });
};

const handleStatusClick = (id, currentStatus) => {
    const newStatus = currentStatus === '1' ? '0' : '1'; // Toggle status
    updateStatus(id, newStatus);
};

const style = `
    .active-status {
      color: green;
      background-color: lightgreen;
    }
    .active-status:hover {
      color: green;
      background-color: lightgreen;
    }
    .disabled-status {
      color: red;
      background-color: rgb(255, 196, 196);
    }
    .disabled-status:hover {
      color: red;
      background-color: rgb(255, 196, 196);
    }
  `;

const getStatusClass = (status) => {
    return status === '1' ? 'active-status' : 'disabled-status';
};
return (
    <div className="content-body">
        <Container fluid>
            <Row className="justify-content-center">
                <Col md={12} lg={12}>
                    <Card className="profile-card">
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Image
                                        src={`http://localhost:8000/${userData.User_Image}`}
                                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                        className="profile-image"
                                    />
                                </Col>
                                <Col xs={12} md={8}>
                                    <Card.Title className="mt-3 text-start" style={{ color: '#7571f9' }}>
                                        {userData.User_Name}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted text-start">
                                        {userData.User_Email}
                                    </Card.Subtitle>
                                    <div className="info-section mt-3">
                                        <div className='d-flex justify-content-between'>
                                            <p><strong>Father's Name:</strong> {userData.User_FatherName}</p>
                                            <p><strong>Phone:</strong> {userData.User_Phone}</p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <p><strong>Gender:</strong> {userData.gender}</p>
                                            <p><strong>Age:</strong> {userData.age}</p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <p><strong>Height:</strong> {userData.height} cm</p>
                                            <p><strong>Weight:</strong> {userData.weight} kg</p>
                                        </div>
                                        <p className='text-start'><strong>BMI:</strong> {bmi}</p>
                                        <div className="button-group mt-3 d-flex justify-content-end">
                                            <Link to={`/TrainerExercisePage/${id}`} className="btn btn-primary text-light">
                                                <FaDumbbell /> Add Workout
                                            </Link>
                                        </div>
                                    </div>


                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
            <Col md={12} lg={12}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    editable={true}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    events={[
                        ...(nutritionData || []).map(nutrition => ({
                            id: nutrition._id,
                            title: 'Nutrition',
                            start: new Date(nutrition.date).toISOString().split('T')[0],
                            backgroundColor: '#90EE90',
                            borderColor: '#90EE90',
                            extendedProps: { type: 'Nutrition' },
                        })),
                        ...(workouts || []).map(workout => ({
                            id: workout._id,
                            title: 'Workout',
                            start: new Date(workout.date).toISOString().split('T')[0],
                            extendedProps: { type: 'Workout' },
                        })),
                    ]}
                />
            </Col>
        </Container>

        {/* Nutrition Modal */}
        <Modal show={showNutritionModal} onHide={handleModalClose} className="custom-modal" style={{ margin: 'auto', overflowY: 'hidden' }}>
            <Modal.Header closeButton>
                <Modal.Title>Nutrition Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalContent.length === 0 ? (
                    <p>No data available for this date.</p>
                ) : (
                    <ul>
                        {modalContent.map((item, index) => (
                            <li key={index}>
                                <p><strong>Food:</strong> {item.foodName}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Calories:</strong> {item.calories}</p>
                                <p><strong>Macros:</strong>
                                    Protein: {item.macros ? item.macros.protein : 'N/A'},
                                    Carbs: {item.macros ? item.macros.carbs : 'N/A'},
                                    Fat: {item.macros ? item.macros.fat : 'N/A'}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showWorkoutModal} onHide={handleModalClose} className="custom-modal" style={{ margin: 'auto', overflowY: 'hidden' }}>
            <Modal.Header closeButton>
                <Modal.Title>Workout Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="exercise-modal">
                {modalContent.length === 0 ? (
                    <p>No data available for this date.</p>
                ) : (
                    modalContent.map((workout) => (
                        <div key={workout._id} className="workout-details mb-4">
                            <h5 className="workout-date">{new Date(workout.date).toLocaleDateString()}</h5>
                            <div className="exercise-container">
                                {workout.exercises && workout.exercises.length > 0 ? (
                                    <Row>
                                        {workout.exercises.map((exercise) => (
                                            <Col xs={12} md={6} key={exercise.id} className="mb-3">
                                                <div className="exercise-item p-3 border rounded">
                                                    <strong>{exercise.name || 'N/A'}</strong><br />
                                                    <div className="exercise-info">
                                                        <span>Category: {exercise.category || 'N/A'}</span><br />
                                                        <span>Mechanic: {exercise.mechanic || 'N/A'}</span><br />
                                                        <span>Primary Muscles: {exercise.primaryMuscles.join(', ') || 'N/A'}</span><br />
                                                        <span>Secondary Muscles: {exercise.secondaryMuscles.join(', ') || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <p>No exercises available.</p>
                                )}
                                {/* Form moved outside of the workout loop */}
                                <Form className="mt-3" style={{ width: '100%' }}>

                                    <div className='text-center'>
                                        <React.Fragment>
                                            <style>{style}</style>
                                            <p>
                                                <button
                                                    className={`btn ${getStatusClass(workout.Status)}`}
                                                    onClick={() => handleStatusClick(workout._id, workout.Status)}
                                                >
                                                    {workout.Status === '1' ? 'Success' : '0'}
                                                </button>
                                            </p>
                                        </React.Fragment>


                                    </div>
                                </Form>
                            </div>
                        </div>
                    ))
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

export default Client_Detail;
