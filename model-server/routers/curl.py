import base64
import io
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image
import cv2
import mediapipe as mp

router = APIRouter()

# Initialize Mediapipe Pose
mp_pose = mp.solutions.pose
curl_counter = 0
curl_stage = None
monitoring_hand = None

class FrameData(BaseModel):
    frame: str  # Base64 encoded frame

@router.post("/process-frame")
async def process_frame(data: FrameData):
    global curl_counter, curl_stage, monitoring_hand

    try:
        # Decode the base64 frame
        image_data = base64.b64decode(data.frame)
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)

        # Convert image to BGR
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
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
                    angle = calculate_angle(shoulder, elbow, wrist)

                    if angle > 160:
                        curl_stage = "down"
                    if angle < 30 and curl_stage == 'down':
                        curl_stage = "up"
                        curl_counter += 1

                return {
                    "counter": curl_counter,
                    "stage": curl_stage,
                    "monitoring_hand": monitoring_hand
                }
            else:
                raise HTTPException(status_code=400, detail="Pose landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")

# Angle calculation function
def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
    
    return angle
