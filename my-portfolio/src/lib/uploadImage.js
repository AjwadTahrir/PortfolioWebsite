import { supabase } from "./supabase";

const BUCKET = "screenshots";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB — generous for a screenshot, cheap to raise if needed

/* Sanitizes to lowercase letters/digits/dot/dash so the resulting URL is
   never mangled by spaces or unicode in the original filename. */
function safeFileName(file) {
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${Date.now()}.${ext || "png"}`;
}

/* Uploads `file` under `<projectId>/<timestamp>.<ext>` in the "screenshots"
   bucket and returns its public URL — the exact string a visual's `src`
   (or a cover story figure's `src`) expects. Throws on failure; callers
   show err.message. */
export default async function uploadImage(file, projectId) {
  if (!projectId) throw new Error("Set the project ID before uploading images.");
  if (file.size > MAX_BYTES) throw new Error(`File is over ${MAX_BYTES / 1024 / 1024}MB.`);
  if (!file.type.startsWith("image/")) throw new Error("Not an image file.");

  const path = `${projectId}/${safeFileName(file)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
