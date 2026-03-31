from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2

# Import controllers
from controllers import engrave_mask_controller
from controllers import extract_mask_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Watermarking service is healthy."}

@app.post("/engrave")
async def engrave_images(image: UploadFile = File(...), watermark: UploadFile = File(...)):
    try:
        # Read image files into bytes
        image_bytes = await image.read()
        watermark_bytes = await watermark.read()

        # Pass bytes to the controller
        result_image = engrave_mask_controller.process(image_bytes, watermark_bytes)

        # Encode the result back to an image format (e.g., JPEG) for response
        _, encoded_img = cv2.imencode('.jpg', result_image)

        return Response(content=encoded_img.tobytes(), media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/extract")
async def extract_images(marked_image: UploadFile = File(...), original_image: UploadFile = File(...), watermark: UploadFile = File(...)):
    try:
        # Read image files into bytes
        marked_image_bytes = await marked_image.read()
        original_image_bytes = await original_image.read()
        watermark_bytes = await watermark.read()

        # Pass bytes to the controller
        result_image = extract_mask_controller.process(marked_image_bytes, original_image_bytes, watermark_bytes)

        # Encode the result back to an image format (e.g., JPEG) for response
        _, encoded_img = cv2.imencode('.jpg', result_image)

        return Response(content=encoded_img.tobytes(), media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import os
    host = os.getenv("WATERMARK_SERVICE_HOST", "0.0.0.0")
    port = int(os.getenv("WATERMARK_SERVICE_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)