
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { logout } from '../../slices/authSlice';
function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const token = auth?.token;
  const role = auth?.user?.role;
  // Handle the logout function
  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout your account?');
    if (confirmed) {
      localStorage.clear();
      dispatch(logout());
      window.location.href = "/login";
    }
  };
  const handlechat = () => {
  navigate('/chat')
  };

  useEffect(() => {
    // Logic to control visibility of elements based on the role
    const exhibitorElements = document.querySelectorAll(".exhibitor");
    const adminElements = document.querySelectorAll(".admin");
    const userElements = document.querySelectorAll(".user-link");
    const fortrainerElements = document.querySelectorAll(".for-trainer");

    if (token) {
      if (role === "Trainer") {
        exhibitorElements.forEach(el => el.style.display = 'none');
        adminElements.forEach(el => el.style.display = 'none');
        userElements.forEach(el => el.style.display = 'none');
      } else if (role === "User") {
        exhibitorElements.forEach(el => el.style.display = 'none');
        adminElements.forEach(el => el.style.display = 'none');
        fortrainerElements.forEach(el => el.style.display = 'none');
      } else {
        userElements.forEach(el => el.style.display = 'none');
        fortrainerElements.forEach(el => el.style.display = 'none');
      }
    } else {
      // If not logged in, hide the sidebar
      document.getElementById("sidebar").style.display = 'none';
    }
  }, [role, token]);

  return (
    <div className="nk-sidebar" id="sidebar">
      <div className="nk-nav-scroll">
        <ul className="metismenu" id="menu">
          <li className="nav-label">Dashboard</li>

          <li>
            <NavLink to="/" className="text-decoration-none">
              <i className="fas fa-tachometer-alt menu-icon"></i>
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </li>


          <li className="admin">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="product-content"
                id="product-header"
              >
                <i className="fa fa-th-list menu-icon mt-1"></i>
                <Typography className="nav-text mx-2 ">Product</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink
                      to="/Product_Insert"
                      className="text-decoration-none"
                    >
                      Product Insert
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Product_Show" className="text-decoration-none">
                      Product Show
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/ALL_Product" className="text-decoration-none">
                      Buy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Cart" className="text-decoration-none">
                      Cart
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="user-link">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="fitness-content"
                id="fitness-header"
              >
                <i className="fa fa-dumbbell menu-icon  mt-1"></i>
                <Typography className="nav-text mx-2">Fitness</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink to="/Workout_Show" className="text-decoration-none">
                      Workout
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/Nutrition_Show"
                      className="text-decoration-none"
                    >
                      Nutrition
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/ExercisePage"
                      className="text-decoration-none"
                    >
                      Exercise
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/Bmi"
                      className="text-decoration-none"
                    >
                      Bmi
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="admin">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="user-content"
                id="user-header"
              >
                <i className="fa fa-user menu-icon  mt-1"></i>
                <Typography className="nav-text mx-2" >User</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink
                      to="/Trainer_Insert"
                      className="text-decoration-none"
                    >
                      Trainer Insert
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/User_Insert" className="text-decoration-none">
                      User Insert
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Trainer_Show" className="text-decoration-none">
                      Trainer Show
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/User_Show" className="text-decoration-none">
                      User Show
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Client_Show" className="text-decoration-none">
                      Client
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="for-trainer">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="trainer-user-content"
                id="trainer-user-header"
              >
                <i className="fa fa-user menu-icon  mt-1"></i>
                <Typography className="nav-text mx-2">User</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink to="/Client_Show" className="text-decoration-none">
                      Client
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="admin">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="fee-content"
                id="fee-header"
              >
                <i className="fa fa-money-bill menu-icon  mt-1"></i>
                <Typography className="nav-text mx-2">Fee</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink to="/Fee_Insert" className="text-decoration-none">
                      Fee Insert
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Fee_Show" className="text-decoration-none">
                      Fee Show
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="admin">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="category-content"
                id="category-header"
              >
                <i className="fa fa-th-list menu-icon  mt-1"></i>
                <Typography className="nav-text mx-2">Category</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink
                      to="/Expense_Insert"
                      className="text-decoration-none"
                    >
                      Category Insert
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Expense_Show" className="text-decoration-none">
                      Category Show
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="admin">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="order-content-2"
                id="order-header-2"
              >
                <i className="fa fa-chart-line menu-icon  mt-1" ></i>
                <Typography className="nav-text mx-2">Order</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <NavLink to="/Order_Show" className="text-decoration-none">
                      Order Show
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Sale" className="text-decoration-none">
                      Sale
                    </NavLink>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>



          <li >

            <Accordion>

              <AccordionSummary
          onClick={handlechat}

                aria-controls="order-content-2"
                id="order-header-2"
              >
        
                <i className="fa-solid fa-comments  menu-icon  mt-1" ></i>
                <Typography className="nav-text mx-2">Chat</Typography>
           
            </AccordionSummary>

          </Accordion>

        </li>
        <li >
          <Accordion>
            <AccordionSummary
              onClick={handleLogout}

              aria-controls="order-content-2"
              id="order-header-2"
            >
              <i className="fa-solid fa-sign-out-alt  menu-icon  mt-1" ></i>
              <Typography className="nav-text mx-2">Logout</Typography>
            </AccordionSummary>

          </Accordion>
        </li>

      </ul>
    </div>
    </div >



  );
}

export default Nav;
