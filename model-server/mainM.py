import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
from PIL import Image
import uvicorn  # Import uvicorn for running the app

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Mediapipe
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Initialize counters and states
chin_movement_count = {"up": 0, "down": 0, "left": 0, "right": 0}
curl_counter = 0
curl_stage = None
monitoring_hand = None  # Variable to store which hand to monitor

shrug_counter = 0
shrug_stage = None  # "up" or "down"
last_shoulder_height = None  # Store the height of the shoulder for comparison

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

# Reset functions
@app.post("/reset")
async def reset_state():
    global curl_counter, curl_stage, monitoring_hand
    curl_counter = 0
    curl_stage = None
    monitoring_hand = None
    return {"message": "Curl state has been reset"}

@app.post("/reset-shoulder-shrug")
async def reset_shoulder_shrug():
    global shrug_counter, shrug_stage, last_shoulder_height
    shrug_counter = 0
    shrug_stage = None
    last_shoulder_height = None
    return {"message": "Shoulder shrug state has been reset"}

@app.post("/reset-chin")
async def reset_chin():
    global chin_movement_count
    chin_movement_count = {"up": 0, "down": 0, "left": 0, "right": 0}
    return {"message": "Chin movement state has been reset"}

# Endpoint to process frame for curl exercise
@app.post("/process-frame")
async def process_frame(data: FrameData):
    global curl_counter, curl_stage, monitoring_hand

    try:
        # Decode the base64 frame
        image_data = base64.b64decode(data.frame)
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)

        # Convert image to BGR (since OpenCV expects this format)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Setup Mediapipe pose instance
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            # Convert image to RGB for Mediapipe processing
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
            # Extract landmarks
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                # Determine which hand to monitor
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
                        curl_stage = "down"
                    if angle < 30 and curl_stage == 'down':
                        curl_stage = "up"
                        curl_counter += 1

                # Return the result
                return {
                    "counter": curl_counter,
                    "stage": curl_stage,
                    "monitoring_hand": monitoring_hand
                }
            else:
                raise HTTPException(status_code=400, detail="Pose landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")

# Endpoint to process frame for chin exercise
@app.post("/process-chin-exercise")
async def process_chin_exercise(data: FrameData):
    global chin_movement_count

    try:
        # Decode the base64 frame
        image_data = base64.b64decode(data.frame)
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)

        # Convert image to BGR (since OpenCV expects this format)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Setup Mediapipe Face Mesh instance
        with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
            # Convert image to RGB for Mediapipe processing
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(image_rgb)

            if results.multi_face_landmarks:
                # Extract landmarks for the first face
                landmarks = results.multi_face_landmarks[0].landmark

                # Get chin position (landmark 152 in the face mesh model)
                chin_position = np.array([landmarks[152].x, landmarks[152].y])  # Chin
                nose_position = np.array([landmarks[1].x, landmarks[1].y])    # Using the nose as a reference

                # Define movement threshold
                vertical_threshold = 0.02  # Tweak this value
                horizontal_threshold = 0.02 # Tweak this value

                # Determine the direction based on the chin's position relative to the nose
                if chin_position[1] < nose_position[1] - vertical_threshold:
                    chin_movement_count['up'] += 1
                elif chin_position[1] > nose_position[1] + vertical_threshold:
                    chin_movement_count['down'] += 1
                elif chin_position[0] < nose_position[0] - horizontal_threshold:
                    chin_movement_count['left'] += 1
                elif chin_position[0] > nose_position[0] + horizontal_threshold:
                    chin_movement_count['right'] += 1

                # Return the result
                return {
                    "counter": chin_movement_count,
                    "current_direction": current_direction
                }
            else:
                raise HTTPException(status_code=400, detail="Face landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")

# Endpoint to process frame for shoulder shrug exercise
@app.post("/process-shoulder-shrug")
async def process_shoulder_shrug(data: FrameData):
    global shrug_counter, shrug_stage, last_shoulder_height

    try:
        # Decode the base64 frame
        image_data = base64.b64decode(data.frame)
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)

        # Convert image to BGR (since OpenCV expects this format)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Setup Mediapipe pose instance
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            # Convert image to RGB for Mediapipe processing
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
            # Check if pose landmarks are detected
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                
                # Extract shoulder positions
                left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
                right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                
                # Calculate the average height of the shoulders
                current_shoulder_height = (left_shoulder.y + right_shoulder.y) / 2
                
                # Initial comparison to set the baseline height
                if last_shoulder_height is None:
                    last_shoulder_height = current_shoulder_height
                
                # Determine the stage of the shoulder shrug
                if current_shoulder_height < last_shoulder_height:  # Shoulders are raised
                    shrug_stage = "up"
                elif current_shoulder_height > last_shoulder_height:  # Shoulders are lowered
                    shrug_stage = "down"

                # Count the shoulder shrugs
                if shrug_stage == "up":
                    shrug_counter += 1  # Count the shrug when the shoulders are raised
                
                # Update the last shoulder height for the next frame comparison
                last_shoulder_height = current_shoulder_height

                # Return the result
                return {
                    "shrug_counter": shrug_counter,
                    "shrug_stage": shrug_stage
                }
            else:
                raise HTTPException(status_code=400, detail="Pose landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")

@app.get("/")
async def hello_world():
    return {"message": "Hello World!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)  # Run the server on all interfaces
