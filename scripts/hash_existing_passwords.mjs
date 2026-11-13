/**
 * P0.1 Migration Script: Hash all legacy plaintext passwords in `admission_users`
 * Usage: node scripts/hash_existing_passwords.mjs
 */
import fs from "fs";
import path from "path";
import { randomBytes, scryptSync } from "crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: users, error } = await supabase
    .from("admission_users")
    .select("id, email, password");

  if (error) {
    console.error("Gagal mengambil data admission_users:", error.message);
    process.exit(1);
  }

  let upgraded = 0;
  let alreadyHashed = 0;

  for (const user of users || []) {
    if (typeof user.password === "string" && user.password.startsWith("scrypt$")) {
      alreadyHashed++;
      continue;
    }
    if (!user.password) continue;

    const hashed = hashPassword(String(user.password));
    const { error: updateErr } = await supabase
      .from("admission_users")
      .update({ password: hashed })
      .eq("id", user.id);

    if (updateErr) {
      console.error(`Gagal update password untuk ${user.email}:`, updateErr.message);
    } else {
      upgraded++;
      console.log(`Hashed: ${user.email}`);
    }
  }

  console.log(`Selesai. Upgraded: ${upgraded}, Sudah di-hash: ${alreadyHashed}`);
}

main();

