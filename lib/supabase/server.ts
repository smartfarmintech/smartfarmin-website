// Placeholder for Supabase server client
export async function createClient() {
  // This is a placeholder - in production, implement actual Supabase client
  return {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      eq: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    }),
  }
}
