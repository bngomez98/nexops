"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Camera, Loader2, Upload } from "lucide-react"

interface AvatarUploadProps {
  uid: string
  url: string | null
  name: string
  onUpload: (url: string) => void
}

const MAX_BYTES    = 5 * 1024 * 1024
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"]

export function AvatarUpload({ uid, url, name, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so re-selecting the same file works
    e.target.value = ""
    setError(null)

    if (!ALLOWED_MIME.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are accepted.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 5 MB.")
      return
    }

    // Show local preview immediately so the UI feels instant
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const supabase = createClient()
      const ext  = file.type === "image/png"  ? "png"
                 : file.type === "image/webp" ? "webp"
                 : "jpg"
      const path = `${uid}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      // Cache-bust so the browser always fetches the new image
      const freshUrl = `${data.publicUrl}?t=${Date.now()}`

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: freshUrl, updated_at: new Date().toISOString() })
        .eq("id", uid)

      if (profileError) throw profileError

      URL.revokeObjectURL(objectUrl)
      setPreview(null)
      onUpload(freshUrl)
    } catch (err: unknown) {
      URL.revokeObjectURL(objectUrl)
      setPreview(null)
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const displayUrl = preview ?? url

  return (
    <div className="flex items-center gap-4">
      {/* Avatar circle — click anywhere to upload */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Change profile photo"
          className="group relative h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-primary/10 transition hover:ring-2 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={name}
              fill
              sizes="64px"
              className={`object-cover transition-opacity ${uploading ? "opacity-50" : "opacity-100"}`}
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
              {initials}
            </span>
          )}
          {/* Hover overlay */}
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Upload className="h-4 w-4 text-white" />
          </span>
        </button>

        {/* Camera badge */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          tabIndex={-1}
          aria-hidden
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          {uploading
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <Camera className="h-3 w-3" />}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Label + action text */}
      <div>
        <p className="text-sm font-medium leading-tight">{name}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-1 text-[11px] text-primary hover:underline underline-offset-2 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : displayUrl ? "Change photo" : "Add photo"}
        </button>
        {error && (
          <p className="mt-1 text-[11px] text-destructive leading-snug max-w-xs">{error}</p>
        )}
        <p className="mt-0.5 text-[10px] text-muted-foreground">JPG, PNG, or WebP · max 5 MB</p>
      </div>
    </div>
  )
}
