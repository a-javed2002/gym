import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './ChinExercisePage.css';  // External CSS for better styling

const ChinExercisePage = () => {
    const webcamRef = useRef(null);
    const containerRef = useRef(null);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState(null);
    const PYTHON_API_URL = 'http://localhost:5001';  // URL of the Python FastAPI server

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: 'user',
    };

    // Request camera permission and enable camera
    const enableCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setCameraEnabled(true);
        } catch (err) {
            console.error('Camera permission denied', err);
            alert('Camera permission is required to use this feature.');
        }
    };

    // Close the camera feed
    const closeCamera = () => {
        setCameraEnabled(false);
        setStreaming(false);
        setResult(null);
    };

    // Capture frame and send it for real-time processing
    const capture = useCallback(async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            try {
                const response = await axios.post(`${PYTHON_API_URL}/process-chin-exercise`, {
                    frame: imageSrc.split(',')[1], // Send base64 image without the header
                });
    
                setResult(response.data);
            } catch (error) {
                console.error('Error processing frame:', error);
            }
        }
    }, [webcamRef]);

    // Reset the model and UI
    const handleRestart = async () => {
        try {
            await axios.post(`${PYTHON_API_URL}/reset`);
            setResult(null); // Reset the result UI
            setStreaming(false); // Stop streaming
            setStreaming(true);  // Start new stream
        } catch (error) {
            console.error('Error resetting model:', error);
        }
    };

    // Start and stop streaming
    useEffect(() => {
        let interval;
        if (cameraEnabled && streaming) {
            interval = setInterval(capture, 1000); // Capture every second
        } else if (!streaming) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [cameraEnabled, streaming, capture]);

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if (containerRef.current.mozRequestFullScreen) { /* Firefox */
                containerRef.current.mozRequestFullScreen();
            } else if (containerRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                containerRef.current.webkitRequestFullscreen();
            } else if (containerRef.current.msRequestFullscreen) { /* IE/Edge */
                containerRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="main-body">
            <div id="app" className='exercise-container'>
                <div ref={containerRef} className="content-container">
                    <h1>Chin Exercise Tracker</h1>
                    <p>Move your chin to the right, left, up, and down!</p>

                    {!cameraEnabled ? (
                        <button className="btn-primary" onClick={enableCamera}>Enable Camera</button>
                    ) : (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={640}
                                height={480}
                                videoConstraints={videoConstraints}
                                className="webcam"
                            />
                            <div className="button-container">
                                <button className="btn-primary" onClick={() => setStreaming(!streaming)}>
                                    {streaming ? 'Stop' : 'Start'}
                                </button>
                                <button className="btn-secondary" onClick={handleRestart}>Restart</button>
                                <button className="btn-secondary" onClick={toggleFullscreen}>Fullscreen</button>
                                <button className="btn-danger" onClick={closeCamera}>Close Camera</button>
                            </div>
                        </>
                    )}

                    {result && (
                        <div className="result-container">
                            <h2>Processing Result:</h2>
                            <div className="result-stats">
                                <p>Up Count: {result.counter.up}</p>
                                <p>Down Count: {result.counter.down}</p>
                                <p>Left Count: {result.counter.left}</p>
                                <p>Right Count: {result.counter.right}</p>
                                <p>Current Direction: {result.current_direction}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChinExercisePage;
