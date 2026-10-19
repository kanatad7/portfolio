import {createClient, type SupabaseClient} from '@supabase/supabase-js';
let client: SupabaseClient | null = null;
export const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function supabase(){if(!configured)return null;if(!client)client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);return client;}
