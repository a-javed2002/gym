import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement, PointElement } from 'chart.js';
import { Container, Grid, TextField, MenuItem, Button, CircularProgress, Alert } from '@mui/material';

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement, PointElement);

const Sale = () => {
    const [salesData, setSalesData] = useState({});
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        productId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchSalesData();
    }, [filters]);

    const fetchSalesData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8000/api/sale', { params: filters });
            setSalesData(response.data);
        } catch (error) {
            setError('Error fetching sales data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/Product');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products.');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const chartData = {
        line: {
            labels: salesData.labels || [],
            datasets: [
                {
                    label: 'Sales Line',
                    data: salesData.lineData || [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }
            ]
        },
        bar: {
            labels: salesData.labels || [],
            datasets: [
                {
                    label: 'Sales Bar',
                    data: salesData.barData || [],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        pie: {
            labels: salesData.labels || [],
            datasets: [
                {
                    label: 'Sales Pie',
                    data: salesData.pieData || [],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }
            ]
        }
    };

    return (
        <div className="content-body">
            <Container className='' >
                <h1>Sales Dashboard</h1>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <label>Start Date</label>
                        <TextField
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <label>End Date</label>
                        <TextField
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <label>Select Product</label>
                        <TextField
                            select
                            name="productId"
                            label="Product"
                            value={filters.productId}
                            onChange={handleFilterChange}
                            fullWidth
                        >
                            <MenuItem value="">All Products</MenuItem>
                            {products.map(product => (
                                <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <div className='d-flex justify-content-end mt-4'>
                    <Button variant="contained" onClick={fetchSalesData} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Apply Filters'}
                    </Button>
                </div>
                {error && <Alert severity="error">{error}</Alert>}
                <div style={{ marginTop: '20px' }}>
                    <h2>Sales Line Chart</h2>
                    <Line data={chartData.line} />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <h2>Sales Bar Chart</h2>
                    <Bar data={chartData.bar} />
                </div>
                <h2>Sales Pie Chart</h2>
                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div style={{ width: '400px', height: '400px' }}>
                     
                        <Pie data={chartData.pie} />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Sale;
