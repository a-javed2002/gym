import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { FaTimes, FaUser, FaDollarSign, FaMapMarkedAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import './Order.css'; 

const Order_Show = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orders');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      fetchOrders(); // Refresh orders after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const filterData = () => {
    return data.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (startDate && orderDate < startDate) return false;
      if (endDate && orderDate > endDate) return false;
      return true;
    });
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    doc.text('Order Report', 20, 10);
    doc.autoTable({
      head: [['Order ID', 'User Name', 'Total Amount', 'Status', 'Billing Address']],
      body: filterData().map((order) => [
        order._id,
        order.userId?.User_Name || 'N/A',
        order.totalAmount,
        order.status,
        order.billingAddress,
      ]),
    });
    doc.save('order_report.pdf');
  };

  const handleXLSXDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filterData().map((order) => ({
        'Order ID': order._id,
        'User Name': order.userId?.User_Name || 'N/A',
        'Total Amount': order.totalAmount,
        'Status': order.status,
        'Billing Address': order.billingAddress,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'order_report.xlsx');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="content-body">
      <div className="filter-section order">


        <div className='row'>
          <div className='col-6'></div>
          <div className='col-5'>
            <div className="export-section d-flex gap-3">
              <CSVLink data={filterData()} filename="order_report.csv" className="btn btn-primary">       <FaFileCsv style={{ marginRight: "5px" }} />    Export CSV</CSVLink>
              <button onClick={handlePDFDownload} className="btn btn-primary">  <FaFilePdf style={{ marginRight: "5px" }} /> Export PDF</button>
              <button onClick={handleXLSXDownload} className="btn btn-primary">   <FaFileExcel style={{ marginRight: "5px" }} />Export XLSX</button>
            </div>
          </div>

        </div>
        <h4>Filter Orders</h4>
        <div className="date-picker-wrapper">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="Start Date"
        className="date-picker"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="End Date"
        className="date-picker"
      />
      <button onClick={fetchOrders} className="filter-button">
        Filter
      </button>
    </div>
      </div>


      <div className="container-fluid">
        <div className="row"></div>
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Order Data Table</h4>
              <div className="table-responsive">
                <table id="myTable" className="display table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User Name</th>
                      <th>Total Amount</th>
                      <th>Status</th>
<th>createdAt</th>
                      <th>See</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData().map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.userId ? order.userId.User_Name : 'N/A'}</td>
                        <td>{order.totalAmount}</td>
                        <td>{order.status}</td>
                        {/* <td>{order.billingAddress}</td> */}
                        <td>{order.createdAt}</td>
                        <td>
                          <button onClick={() => handleOpenModal(order)} className="btn btn-link p-0 text-info border-0">
                            <i className="bi bi-eye" style={{ fontSize: '1.5rem' }}></i>
                          </button>
                        </td>
                        <td>
                          <button onClick={() => deleteOrder(order._id)} className="btn btn-link p-0 text-danger border-0">
                            <i className="bi bi-trash" style={{ fontSize: '1.5rem' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Order Details"
        style={{
          overlay: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            width: '50%',
            maxWidth: '900px',
            backgroundColor: '#fff',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <button
          onClick={handleCloseModal}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: '#999',
          }}
        >
          <FaTimes />
        </button>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Order Details</h2>
        {selectedOrder ? (
          <div>
            <div className="d-flex justify-content-between">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FaUser style={{ fontSize: '24px', color: '#007bff', marginRight: '10px' }} />
                <h4 style={{ margin: 0 }}>User: {selectedOrder.userId ? selectedOrder.userId.User_Name : 'N/A'}</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FaDollarSign style={{ fontSize: '24px', color: '#28a745', marginRight: '10px' }} />
                <p style={{ margin: 0 }}>Total Amount: ${selectedOrder.totalAmount}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FaMapMarkedAlt style={{ fontSize: '24px', color: '#dc3545', marginRight: '10px' }} />
                <p style={{ margin: 0 }}>Billing Address: {selectedOrder.billingAddress}</p>
              </div>
            </div>
            {selectedOrder.items.length > 0 ? (
              <>
                <Slider {...carouselSettings}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ padding: '0 10px' }}>
                      <img
                        src={`http://localhost:8000/${item.productId.image}`}
                        alt={item.productId.name}
                        className="img-fluid"
                        style={{ height: '250px', width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  ))}
                </Slider>
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Product Name</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Quantity</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Price</th>
                      {/* Add other fields as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{item.productId.name}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{item.quantity}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>${item.productId.price}</td>
                        {/* Add other fields as needed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p style={{ color: '#6c757d' }}>No items available</p>
            )}


          </div>
        ) : (
          <p style={{ color: '#6c757d' }}>No order selected</p>
        )}

      </Modal>
    </div>
  );
};

export default Order_Show;
