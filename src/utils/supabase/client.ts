// // lib/supabase/client.ts
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(
//     "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
//   );
// }

// let supabaseclient: ReturnType<typeof createClient> | undefined;

// export const Supabase = () => {
//   if (!supabaseclient) {
//     supabaseclient = createClient(supabaseUrl, supabaseAnonKey);
//   }
//   return supabaseclient;
// };





import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const Supabase = createClient(supabaseUrl, supabaseAnonKey);