import React from "react";

function Logout() {
  const handleLogout = () => {
    // Remove all items from local storage
    localStorage.clear();
   
    window.location.href = "/login";
  };

  return (
    <div className="content-body">
      <section id="main-content mt-5">
        <section className="wrapper">
          <h1 className="text-center">Are you sure you want to logout?</h1>
      <center>
      <button className="logout btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
      </center>
        </section>
      </section>
    </div>
  );
}

export default Logout;
