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
shrug_counter = 0
shrug_stage = None
last_shoulder_height = None

class FrameData(BaseModel):
    frame: str  # Base64 encoded frame

@router.post("/process-shoulder-shrug")
async def process_shoulder_shrug(data: FrameData):
    global shrug_counter, shrug_stage, last_shoulder_height

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
                left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
                right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                
                current_shoulder_height = (left_shoulder.y + right_shoulder.y) / 2

                if last_shoulder_height is None:
                    last_shoulder_height = current_shoulder_height

                if current_shoulder_height < last_shoulder_height:
                    shrug_stage = "up"
                elif current_shoulder_height > last_shoulder_height:
                    shrug_stage = "down"

                if shrug_stage == "up":
                    shrug_counter += 1

                last_shoulder_height = current_shoulder_height

                return {
                    "shrug_counter": shrug_counter,
                    "shrug_stage": shrug_stage
                }
            else:
                raise HTTPException(status_code=400, detail="Pose landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")
