import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';



function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    User_Email: "",
    User_Password: ""
  });
  const { status, error } = useSelector(state => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    dispatch(loginStart());
    fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Login failed');
        }
      })
      .then((data) => {
        dispatch(loginSuccess({ token: data.token, user: data }));
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('role', data.role);
        navigate('/');
      })
      .catch((error) => {
        dispatch(loginFailure(error.message));
        alert(error.message);
      });
  };

  return (
    <div className="login-form-bg h-100 mt-5 m-5">
      <div className="container h-100 mt-5">
        <div className="row justify-content-center h-100 mt-5">
          <div className="col-xl-6">
            <div className="form-input-content">
              <div className="card login-form mb-0">
                <div className="card-body pt-5">
                  <a className="text-center"><h4>Rosella</h4></a>
                  <form className="mt-5 mb-5">
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="User_Email"
                        value={formData.User_Email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="User_Password"
                        value={formData.User_Password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button
                      className="btn btn-primary login-form__btn submit w-100"
                      type="button"
                      onClick={handleSubmit}
                      style={{ color: 'white' }}
                    >
                      Sign In
                    </button>
                  </form>
                  <p className="mt-5 login-form__footer">
                    Don't have an account? <a href="page-register.html" className="text-decoration-none" style={{ color: "#7571f9" }}>Sign Up</a> now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
