from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import curl, chin, shrug

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers for each exercise
app.include_router(curl.router, prefix="/curl", tags=["Curl"])
app.include_router(chin.router, prefix="/chin", tags=["Chin"])
app.include_router(shrug.router, prefix="/shrug", tags=["Shrug"])

@app.get("/")
async def hello_world():
    return {"message": "Hello World!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)  # Run the server on all interfaces
