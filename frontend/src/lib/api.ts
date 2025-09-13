const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://deaify.zendrix.dev'

export interface ProcessImageParams {
  file: File
  iterations: number
  intensity: number
}

export interface ImageAnalysis {
  filename: string
  format: string
  mode: string
  size: {
    width: number
    height: number
  }
  file_size_bytes: number
  estimated_ai_detection_risk: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function processImage({
  file,
  iterations,
  intensity,
}: ProcessImageParams): Promise<Blob> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('iterations', iterations.toString())
  formData.append('intensity', intensity.toString())

  const response = await fetch(`${API_BASE_URL}/process-image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(
      `Failed to process image: ${errorText}`,
      response.status,
      response
    )
  }

  return response.blob()
}

export async function analyzeImage(file: File): Promise<ImageAnalysis> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/analyze-image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(
      `Failed to analyze image: ${errorText}`,
      response.status,
      response
    )
  }

  return response.json()
}

export async function checkApiHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`)
  
  if (!response.ok) {
    throw new ApiError(
      'API health check failed',
      response.status,
      response
    )
  }

  return response.json()
}
