import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Fee_Insert.css';
import { FaDollarSign, FaSearch } from 'react-icons/fa';
import { jsPDF } from "jspdf";

function Fee_Insert() {
  const navigate = useNavigate();
  const [newFeeData, setNewFeeData] = useState({
    Monthly_Fee: "",
    UserId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(""); 
  const [datau, setDatau] = useState(null);

  const [expenseData, setExpenseData] = useState([]);
  const userCardRef = useRef(null);
  const receiptRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await fetch(`http://localhost:8000/api/search?query=${searchQuery}`);
          const data = await response.json();
          setUserResults(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setUserResults([]);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userCardRef.current && !userCardRef.current.contains(event.target)) {
        setSelectedUserId("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/Expense");
        const data = await response.json();
        setExpenseData(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleUserClick = async (userId) => {
    if (selectedUserId === userId) {
      setSelectedUserId("");
      setNewFeeData((prevData) => ({
        ...prevData,
        UserId: "",
        Monthly_Fee: "",
      }));
      setDatau(null);
    } else {
      setSelectedUserId(userId);
      setNewFeeData((prevData) => ({
        ...prevData,
        UserId: userId,
      }));

      try {
        const response = await fetch(`http://localhost:8000/api/User/${userId}`);
        const userData = await response.json();
        setDatau(userData);

        // Match subscription type to the corresponding expense and update Monthly_Fee
        const matchedExpense = expenseData.find(exp => exp.type === userData.Subcribtion);
        if (matchedExpense) {
          setNewFeeData((prevData) => ({
            ...prevData,
            Monthly_Fee: matchedExpense.Dicided_Amount || '0.00',
          }));
        } else {
          setNewFeeData((prevData) => ({
            ...prevData,
            Monthly_Fee: "0.00",
          }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.text('Fitness PORTAL', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text('House No 552 Block 3 Sheet 3, Street 2, Federal B Area, Karachi, Pakistan', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text('Receipt', pageWidth / 2, 50, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Customer Receipt', pageWidth / 2, 60, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(10, 65, pageWidth - 10, 65);

    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    
    const details = [
      { label: 'Receipt No:', value: (1000 + 1).toString() },  // Convert number to string
      { label: 'Receipt Date:', value: new Date().toLocaleDateString() },
      { label: 'Name:', value: datau?.User_Name || 'N/A' },
      { label: 'Email:', value: datau?.User_Email || 'N/A' },
      { label: 'Fee Amount:', value: newFeeData.Monthly_Fee || '0.00' },
      { label: 'Total Amount:', value: newFeeData.Monthly_Fee || '0.00' }
    ];
    

    let yPosition = 80;
    details.forEach(detail => {
      doc.text(detail.label, 10, yPosition);
      doc.text(detail.value, pageWidth - 10, yPosition, { align: 'right' });
      yPosition += 10;
    });

    doc.setFontSize(12);
    doc.setFont('times', 'italic');
    doc.text('Thank you for your payment!', pageWidth / 2, yPosition + 20, { align: 'center' });

    return doc;
  };

  const handleSubmit = async () => {
    if (!newFeeData.UserId) {
      alert("Please select a user before submitting the form.");
      return;
    }

    const pdf = generatePDF();
    if (!pdf) {
      console.error("PDF generation failed");
      return;
    }

    const pdfBlob = pdf.output("blob");

    const formData = new FormData();
    formData.append("User_Id_Fk", newFeeData.UserId);
    formData.append("Monthly_Fees", newFeeData.Monthly_Fee);
    formData.append("pdf", pdfBlob, "FeeReceipt.pdf");

    try {
      const response = await fetch("http://localhost:8000/api/fees", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Data and PDF submitted successfully");
        navigate("/Fee_Show");
      } else {
        console.error("Error submitting fee data");
      }
    } catch (error) {
      console.error("Error adding fee:", error);
    }
  };

  return (
    <>
      <div className="content-body d-flex justify-content-center">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title fw-600 text-center">Fee Form</h1>
              <h4 className="card-text text-start text-dark">Search Users</h4>
              <div className="search-container text-start">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search by Name or Email"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div ref={userCardRef} className="user-results fee-card2">

                
                {userResults.length > 0 ? (
                  <div className="card-deck">

                    {userResults.map((user) => (
                      <div
                        key={user._id}
                        className={`user-card row ${selectedUserId === user._id ? 'selected' : ''}`}
                        onClick={() => handleUserClick(user._id)}
                      >
                        <div className="col-4">
                          <img
                            src={`http://localhost:8000/${user.User_Image}`}
                            alt={`${user.User_Name}'s image`}
                            className="user-image"
                          />
                        </div>
                        <div className="col-8 user-info2">
                          <div className="d-flex gap-3">
                            <h5 className="user-name">{user.User_Name}</h5>
                            <p className="user-email">{user.User_Email}</p>
                          </div>
                          <p className="user-father-name">
                            <strong>Father's Name :</strong> {user.User_FatherName || 'N/A'}
                          </p>
                          <p className="user-subscription">
                            <strong>Subscription :</strong> {user.Subcribtion || 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">No users found</p>
                )}
              </div>

              <p className="text-muted m-b-15 f-s-12 text-start">
                <code>Please enter the fee details below:</code>
              </p>
              <div className="basic-form text-start">
                <form>
                  <label htmlFor="monthly-fee"> Monthly Fee</label>
                  <div className="form-group">
                    <input
                      id="monthly-fee"
                      type="number"
                      className="form-control input-default small-input"
                      placeholder="Enter Monthly Fee"
                      name="Monthly_Fee"
                      value={newFeeData.Monthly_Fee}
                      onChange={handleInputChange}
                    />
                  </div>
              
                  <div className="button-container">
                    <button
                      type="button"
                      className="btn btn-primary Paid"
                      onClick={handleSubmit}
                    >
                      <FaDollarSign className="btn-icon" />
                      Pay
                    </button>
                  
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={receiptRef} className="container my-5 mx-5 d-none">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card p-4 shadow-lg border-0 rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-center">
                  <h1 className="display-4 text-primary">Fitness PORTAL</h1>
                  <p className="text-muted">
                    House No 552 Block 3 Sheet 3, Street 2, Federal B Area, Karachi, Pakistan
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-weight-bold text-uppercase text-secondary">Receipt</h4>
                  <h5 className="text-secondary">Customer Receipt</h5>
                </div>
              </div>
              <hr className="my-4" />
              <div className="row">
                <div className="col-lg-4 my-2">
                  <h6 className="font-weight-bold text-secondary">
                    Receipt No: 
                    <span className="font-weight-normal text-dark" style={{ borderBottom: "1px solid grey", paddingBottom: "2px" }}>
                      {/* Serial number generation logic */}
                      1000 + 1
                    </span>
                  </h6>
                </div>
                <div className="col-lg-12 my-2">
                  <h6 className="font-weight-bold text-secondary">
                    Receipt Date: 
                    <span className="font-weight-normal text-dark" style={{ borderBottom: "1px solid grey", paddingBottom: "2px" }}>
                      {new Date().toLocaleDateString()}
                    </span>
                  </h6>
                </div>
                <div className="col-lg-12 my-2">
                  <h6 className="font-weight-bold text-secondary">
                    Name: 
                    <span className="font-weight-normal text-dark" style={{ borderBottom: "1px solid grey", paddingBottom: "2px" }}>
                      {datau?.User_Name || 'N/A'}
                    </span>
                  </h6>
                </div>
                <div className="col-lg-12 my-2">
                  <h6 className="font-weight-bold text-secondary">
                    Email: 
                    <span className="font-weight-normal text-dark" style={{ borderBottom: "1px solid grey", paddingBottom: "2px" }}>
                      {datau?.User_Email || 'N/A'}
                    </span>
                  </h6>
                </div>
                <div className="col-lg-12 my-2">
                  <h6 className="font-weight-bold text-secondary">
                    Fee Amount: 
                    <span className="font-weight-normal text-dark" style={{ borderBottom: "1px solid grey", paddingBottom: "2px" }}>
                      {newFeeData.Monthly_Fee || '0.00'}
                    </span>
                  </h6>
                </div>
              </div>
              <div className="text-center my-4">
                <h6 className="font-weight-bold text-secondary">
                  Total Amount: 
                  <span className="font-weight-normal text-dark" style={{ borderBottom: "1px solid grey", paddingBottom: "2px" }}>
                    {newFeeData.Monthly_Fee || '0.00'}
                  </span>
                </h6>
              </div>
              <hr className="my-4" />
              <div className="text-center">
                <p className="font-italic text-muted">Thank you for your payment!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Fee_Insert;
