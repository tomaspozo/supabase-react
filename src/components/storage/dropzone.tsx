import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSupabase } from '@/lib/use-supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FileUpload = {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

export function Dropzone() {
  const { user } = useSupabase()
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    if (!user) {
      alert('Please sign in to upload files')
      return
    }

    const fileId = `${Date.now()}-${file.name}`
    const fileUpload: FileUpload = {
      file,
      progress: 0,
      status: 'uploading',
    }

    setFiles((prev) => [...prev, fileUpload])

    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileId, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(data.path)

      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, progress: 100, status: 'success', url: urlData.publicUrl }
            : f
        )
      )
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? {
                ...f,
                progress: 0,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      )
    }
  }, [user])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      droppedFiles.forEach((file) => uploadFile(file))
    },
    [uploadFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      selectedFiles.forEach((file) => uploadFile(file))
    },
    [uploadFile]
  )

  const removeFile = useCallback((file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file))
  }, [])

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Sign in to upload files</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>
          Drag and drop files here or click to select files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          )}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileInput}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: Any file type
            </p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((fileUpload, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <File className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileUpload.file.name}
                  </p>
                  <div className="mt-2">
                    {fileUpload.status === 'uploading' && (
                      <Progress value={fileUpload.progress} className="h-1" />
                    )}
                    {fileUpload.status === 'success' && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Uploaded successfully
                      </p>
                    )}
                    {fileUpload.status === 'error' && (
                      <p className="text-xs text-destructive">
                        {fileUpload.error || 'Upload failed'}
                      </p>
                    )}
                  </div>
                  {fileUpload.url && (
                    <a
                      href={fileUpload.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 block"
                    >
                      View file
                    </a>
                  )}
                </div>
                {fileUpload.status === 'uploading' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeFile(fileUpload.file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

