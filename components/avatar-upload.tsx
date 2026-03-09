"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Camera, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  uid: string
  url: string | null
  name: string
  onUpload: (url: string) => void
}

export function AvatarUpload({ uid, url, name, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop()
      const path = `${uid}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`

      // Save to profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", uid)

      if (profileError) throw profileError

      onUpload(publicUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-primary/10">
          {url ? (
            <Image
              src={url}
              alt={name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
              {initials}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Change profile photo"
        >
          {uploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Camera className="h-3 w-3" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-0.5 text-[11px] text-primary hover:underline disabled:opacity-50"
        >
          {uploading ? "Uploading…" : url ? "Change photo" : "Add photo"}
        </button>
        {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
        <p className="mt-0.5 text-[10px] text-muted-foreground">JPG, PNG, or WebP — max 5 MB</p>
      </div>
    </div>
  )
}
