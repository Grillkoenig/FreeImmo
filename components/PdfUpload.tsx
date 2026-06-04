'use client'

import { useCallback, useRef, useState } from 'react'

type UploadingFile = {
  id: string
  name: string
  progress: 'uploading' | 'error'
  error?: string
}

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

export default function PdfUpload({ value, onChange, maxFiles = 5 }: Props) {
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = maxFiles - value.length - uploading.length

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).filter(f => f.type === 'application/pdf').slice(0, remaining)
    if (!fileArray.length) return

    const newUploading: UploadingFile[] = fileArray.map(f => ({
      id: Math.random().toString(36).slice(2),
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

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
    },
    [value, remaining] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className="space-y-3">
      {remaining > 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-pink-400 bg-pink-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
          <svg className="w-9 h-9 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-700">
            PDF hierher ziehen oder <span style={{ color: 'var(--primary)' }}>auswählen</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Nur PDF · max. 20 MB · noch {remaining} von {maxFiles} möglich
          </p>
        </div>
      )}

      {(value.length > 0 || uploading.length > 0) && (
        <ul className="space-y-2">
          {value.map(url => {
            const name = decodeURIComponent(url.split('/').pop() ?? url)
            return (
              <li key={url} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM9.5 17.5h-.75v.75a.75.75 0 01-1.5 0v-.75H6.5a.75.75 0 010-1.5h.75v-.75a.75.75 0 011.5 0v.75h.75a.75.75 0 010 1.5zm4.25-1a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5H13a.75.75 0 01.75.75zm2.5 1.5h-1a.75.75 0 010-1.5h1a.75.75 0 010 1.5z" />
                </svg>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-gray-700 truncate hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  {name}
                </a>
                <button
                  type="button"
                  onClick={() => onChange(value.filter(u => u !== url))}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Dokument entfernen"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            )
          })}

          {uploading.map(u => (
            <li key={u.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z" />
              </svg>
              <span className="flex-1 text-sm text-gray-500 truncate">{u.name}</span>
              {u.progress === 'uploading' ? (
                <svg className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-red-500">{u.error}</span>
                  <button
                    type="button"
                    onClick={() => setUploading(prev => prev.filter(p => p.id !== u.id))}
                    className="text-xs text-gray-400 underline"
                  >
                    Schließen
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
