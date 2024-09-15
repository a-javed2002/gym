import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './feeCard.css'; // Make sure to move your CSS styles to this file
import html2pdf from 'html2pdf.js';
import { useSelector, useDispatch } from 'react-redux';
const FeeCard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardRef = useRef(null); // Create a ref for the card to be exported as PDF
  const user = useSelector((state) => state.auth.user);
  const userId = user.id;
  // Fetch user ID from local storage
  // const userId = localStorage.getItem('id');

  useEffect(() => {
    if (!userId) {
      setError('No user ID found in local storage.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/Feesuser/${userId}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div className="content-body"><p>{error}</p></div>;
  }

  // List of all months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Create an object to map the user's fees by month
  const feeMap = userData?.data.reduce((acc, fee) => {
    const month = new Date(fee.createdAt).getMonth(); // 0 = January, 11 = December
    acc[month] = fee;
    return acc;
  }, {});

  // Function to download the card as a PDF
  const handleDownloadPDF = () => {
    const element = cardRef.current; // Get the card element by ref
    const opt = {
      margin: 1,
      filename: `${userData.data[0]?.User_Id_Fk?.User_Name}_FeeCard.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF from the card content
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="content-body">
      <center>
        <div className="fee-card" ref={cardRef}> {/* Assign ref to the card */}
          <div className="user-info">
            <h2>Gym Portal</h2>
            {userData && userData.data.length > 0 && (
              <>
                <h3>{userData.data[0]?.User_Id_Fk?.User_Name}</h3>
                <p>{userData.data[0]?.User_Id_Fk?.User_Email}</p>
                <p>Account Created: {new Date(userData.data[0]?.User_Id_Fk?.createdAt).getFullYear()}</p>
              </>
            )}
          </div>

          <div className="fees-table">
            <h3>Monthly Fees Overview - 2024</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td className={feeMap?.[index]?.Monthly_Fees > 0 ? 'paid' : 'unpaid'}>
                      {feeMap?.[index]?.Monthly_Fees > 0 ? (
                        <>
                          Paid <br />
                          <span className="paid-date">{new Date(feeMap[index].updatedAt).toLocaleDateString()}</span>
                        </>
                      ) : (
                        'Unpaid'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Button to download the card as PDF */}
        <button onClick={handleDownloadPDF} className="download-btn">
          Download PDF
        </button>
      </center>
    </div>
  );
};

export default FeeCard;
