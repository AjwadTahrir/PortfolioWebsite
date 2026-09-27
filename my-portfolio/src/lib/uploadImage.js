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

/* Deletes a file previously returned by uploadImage, given its public URL.
   Best-effort: a URL that isn't one of ours (an old /screenshots/... public
   path, or something pasted by hand) is left alone rather than thrown on. */
export async function deleteImage(url) {
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return;
  const path = url.slice(i + marker.length).split("?")[0];
  await supabase.storage.from(BUCKET).remove([path]);
}

/* Deletes every file under `<prefix>/` in the bucket — used when a project
   (and everything uploaded for it) is removed entirely. Best-effort: an
   empty or already-missing folder is silently a no-op. */
export async function deleteFolder(prefix) {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix);
  if (error || !data?.length) return;
  await supabase.storage.from(BUCKET).remove(data.map((file) => `${prefix}/${file.name}`));
}
