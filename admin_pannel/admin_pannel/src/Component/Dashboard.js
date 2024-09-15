import React from "react";
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSelector, useDispatch } from 'react-redux';
function Dasboard() {

  const [countData, setCountData] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [tasks, setTasks] = useState([]);
  const [Todo, setTodo] = useState('');
  const [BurnCalories, setBurnCalories] = useState(null);
  const [totalCalories, setTotalCalories] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const userId = user.id;
  // Fetch count data for admin
  useEffect(() => {
    const fetchCountData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/Dashboard");
        const data = await res.json();
        setCountData(data);
      } catch (error) {
        console.error("Error fetching count:", error);
        setError(error);
      }
    };
    if (user.role === "Admin") {
      fetchCountData();
    }
  }, [user.role]);

  // Fetch tasks for user

  // Fetch total calories for the user
  const fetchTotalCalories = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/Dashboard/${userId}`);
      const data = await res.json();
      setTotalCalories(data.totalCalories);
      setCountData(data);
    } catch (error) {
      console.error("Error fetching total calories:", error);
      setError(error);
    }
  };
  const fetchCleient= async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/Dashboard/${userId}`);
      const data = await res.json();
      setCountData(data);
    } catch (error) {
      console.error("Error fetching total calories:", error);
      setError(error);
    }
  };
  useEffect(() => {
    if (user.role === "User") {
      fetchTotalCalories(user.id);
    }
    else{
      fetchCleient(user.id);
    }
  }, [user.role, user.id]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/todosuser/${userId}`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const addTask = async (e) => {
    if (e.key === 'Enter' && Todo.trim()) {
      try {
        const res = await fetch('http://localhost:8000/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Todo, userId }),
        });
        const data = await res.json();
        setTasks(prevTasks => [...prevTasks, data]);
        setTodo('');
        fetchTasks()

      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:8000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      const updatedTask = await res.json();
      setTasks(tasks.map(task => task._id === id ? { ...task, completed: updatedTask.completed } : task));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const removeTask = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };



  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  }



    return (
      <div className="content-body">
        <div className="container-fluid mt-3">
        {user.role === "Admin" ? (
        <div className="row">
          <div className="col-lg-4 col-sm-6">
            <div className="card gradient-1">
              <div className="card-body">
                <h3 className="card-title text-white">Total Customer</h3>
                <div className="d-inline-block">
                  <h2 className="text-white">
                    {countData ? countData.totalUser : <p>Loading...</p>}
                  </h2>
                  <p className="text-white mb-0">{getCurrentDate()}</p>
                </div>
                <span className="float-right display-5 opacity-5">
                  <i className="fa fa-users" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="card gradient-2">
              <div className="card-body">
                <h3 className="card-title text-white">Total Trainer</h3>
                <div className="d-inline-block">
                  <h2 className="text-white">
                    {countData ? countData.totalTrainer : <p>Loading...</p>}
                  </h2>
                  <p className="text-white mb-0">Total Number Of Trainers</p>
                </div>
                <span className="float-right display-5 opacity-5">
                  <i className="fa fa-dumbbell" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="card gradient-3">
              <div className="card-body">
                <h3 className="card-title text-white">Total Sale</h3>
                <div className="d-inline-block">
                  <h2 className="text-white">
                    {countData ? `Rs.${countData.totalSales}` : <p>Loading...</p>}
                  </h2>
                  <p className="text-white mb-0">{getCurrentDate()}</p>
                </div>
                <span className="float-right display-5 opacity-5">
                  <i className="fa fa-money" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : user.role === "Trainer" ? (
        <div className="row">
          <div className="col-lg-4 col-sm-6">
            <div className="card gradient-1">
              <div className="card-body">
                <h3 className="card-title text-white">Total Client</h3>
                <div className="d-inline-block">
                  <h2 className="text-white">
                    {countData ? countData.trainerClientCount : <p>Loading...</p>}
                  </h2>
                  <p className="text-white mb-0">{getCurrentDate()}</p>
                </div>
                <span className="float-right display-5 opacity-5">
                  <i className="fa fa-users" />
                </span>
              </div>
            </div>
          </div>
      
     
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-4 col-sm-6">
            <div className="card gradient-1">
              <div className="card-body">
                <h3 className="card-title text-white">Total Calorie</h3>
                <div className="d-inline-block">
                  <h2 className="text-white">
                    {totalCalories !== null ? totalCalories : <p>Loading...</p>}
                  </h2>
                  <p className="text-white mb-0">{getCurrentDate()}</p>
                </div>
                <span className="float-right display-5 opacity-5">
                  <i className="fa fa-users" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
  <div className="card gradient-2">
    <div className="card-body">
      <h3 className="card-title text-white">Burn Calorie</h3>
      <div className="d-inline-block">
        <h2 className="text-white">
          {countData !== null && countData.totalCaloriesBurned !== null 
            ? countData.totalCaloriesBurned 
            : <p>Loading...</p>}
        </h2>
        <p className="text-white mb-0">Calories Burned</p>
      </div>
      <span className="float-right display-5 opacity-5">
        <i className="fa fa-dumbbell" />
      </span>
    </div>
  </div>
</div>

        </div>
      )}
          {/* <div className="row">
            <div className="col-lg-12">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body pb-0 d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-1">Events</h4>
                                </div>
                                <div>
                                    <ul>
                                        <li className="d-inline-block mr-3">
                                            <a className="text-dark" href="#" onClick={() => setFilter('today')}>Today</a>
                                        </li>
                                        <li className="d-inline-block mr-3">
                                            <a className="text-dark" href="#" onClick={() => setFilter('week')}>Week</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                          
                            <div className="card-body">
                                <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
                                    {events.map((event, index) => (
                                        <div key={index}>
                                            <img src={`http://localhost:8000/${event.Event_Images}`} alt={event.Event_Name} height="200"/>
                          
                                         
                                            <div className="">
                                                <h5>{event.Event_Name}</h5>
                                                <p>{event.Event_Description}</p>
                                                <p>{event.Event_Date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
          <div className="row">
            <div className="col-lg-12 col-md-6">
              <div className="card">
                <div className="card-body px-0">
                  <h4 className="card-title px-4 mb-3">Todo</h4>
                  <div className="todo-list">
                    <div className="tdl-holder">
                      <div className="tdl-content">
                        <ul id="todo_list">
                          {tasks.map(task => (
                            <li key={task._id}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(task._id, !task.completed)}
                                />
                                <i />
                                <span>{task.Todo}</span>
                                <a
                                  href="#"
                                  className="ti-trash"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeTask(task._id);
                                  }}
                                />
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="px-4">
                        <input
                          type="text"
                          className="tdl-new form-control"
                          placeholder="Write new item and hit 'Enter'..."
                          value={Todo}
                          onChange={(e) => setTodo(e.target.value)}
                          onKeyDown={addTask}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <img src="./images/users/8.jpg" className="rounded-circle" alt />
                    <h5 className="mt-3 mb-1">Ana Liem</h5>
                    <p className="m-0">Senior Manager</p>
                    {/* <a href="javascript:void()" class="btn btn-sm btn-warning">Send Message</a> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <img src="./images/users/5.jpg" className="rounded-circle" alt />
                    <h5 className="mt-3 mb-1">John Abraham</h5>
                    <p className="m-0">Store Manager</p>
                    {/* <a href="javascript:void()" class="btn btn-sm btn-warning">Send Message</a> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <img src="./images/users/7.jpg" className="rounded-circle" alt />
                    <h5 className="mt-3 mb-1">John Doe</h5>
                    <p className="m-0">Sales Man</p>
                    {/* <a href="javascript:void()" class="btn btn-sm btn-warning">Send Message</a> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <img src="./images/users/1.jpg" className="rounded-circle" alt />
                    <h5 className="mt-3 mb-1">Mehedi Titas</h5>
                    <p className="m-0">Online Marketer</p>
                    {/* <a href="javascript:void()" class="btn btn-sm btn-warning">Send Message</a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>
        {/* #/ container */}
      </div>


    );
  }

  export default Dasboard;

