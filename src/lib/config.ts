export const adminEnabled = import.meta.env.VITE_ADMIN_ENABLED === "true";
export const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || "").trim();
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
