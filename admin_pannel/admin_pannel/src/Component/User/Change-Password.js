import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
const PasswordChange = () => {
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.auth.user);
  const id = user.id;
  // const id = localStorage.getItem('id');


  const handlePreviousPasswordChange = (e) => {
    setPreviousPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
          previousPassword,
          newPassword,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setMessage("Password changed successfully");
      } else if (response.status === 401) {
        setMessage("Wrong previous password");
      } else if (response.status === 404) {
        setMessage("User not found");
      } else {
        setMessage("Error: Password change failed");
      }
    } catch (error) {
      console.error("Error :", error);
      setMessage("Error: Internal Server Error");
    }
  };

  return (
    <div className="content-body">
      <div className="container mt-5">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="previousPassword" className="form-label">Previous Password</label>
            <input
              type="password"
              className="form-control"
              id="previousPassword"
              value={previousPassword}
              onChange={handlePreviousPasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
};

export default PasswordChange;
