import React, { useState, memo } from 'react';
import { Card, Button, Modal, Row, Col } from 'react-bootstrap';
import Carousel from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Define carousel settings
const carouselSettings = {
  dots: false,
  infinite: true,
  speed: 5, // Adjusted speed
  autoplay: true,
  autoplaySpeed: 5, // Increased delay between slides
  slidesToShow: 1,
  slidesToScroll: 1,
};

// Memoized ExerciseCard component to prevent unnecessary re-renders
const ExerciseCard = memo(({ exercise }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card className="exercise-card">
        <Carousel {...carouselSettings}>
          {exercise.images.map((image, index) => (
            <div key={index}>
              <LazyLoadImage
                effect="blur"
                src={`http://localhost:8000/${image}`}
                alt={`Exercise ${index}`}
                className="img-fluid w-100"
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </Carousel>
        <Card.Body>
            i want onnly title show
          <Card.Title>{exercise.name}</Card.Title>
          when i hover the card image blur and show equipment and  More Info button with down to up animation
          <Card.Text>
            Equipment: {exercise.equipment}
          </Card.Text>
          <Button className="custom-btn" onClick={handleShow}>
            <FontAwesomeIcon icon={faInfoCircle} /> More Info
          </Button>
        </Card.Body>

        <Modal show={show} onHide={handleClose} className="exercise-modal">
          <Modal.Header closeButton>
            <Modal.Title>{exercise.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Carousel {...carouselSettings}>
                  {exercise.images.map((image, index) => (
                    <div key={index}>
                      <LazyLoadImage
                        effect="blur"
                        src={`http://localhost:8000/${image}`}
                        alt={exercise.name}
                        className="img-fluid"
                        style={{ height: '100%' }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
              <Col md={6}>
                <p><strong>Category:</strong> {exercise.category}</p>
                <p><strong>Primary Muscles:</strong> {exercise.primaryMuscles.join(', ')}</p>
                <p><strong>Secondary Muscles:</strong> {exercise.secondaryMuscles.join(', ')}</p>
                <p><strong>Mechanic:</strong> {exercise.mechanic}</p>
              </Col>
              <Col md={12}>
                <h5>Instructions:</h5>
                <ul>
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
                <Button className="custom-btn-add" style={{ width: '100%' }}>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Card>
    </>
  );
});

export default ExerciseCard;
