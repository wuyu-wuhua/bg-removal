'use client'

import { Download, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProcessedImage } from '@/types'
import { useLanguage } from '@/contexts/language-context'

interface ImageResultProps {
  image: ProcessedImage
  showComparison: string | null
  onToggleComparison: (id: string) => void
  onDownload: (image: ProcessedImage) => void
  onRemove: (id: string) => void
}

export function ImageResult({
  image,
  showComparison,
  onToggleComparison,
  onDownload,
  onRemove
}: ImageResultProps) {
  const { t } = useLanguage()
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <div className="relative aspect-square bg-gray-700">
        {image.processing ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300 font-medium">{t('upload.editor.processing')}</p>
              <div className="w-48 mt-4">
                <Progress value={image.progress} className="h-2" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={showComparison === image.id ? image.originalUrl : image.processedUrl}
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Button
                onClick={() => onToggleComparison(image.id)}
                size="icon"
                variant="outline"
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                {showComparison === image.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white truncate">{image.name}</h3>
          {!image.processing && (
            <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">
              {t('upload.editor.processingComplete')}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => onDownload(image)}
            disabled={image.processing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-sm sm:text-base"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>{t('upload.editor.download')}</span>
          </Button>
          <Button
            onClick={() => onRemove(image.id)}
            variant="outline"
            size="icon"
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 min-w-[44px] min-h-[44px]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 