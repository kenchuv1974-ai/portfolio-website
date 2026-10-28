/**
 * Optional Supabase Backend Integration
 * If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present,
 * the portfolio syncs with Supabase PostgreSQL and Storage buckets.
 * Otherwise, the built-in resilient local persistence engine is used.
 */

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const url = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http')),
  };
}

/**
 * Sync data to Supabase table if configured
 */
export async function syncToSupabase(payload: unknown): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/portfolio_data?id=eq.default`, {
      method: 'PATCH',
      headers: {
        'apikey': config.anonKey!,
        'Authorization': `Bearer ${config.anonKey!}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        content: payload,
        updated_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Supabase sync skipped or failed:', err);
    return false;
  }
}
