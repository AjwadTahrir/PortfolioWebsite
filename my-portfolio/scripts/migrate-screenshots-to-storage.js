// One-time migration: uploads the screenshots that currently live in
// public/screenshots/ (from before admin uploads existed) into the
// Supabase "screenshots" bucket, then rewrites each project's visuals/
// cover_story to point at the new Storage URL instead of the old local
// path. Safe to re-run — anything already migrated (src no longer
// starting with "/screenshots/") is left untouched, and re-uploading the
// same file is skipped (upsert: true) rather than erroring.
//
// Run once, locally, after storage.sql (needs the bucket to already exist):
//   npm run migrate-screenshots
//
// Requires the same .env.local values as `npm run seed`
// (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
//
// This does NOT delete public/screenshots/ or touch git — once you've
// confirmed the site still renders every image correctly, remove that
// folder yourself if you want to reclaim the repo space.

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";

dotenv.config({ path: ".env.local" });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const supabase = createClient(url, serviceKey);

const BUCKET = "screenshots";
const LOCAL_PREFIX = "/screenshots/"; // what an unmigrated src still looks like
const CONTENT_TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" };

const uploadedUrlCache = new Map(); // avoids re-uploading the same file twice in one run

async function uploadLocalFile(localSrc) {
  if (uploadedUrlCache.has(localSrc)) return uploadedUrlCache.get(localSrc);

  const relativePath = localSrc.replace(LOCAL_PREFIX, ""); // "<project>/<file>.png"
  const absolutePath = join(process.cwd(), "public", "screenshots", relativePath);
  const bytes = readFileSync(absolutePath); // throws clearly if the file is missing — intentional
  const ext = relativePath.split(".").pop().toLowerCase();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(relativePath, bytes, { contentType: CONTENT_TYPES[ext] || "application/octet-stream", upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(relativePath);
  uploadedUrlCache.set(localSrc, data.publicUrl);
  return data.publicUrl;
}

/* Walks one project's visuals + cover_story, migrating any src that's
   still a local path. Returns { visuals, cover_story, changed }. */
async function migrateProject(project) {
  let changed = false;

  const visuals = [];
  for (const visual of project.visuals || []) {
    if (visual.type === "screenshot" && visual.src?.startsWith(LOCAL_PREFIX)) {
      const newSrc = await uploadLocalFile(visual.src);
      visuals.push({ ...visual, src: newSrc });
      changed = true;
      console.log(`  ${project.id}: ${visual.src} → Storage`);
    } else {
      visuals.push(visual);
    }
  }

  let coverStory = project.cover_story;
  if (coverStory?.figure?.src?.startsWith(LOCAL_PREFIX)) {
    const newSrc = await uploadLocalFile(coverStory.figure.src);
    coverStory = { ...coverStory, figure: { ...coverStory.figure, src: newSrc } };
    changed = true;
    console.log(`  ${project.id}: ${project.cover_story.figure.src} → Storage (cover)`);
  }

  return { visuals, cover_story: coverStory, changed };
}

async function run() {
  const { data: projects, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error("✗ could not read projects:", error.message);
    process.exit(1);
  }

  let migratedCount = 0;
  for (const project of projects) {
    const { visuals, cover_story, changed } = await migrateProject(project);
    if (!changed) continue;
    const { error: updateError } = await supabase.from("projects").update({ visuals, cover_story }).eq("id", project.id);
    if (updateError) {
      console.error(`✗ ${project.id}: failed to save —`, updateError.message);
      process.exitCode = 1;
      continue;
    }
    migratedCount += 1;
  }

  console.log(migratedCount ? `\n✓ migrated ${migratedCount} project(s)` : "\nNothing to migrate — already up to date.");
}

run();