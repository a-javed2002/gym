import React, { useState, useEffect } from "react";
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { useSelector, useDispatch } from 'react-redux';
const All_Workout = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;
  // const userId = localStorage.getItem('id'); 
  const workoutUrl = `http://localhost:8000/api/UserWorkout/${userId}`;
  const exerciseUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
  
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch workouts
      const workoutResponse = await fetch(workoutUrl);
      if (!workoutResponse.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const workoutData = await workoutResponse.json();
      
      // Fetch exercises
      const exerciseResponse = await fetch(exerciseUrl);
      if (!exerciseResponse.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const exerciseData = await exerciseResponse.json();
      
      // Combine workout data with exercise data
      const combined = workoutData.map(workout => {
        // Find exercises matching the exercise_ids array
        const exercises = workout.exercise_id.map(id => exerciseData.find(ex => ex.id === id)).filter(ex => ex !== undefined);
        return { ...workout, exercises };
      });
  
      setWorkouts(workoutData);
      setExercises(exerciseData);
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

  useEffect(() => {
    if (!loading) {
      initializeDataTable();
    }
  }, [loading]);

  const initializeDataTable = () => {
    $('#myTable').DataTable({
      responsive: true
    });
  };

  const deleteData = (id) => {
    fetch(`${workoutUrl}/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete data');
        }
        alert("Data deleted successfully");
        fetchData(); // Refetch to update table
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data. Please try again.");
      });
  };

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-0">Workout Table</h4>
                <div className="table-responsive">
                  <table id="myTable" className="display">
                    <thead>
                      <tr>
                        <th>Exercise Name</th>
                        <th>Category</th>
                        <th>Mechanic</th>
                        <th>Primary Muscles</th>
                        <th>Secondary Muscles</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinedData.map((item) => (
                        item.exercises.length > 0 ? item.exercises.map((exercise, index) => (
                          <tr key={exercise.id}>
                            <td>{exercise.name || 'N/A'}</td>
                            <td>{exercise.category || 'N/A'}</td>
                            <td>{exercise.mechanic || 'N/A'}</td>
                            <td>{exercise.primaryMuscles.join(', ') || 'N/A'}</td>
                            <td>{exercise.secondaryMuscles.join(', ') || 'N/A'}</td>
                            <td>
                              <button onClick={() => deleteData(item._id)} className="btn btn-danger">Delete</button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="7">No exercises available</td>
                          </tr>
                        )
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

export default All_Workout;
