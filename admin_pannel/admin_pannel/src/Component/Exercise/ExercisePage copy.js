import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ExerciseCard from './ExerciseCard';
import Filter from './Filter';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Exercise.css';

const ExercisePage = () => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        mechanic: '',
        primaryMuscles: '',
        secondaryMuscles: '',
        search: '',
    });
    const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 6; // Number of exercises to show per page
    
    const user = useSelector((state) => state.auth.user);
    const userId = user.id;

    const navigate = useNavigate();

    useEffect(() => {
        const loadExercises = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setExercises(data);
                setFilteredExercises(data);
            } catch (error) {
                console.error('Error loading exercises:', error);
            }
        };

        loadExercises();
    }, []);

    useEffect(() => {
        let filtered = exercises;

        if (filters.category) {
            filtered = filtered.filter(exercise => exercise.category === filters.category);
        }
        if (filters.mechanic) {
            filtered = filtered.filter(exercise => exercise.mechanic === filters.mechanic);
        }
        if (filters.primaryMuscles) {
            filtered = filtered.filter(exercise => exercise.primaryMuscles.includes(filters.primaryMuscles));
        }
        if (filters.secondaryMuscles) {
            filtered = filtered.filter(exercise => exercise.secondaryMuscles.includes(filters.secondaryMuscles));
        }
        if (filters.search) {
            filtered = filtered.filter(exercise => exercise.name.toLowerCase().includes(filters.search.toLowerCase()));
        }

        setFilteredExercises(filtered);
        setCurrentPage(1); // Reset to the first page when filters change
    }, [filters, exercises]);

    // Calculate the indices for the current page
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

    // Calculate total number of pages
    const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    };

    const handleCardSelect = (id) => {
        setSelectedExerciseIds(prevIds =>
            prevIds.includes(id)
                ? prevIds.filter(existingId => existingId !== id)
                : [...prevIds, id]
        );
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const SaveData = async () => {
        const newUserData = {
            userId: userId,
            selectedExerciseIds: selectedExerciseIds
        };
    
        try {
            const response = await fetch("http://localhost:8000/api/Workout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUserData),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log("Data inserted successfully:", data);
            alert("Data Inserted successfully");
            navigate("/workout_Show");
    
        } catch (error) {
            console.error("Error adding data:", error);
        }
    };

    return (
        <div className="content-body">
            <div className="col-lg-12">
                <Container>
                    <h1 className="my-4">Exercises</h1>
                    <Filter
                        categories={[...new Set(exercises.map(exercise => exercise.category))]}
                        mechanics={[...new Set(exercises.map(exercise => exercise.mechanic))]}
                        primaryMuscles={[...new Set(exercises.flatMap(exercise => exercise.primaryMuscles))]}
                        secondaryMuscles={[...new Set(exercises.flatMap(exercise => exercise.secondaryMuscles))]}
                        onFilterChange={handleFilterChange}
                    />
                    {currentExercises.length > 0 ? (
                        <Row>
                            {currentExercises.map(exercise => (
                                <Col md={4} key={exercise.id}>
                                    <ExerciseCard
                                        exercise={exercise}
                                        onSelect={handleCardSelect}
                                        isSelected={selectedExerciseIds.includes(exercise.id)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="loader">
                            {/* Loading Spinner or Message */}
                        </div>
                    )}
                    
                    {/* Pagination Controls */}
                
                    <div className="pagination-controls">
    <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
    >
        Previous
    </Button>

    {/* First three pages */}
    {[...Array(Math.min(3, totalPages)).keys()].map(pageNumber => (
        <Button
            key={pageNumber + 1}
            onClick={() => handlePageChange(pageNumber + 1)}
            active={currentPage === pageNumber + 1}
        >
            {pageNumber + 1}
        </Button>
    ))}

    {/* Ellipsis */}
    {totalPages > 5 && currentPage < totalPages - 2 && (
        <span className="ellipsis">...</span>
    )}

    {/* Last page button */}
    {totalPages > 3 && (
        <Button
            onClick={() => handlePageChange(totalPages)}
            active={currentPage === totalPages}
        >
            {totalPages}
        </Button>
    )}

    <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
    >
        Next
    </Button>
</div>

                </Container>
                
                <Button className="fab-btn" onClick={SaveData}>
                    +
                </Button>
            </div>
        </div>
    );
};

export default ExercisePage;
