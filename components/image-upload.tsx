'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void
  maxFiles?: number
  maxSizeInMB?: number
}

export function ImageUpload({ onImagesChange, maxFiles = 5, maxSizeInMB = 10 }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(files: FileList | null) {
    if (!files) return

    setError('')
    const newImages: File[] = []

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return
      }

      // Validate file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`File size must not exceed ${maxSizeInMB}MB`)
        return
      }

      newImages.push(file)
    })

    // Check total count
    const totalImages = uploadedImages.length + newImages.length
    if (totalImages > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const updated = [...uploadedImages, ...newImages]
    setUploadedImages(updated)
    onImagesChange(updated)
  }

  function removeImage(index: number) {
    const updated = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(updated)
    onImagesChange(updated)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFileSelect(e.dataTransfer.files)
        }}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
        <p className="font-semibold text-foreground mb-1">Drag and drop images here</p>
        <p className="text-sm text-muted-foreground mb-4">
          or{' '}
          <button
            onClick={() => inputRef.current?.click()}
            className="text-primary hover:underline"
          >
            browse from your computer
          </button>
        </p>
        <p className="text-xs text-muted-foreground">
          Supported: JPG, PNG, GIF, WebP • Max {maxSizeInMB}MB per file
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Uploaded Images ({uploadedImages.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                  <Image
                    unoptimized
                    fill
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
