'use client'

import { useCallback, useRef, useState } from 'react'

type UploadedImage = {
  url: string
  previewUrl: string
  name: string
  rotating?: boolean
}

type UploadingImage = {
  id: string
  previewUrl: string
  name: string
  progress: 'uploading' | 'error'
  error?: string
}

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

export default function ImageUpload({ value, onChange, maxFiles = 10 }: Props) {
  const [uploading, setUploading] = useState<UploadingImage[]>([])
  const [rotating, setRotating] = useState<Set<string>>(new Set())
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadedImages: UploadedImage[] = value.map(url => ({
    url,
    previewUrl: url,
    name: url.split('/').pop() ?? url,
  }))

  const remaining = maxFiles - value.length - uploading.length

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).slice(0, remaining)
    if (!fileArray.length) return

    const newUploading: UploadingImage[] = fileArray.map(f => ({
      id: Math.random().toString(36).slice(2),
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      progress: 'uploading',
    }))
    setUploading(prev => [...prev, ...newUploading])

    const fd = new FormData()
    fileArray.forEach(f => fd.append('files', f))

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setUploading(prev =>
          prev.map(u =>
            newUploading.some(n => n.id === u.id)
              ? { ...u, progress: 'error', error: data.error ?? 'Upload fehlgeschlagen' }
              : u
          )
        )
        return
      }

      onChange([...value, ...(data.urls as string[])])
      setUploading(prev => prev.filter(u => !newUploading.some(n => n.id === u.id)))
    } catch {
      setUploading(prev =>
        prev.map(u =>
          newUploading.some(n => n.id === u.id)
            ? { ...u, progress: 'error', error: 'Netzwerkfehler' }
            : u
        )
      )
    }
  }

  function removeUploaded(url: string) {
    onChange(value.filter(u => u !== url))
  }

  async function rotateImage(url: string) {
    if (!url.startsWith('/uploads/')) return
    setRotating(prev => new Set(prev).add(url))
    try {
      const res = await fetch('/api/upload/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        onChange(value.map(u => (u === url ? data.url : u)))
      }
    } finally {
      setRotating(prev => { const s = new Set(prev); s.delete(url); return s })
    }
  }

  function dismissError(id: string) {
    setUploading(prev => prev.filter(u => u.id !== id))
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
    },
    [value, remaining] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const total = uploadedImages.length + uploading.length

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {remaining > 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-pink-400 bg-pink-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
          <svg
            className="w-10 h-10 mx-auto mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-700">
            Bilder hierher ziehen oder <span style={{ color: 'var(--primary)' }}>auswählen</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, WebP · max. 10 MB · noch {remaining} von {maxFiles} möglich
          </p>
        </div>
      )}

      {/* Grid of uploaded + uploading images */}
      {total > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {uploadedImages.map((img, i) => (
            <div key={img.url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />

              {/* Spinner while rotating */}
              {rotating.has(img.url) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}

              {/* Main image badge */}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded">
                  Hauptbild
                </span>
              )}

              {/* Rotate button */}
              {img.url.startsWith('/uploads/') && (
                <button
                  type="button"
                  onClick={() => rotateImage(img.url)}
                  disabled={rotating.has(img.url)}
                  className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 disabled:opacity-50"
                  aria-label="Bild drehen"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeUploaded(img.url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Bild entfernen"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {uploading.map(u => (
            <div key={u.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={u.previewUrl} alt={u.name} className="w-full h-full object-cover opacity-50" />

              {u.progress === 'uploading' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 p-1">
                  <svg className="w-5 h-5 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-white text-[9px] text-center leading-tight">{u.error}</p>
                  <button
                    type="button"
                    onClick={() => dismissError(u.id)}
                    className="mt-1 text-[9px] text-white/80 underline"
                  >
                    Schließen
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {total > 0 && (
        <p className="text-xs text-gray-400">
          {value.length} Bild{value.length !== 1 ? 'er' : ''} hochgeladen
          {value.length > 0 && ' · Das erste Bild wird als Hauptbild verwendet'}
        </p>
      )}
    </div>
  )
}
