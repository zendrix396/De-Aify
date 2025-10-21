const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://8a7omfqqf8.execute-api.ap-south-1.amazonaws.com'

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

  // Add retry logic for 503 errors
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-image`, {
        method: 'POST',
        body: formData,
        // Add a longer timeout for image processing
        signal: AbortSignal.timeout(120000), // 2 minutes
      })

      if (!response.ok) {
        let errorText = ''
        try {
          errorText = await response.text()
        } catch {
          errorText = `HTTP ${response.status} ${response.statusText}`
        }
        // Handle specific error cases
        if (response.status === 503) {
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, attempt * 2000))
            continue
          }
          throw new ApiError(
            'Service temporarily unavailable. Please try again in a moment.',
            response.status,
            response
          )
        } else if (response.status === 429) {
          throw new ApiError(
            'Rate limit exceeded. Please wait a moment before trying again.',
            response.status,
            response
          )
        }
        
        throw new ApiError(
          `Failed to process image: ${errorText}`,
          response.status,
          response
        )
      }

      return response.blob()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxRetries && error instanceof ApiError && error.status === 503) {
        await new Promise(resolve => setTimeout(resolve, attempt * 2000))
        continue
      }
      
      throw error
    }
  }

  throw lastError || new Error('All retry attempts failed')
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
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })
    
    if (!response.ok) {
      throw new ApiError(
        'API health check failed',
        response.status,
        response
      )
    }

    return response.json()
  } catch (error) {
    throw error
  }
}
