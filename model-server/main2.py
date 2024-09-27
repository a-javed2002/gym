import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import io
from PIL import Image

app = FastAPI()

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Curl counter variables
counter = 0
stage = None
monitoring_hand = None  # Variable to store which hand to monitor

# Helper function to calculate angle
def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
    
    return angle

# Pydantic model to define input data format
class FrameData(BaseModel):
    frame: str  # Base64 encoded frame

@app.post("/process-frame")
async def process_frame(data: FrameData):
    global counter, stage, monitoring_hand

    try:
        # Decode the base64 frame
        image_data = base64.b64decode(data.frame)
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)

        # Convert image to BGR (since OpenCV expects this format)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Setup mediapipe pose instance
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            # Convert image to RGB for Mediapipe processing
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
            # Extract landmarks
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                if monitoring_hand is None:
                    left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                    right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
                    
                    if left_wrist[1] < landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y:
                        monitoring_hand = 'left'
                    elif right_wrist[1] < landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y:
                        monitoring_hand = 'right'

                if monitoring_hand == 'left':
                    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                elif monitoring_hand == 'right':
                    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
                    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

                if monitoring_hand:
                    # Calculate the angle
                    angle = calculate_angle(shoulder, elbow, wrist)

                    # Curl counter logic
                    if angle > 160:
                        stage = "down"
                    if angle < 30 and stage == 'down':
                        stage = "up"
                        counter += 1

                # Return the result
                return {
                    "counter": counter,
                    "stage": stage,
                    "monitoring_hand": monitoring_hand
                }
            else:
                raise HTTPException(status_code=400, detail="Pose landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")

# Run the FastAPI server using: uvicorn main:app --reload --port 5001
