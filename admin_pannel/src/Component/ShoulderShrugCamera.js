import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const ShoulderShrugCamera = () => {
    const webcamRef = useRef(null);
    const containerRef = useRef(null);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [result, setResult] = useState(null);
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

    // Capture frame and send it for shoulder shrug processing
    const capture = useCallback(async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            try {
                const response = await axios.post(`${PYTHON_API_URL}/process-shoulder-shrug`, {
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
            await axios.post(`${PYTHON_API_URL}/reset-shoulder-shrug`);
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
            <div id="app" className='row'>
                <div ref={containerRef} style={{ position: 'relative', maxWidth: '100%' }}>
                    <h1>Shoulder Shrug Camera Feed</h1>

                    {!cameraEnabled ? (
                        <button onClick={enableCamera}>Enable Camera</button>
                    ) : (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={640}
                                height={480}
                                videoConstraints={videoConstraints}
                                style={{ width: '100%', maxWidth: '100%' }}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => setStreaming(!streaming)}>
                                    {streaming ? 'Stop' : 'Start'}
                                </button>
                                <button onClick={handleRestart} style={{ marginLeft: '10px' }}>Restart</button>
                                <button onClick={toggleFullscreen} style={{ marginLeft: '10px' }}>Fullscreen</button>
                                <button onClick={closeCamera} style={{ marginLeft: '10px' }}>Close Camera</button>
                            </div>
                        </>
                    )}

                    {result && (
                        <div style={{ marginTop: '20px' }}>
                            <h2>Processing Result:</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <p>Shrug Counter: {result.shrug_counter}</p>
                                <p>Shrug Stage: {result.shrug_stage}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoulderShrugCamera;
