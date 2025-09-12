from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image, ImageFilter
import numpy as np
import io
import os
from typing import Optional

app = FastAPI(title="De-AIfy Image Processor", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def add_gaussian_noise(image, percentage):
    """
    Adds Gaussian noise to an image.
    """
    # Convert image to numpy array and ensure it's in a float format for calculations
    img_array = np.array(image, dtype=np.float32)
    
    # Calculate noise standard deviation
    # The percentage is based on the range of pixel values (0-255)
    std_dev = (percentage / 100) * 255
    
    # Generate Gaussian noise
    noise = np.random.normal(0, std_dev, img_array.shape)
    
    # Add noise to the image array
    noisy_img_array = img_array + noise
    
    # Clip values to be in the valid range [0, 255]
    noisy_img_array = np.clip(noisy_img_array, 0, 255)
    
    # Convert back to uint8 and then to a PIL image
    noisy_image = Image.fromarray(noisy_img_array.astype('uint8'), image.mode)
    
    return noisy_image

def process_image_iterations(image: Image.Image, iterations: int, intensity: float = 1.0):
    """
    Process an image through multiple iterations of the de-AIfy algorithm.
    
    Args:
        image: PIL Image object
        iterations: Number of processing iterations
        intensity: Intensity multiplier (0.1 to 2.0)
    
    Returns:
        Processed PIL Image object
    """
    current_img = image.copy()
    
    # Adjust parameters based on intensity
    base_noise_percentage = 4
    noise_percentage = base_noise_percentage * intensity
    
    # Clamp noise percentage to reasonable bounds
    noise_percentage = max(1, min(10, noise_percentage))
    
    for i in range(iterations):
        original_size = current_img.size
        
        # Ensure image is in a mode that supports the operations (e.g., RGB)
        if current_img.mode not in ['RGB', 'L']:
            current_img = current_img.convert('RGB')

        # 1. Scale up the image by 4x
        upscaled_size = (original_size[0] * 4, original_size[1] * 4)
        upscaled_img = current_img.resize(upscaled_size, Image.Resampling.LANCZOS)

        # 2. Apply Median filter
        # A radius of 2px corresponds to a size of 5.
        median_filter_size = 5
        filtered_img = upscaled_img.filter(ImageFilter.MedianFilter(size=median_filter_size))

        # 3. Add Gaussian noise
        noisy_img = add_gaussian_noise(filtered_img, noise_percentage)

        # 4. Resize back to original size
        processed_img = noisy_img.resize(original_size, Image.Resampling.LANCZOS)

        # The output of this iteration is the input for the next one
        current_img = processed_img

    return current_img

@app.get("/")
async def root():
    return {"message": "De-AIfy Image Processor API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/process-image")
async def process_image(
    file: UploadFile = File(...),
    iterations: int = Form(default=1),
    intensity: float = Form(default=1.0)
):
    """
    Process an uploaded image to make it less detectable as AI-generated.
    
    Args:
        file: Image file to process
        iterations: Number of processing iterations (1-10)
        intensity: Processing intensity (0.1-2.0)
    
    Returns:
        Processed image as binary data
    """
    
    # Validate parameters
    if iterations < 1 or iterations > 10:
        raise HTTPException(status_code=400, detail="Iterations must be between 1 and 10")
    
    if intensity < 0.1 or intensity > 2.0:
        raise HTTPException(status_code=400, detail="Intensity must be between 0.1 and 2.0")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Process the image
        processed_image = process_image_iterations(image, iterations, intensity)
        
        # Convert processed image to bytes
        img_byte_array = io.BytesIO()
        
        # Determine output format based on input
        output_format = 'PNG'  # Default to PNG for quality
        if file.content_type == 'image/jpeg':
            output_format = 'JPEG'
        
        processed_image.save(img_byte_array, format=output_format, quality=95)
        img_byte_array.seek(0)
        
        # Return the processed image
        media_type = f"image/{output_format.lower()}"
        return Response(
            content=img_byte_array.getvalue(),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename=processed_image.{output_format.lower()}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze an image and return basic information.
    
    Args:
        file: Image file to analyze
    
    Returns:
        Image metadata and analysis
    """
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Get image information
        info = {
            "filename": file.filename,
            "format": image.format,
            "mode": image.mode,
            "size": {
                "width": image.size[0],
                "height": image.size[1]
            },
            "file_size_bytes": len(image_data),
            "estimated_ai_detection_risk": "High (placeholder - integrate with actual AI detection service)"
        }
        
        return info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
