import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;
let lastUsedUrl = "";
let lastUsedKey = "";
let lastSupabaseServerDate: Date | null = null;

export function getLastSupabaseServerDate(): Date | null {
  return lastSupabaseServerDate;
}

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  // Prefer Service Role Key on the server to bypass RLS restrictions safely; fallback to Anon Key
  const key =
    (typeof window === "undefined" ? process.env.SUPABASE_SERVICE_ROLE_KEY : "") ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url || !key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Supabase credentials (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing in environment."
      );
    }
    return null;
  }

  // If credentials changed or instance not created yet
  if (!supabaseInstance || lastUsedUrl !== url || lastUsedKey !== key) {
    lastUsedUrl = url;
    lastUsedKey = key;
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          try {
            const dateHeader = response.headers.get("date");
            if (dateHeader) {
              const parsed = new Date(dateHeader);
              if (!isNaN(parsed.getTime())) {
                lastSupabaseServerDate = parsed;
              }
            }
          } catch (e) {
            // ignore header parse error
          }
          return response;
        },
      },
    });
  }

  return supabaseInstance;
}

export const supabase = getSupabase();
