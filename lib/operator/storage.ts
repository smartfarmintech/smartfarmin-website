import { createClient } from "@/lib/supabase/client"

export const OPERATOR_MEDIA_BUCKET = "operator-media"

export type UploadResult = { path: string; error: string | null }

/**
 * Uploads a file to the private operator-media bucket under the user's uid folder.
 * RLS requires the first path segment to equal auth.uid().
 */
export async function uploadOperatorFile(
  userId: string,
  folder: string,
  file: File,
): Promise<UploadResult> {
  const supabase = createClient()
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase()
  const path = `${userId}/${safeFolder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(OPERATOR_MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false })

  if (error) {
    return { path: "", error: error.message }
  }
  return { path, error: null }
}

/**
 * Returns a signed URL for a private object (valid for the given number of seconds).
 */
export async function getSignedUrl(path: string, expiresIn = 60 * 60): Promise<string | null> {
  if (!path) return null
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(OPERATOR_MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn)
  if (error) return null
  return data.signedUrl
}

export async function removeOperatorFile(path: string): Promise<void> {
  if (!path) return
  const supabase = createClient()
  await supabase.storage.from(OPERATOR_MEDIA_BUCKET).remove([path])
}
