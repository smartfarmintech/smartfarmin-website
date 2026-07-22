import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function getServerSession(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.getUser(token);
  return { user: data?.user, error };
}

export function requireFounderRole() {
  return (user: any) => {
    // Check if user has founder role
    return user?.user_metadata?.role === "founder" || user?.email?.endsWith("@agreeConnect.com");
  };
}
