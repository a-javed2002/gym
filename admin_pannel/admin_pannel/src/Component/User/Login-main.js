
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Login() {

  const navigate = useNavigate();
  const [newUserData, setNewUserData] = useState({
    User_Name: "",
    User_Email: "",
    User_Password: "",
    User_Type: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddUser = () => {
    fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          return res.json().then((data) => { throw new Error(data.error); });
        } else if (res.status === 403) {
          return res.json().then((data) => { throw new Error("Your account is deactivated. Kindly contact the admin."); });
           }   else if (res.status === 404) {
          return res.json().then((data) => { throw new Error(data.error); });
        } else {
          throw new Error("An unexpected error occurred");
        }
      })
      .then((data) => {
        alert("Login successfully");
        console.log("for checking")
        console.log("Full response data:", data)
        if (data.role === "User") {
          localStorage.setItem('User_token', data.token);
        } else if (data.role === "Trainer") {
          localStorage.setItem('Exhibitor_token', data.token);
        } else if (data.role === "Admin") {
          localStorage.setItem('Admin_token', data.token);
        }
        localStorage.setItem('id', data.id);
        localStorage.setItem('role', data.role);
        localStorage.setItem('status', data.status);
        window.location.href = '/'
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error adding User:", error);
      });
  }
  return (
    <>

      <div className="login-form-bg h-100 mt-5 m-5" >
        <div className="container h-100 mt-5">
          <div className="row justify-content-center h-100 mt-5">
            <div className="col-xl-6">
              <div className="form-input-content">
                <div className="card login-form mb-0">
                  <div className="card-body pt-5">
                    <a className="text-center"> <h4>Rosella</h4></a>
                    <form className="mt-5 mb-5">
                      <div className="form-group">
                        <input type="email" className="form-control" placeholder="Email" name="User_Email" value={newUserData.User_Email} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <input type="password" className="form-control" placeholder="Password" name="User_Password" value={newUserData.User_Password} onChange={handleInputChange} />
                      </div>
                      <button className="btn btn-primary login-form__btn submit w-100" type="button"
                        onClick={handleAddUser} style={{ color: 'white' }}>
                        Sign In
                      </button>

                    </form>
                    <p className="mt-5 login-form__footer">Don't have an account? <a href="page-register.html" className=" text-decoration-none" style={{ color: "#7571f9" }}>Sign Up</a> now</p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </>
  );
}

export default Login;
