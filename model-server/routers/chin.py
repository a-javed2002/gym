import base64
import io
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image
import cv2
import mediapipe as mp

router = APIRouter()

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
chin_movement_count = {"up": 0, "down": 0, "left": 0, "right": 0}

class FrameData(BaseModel):
    frame: str  # Base64 encoded frame

@router.post("/process-chin-exercise")
async def process_chin_exercise(data: FrameData):
    global chin_movement_count

    try:
        # Decode the base64 frame
        image_data = base64.b64decode(data.frame)
        image = Image.open(io.BytesIO(image_data))
        image = np.array(image)

        # Convert image to BGR
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(image_rgb)

            if results.multi_face_landmarks:
                landmarks = results.multi_face_landmarks[0].landmark
                chin_position = np.array([landmarks[152].x, landmarks[152].y])  # Chin
                nose_position = np.array([landmarks[1].x, landmarks[1].y])    # Nose

                # Define movement threshold
                vertical_threshold = 0.02
                horizontal_threshold = 0.02

                # Determine the direction based on chin's position
                if chin_position[1] < nose_position[1] - vertical_threshold:
                    chin_movement_count['up'] += 1
                elif chin_position[1] > nose_position[1] + vertical_threshold:
                    chin_movement_count['down'] += 1
                elif chin_position[0] < nose_position[0] - horizontal_threshold:
                    chin_movement_count['left'] += 1
                elif chin_position[0] > nose_position[0] + horizontal_threshold:
                    chin_movement_count['right'] += 1

                return {
                    "counter": chin_movement_count,
                }
            else:
                raise HTTPException(status_code=400, detail="Face landmarks not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")
