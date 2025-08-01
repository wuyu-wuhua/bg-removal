'use client'

import { useRef, useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isValidImageFile } from '@/lib/utils'

interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void
  className?: string
}

export function UploadZone({ onFilesSelected, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onFilesSelected(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files)
    }
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
        isDragOver
          ? "border-blue-500 bg-blue-500/10 scale-105"
          : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-gray-800 p-6 rounded-full">
          <Upload className="h-12 w-12 text-gray-400" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            拖拽图片到这里
          </h3>
          <p className="text-gray-400 text-lg mb-6">
            或点击选择文件
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold"
          >
            <ImageIcon className="h-5 w-5 mr-2" />
            <span>选择图片</span>
          </Button>
        </div>
        <p className="text-gray-500 text-sm">
          支持 JPG, PNG, WEBP • 最大 10MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  )
} 