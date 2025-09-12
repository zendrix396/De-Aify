# De-AIfy - AI Image Detection Bypass Tool

A web application that processes AI-generated images to make them undetectable by AI detection algorithms like SightEngine. Reduce AI detection rates from 100% to as low as 2% while preserving image quality.

## Features

- **Image Processing**: Advanced filtering algorithms to modify AI-generated images
- **Adjustable Settings**: Control processing intensity and iterations
- **Privacy Focused**: All processing happens locally, no data sent to external services

## Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **PIL (Pillow)**: Image processing library
- **NumPy**: Numerical computing for image arrays
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **Lucide React**: Beautiful icons

## Project Structure

```
de-aify/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   └── lib/           # Utility functions
│   ├── package.json       # Node.js dependencies
│   └── README.md         # Frontend documentation
└── README.md             # Main documentation
```

## Usage

1. **Upload Image**: Click the upload area or drag and drop an AI-generated image
2. **Adjust Settings**: 
   - **Iterations**: Number of processing cycles (1-10)
   - **Intensity**: Processing strength (0.1-2.0)
3. **Process**: Click "De-AIfy Image" to start processing
4. **Download**: Save the processed image that bypasses AI detection

## API Endpoints

### `POST /process-image`
Process an image to reduce AI detectability.

**Parameters:**
- `file`: Image file (multipart/form-data)
- `iterations`: Number of processing iterations (1-10)
- `intensity`: Processing intensity (0.1-2.0)

**Response:** Processed image binary data

### `POST /analyze-image`
Analyze an image and return metadata.

**Parameters:**
- `file`: Image file (multipart/form-data)

**Response:** JSON with image analysis

### `GET /health`
Health check endpoint.

**Response:** `{"status": "healthy"}`

## How It Works

The de-AIfy algorithm applies a series of image processing techniques:

1. **Upscaling**: Scale image by 4x using Lanczos resampling
2. **Median Filtering**: Apply noise reduction filter
3. **Gaussian Noise**: Add subtle random noise patterns
4. **Downscaling**: Resize back to original dimensions

This process subtly modifies the image characteristics that AI detection algorithms look for, while preserving visual quality for human viewers.

## Performance

- **Processing Time**: 2-10 seconds depending on image size and settings
- **Quality Retention**: 95-98% visual quality preserved
- **Detection Reduction**: From 100% to 2-5% AI detection rate
