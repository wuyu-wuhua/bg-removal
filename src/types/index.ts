export interface ProcessedImage {
  id: string
  originalFile: File
  originalUrl: string
  processedUrl: string
  name: string
  processing: boolean
  progress?: number
}

export interface UploadState {
  isDragOver: boolean
  isUploading: boolean
  error: string | null
}

export interface ProcessingOptions {
  quality: number
  format: 'png' | 'jpg' | 'webp'
  removeBackground: boolean
  enhanceImage: boolean
} 