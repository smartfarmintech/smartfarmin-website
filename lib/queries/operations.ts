import { supabase } from "@/lib/supabase/client";

// FIELD OPERATOR OPERATIONS
export const operationsQueries = {
  // Get all field operators with status
  async getFieldOperators() {
    const { data, error } = await supabase
      .from("field_agents")
      .select("id, full_name, status, village_id, current_lat, current_lng, email, phone")
      .eq("status", "active")
      .order("full_name");

    return { data, error };
  },

  // Get operator assignments
  async getOperatorAssignments(operatorId: string) {
    const { data, error } = await supabase
      .from("assigned_farmers")
      .select("farmer_id, is_active, assigned_at")
      .eq("agent_id", operatorId)
      .eq("is_active", true);

    return { data, error };
  },

  // Get bookings by operator
  async getOperatorBookings(operatorId: string, days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, booking_number, booking_state, starts_at, ends_at, total_amount, payment_status")
      .eq("operator_id", operatorId)
      .gte("created_at", startDate);

    return { data, error };
  },

  // Operator performance score
  async getOperatorPerformance(operatorId: string, period = "month") {
    const { data, error } = await supabase
      .from("performance")
      .select("*")
      .eq("telecaller_id", operatorId)
      .eq("period", period)
      .order("period_start", { ascending: false })
      .limit(1);

    return { data, error };
  },

  // MARKETPLACE OPERATIONS
  async getSellerMetrics(sellerId?: string) {
    let query = supabase
      .from("orders")
      .select("id, order_number, order_status, payment_status, total_amount, placed_at, delivered_at");

    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }

    const { data, error } = await query
      .order("placed_at", { ascending: false })
      .limit(100);

    return { data, error };
  },

  // Get inventory status
  async getInventoryStatus(sellerId?: string) {
    let query = supabase
      .from("inventory")
      .select("product_id, quantity_available, quantity_reserved, reorder_level");

    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }

    const { data, error } = await query.limit(100);

    return { data, error };
  },

  // Get stock movements
  async getStockMovements(sellerId: string, days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("stock_movements")
      .select("*")
      .eq("seller_id", sellerId)
      .gte("created_at", startDate)
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // CRM OPERATIONS
  async getLeadsByTeam(teamName: string) {
    const { data, error } = await supabase
      .from("leads")
      .select("id, lead_number, full_name, phone, priority, temperature, score, status_id")
      .eq("team", teamName)
      .order("score", { ascending: false })
      .limit(100);

    return { data, error };
  },

  async getTelecallerStats(telecallerId: string) {
    const { data: calls, error: callsError } = await supabase
      .from("call_logs")
      .select("id, started_at, ended_at, duration_seconds, outcome")
      .eq("telecaller_id", telecallerId)
      .gte("started_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const { data: followups, error: followupsError } = await supabase
      .from("followups")
      .select("id, followup_status")
      .eq("telecaller_id", telecallerId)
      .eq("followup_status", "pending");

    return { calls, followups, errors: [callsError, followupsError] };
  },

  // SERVICE QUALITY METRICS
  async getBookingQuality() {
    const { data, error } = await supabase
      .from("machine_reviews")
      .select("booking_id, rating, operator_rating, verified_booking")
      .order("created_at", { ascending: false })
      .limit(50);

    return { data, error };
  },

  async getServiceComplaints() {
    const { data, error } = await supabase
      .from("error_logs")
      .select("id, level, message, context, created_at")
      .eq("level", "error")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // DAILY OPERATIONS DASHBOARD
  async getDailyOpsMetrics() {
    const today = new Date().toISOString().split("T")[0];

    const [bookings, visits, calls, deliveries] = await Promise.all([
      supabase
        .from("bookings")
        .select("booking_state, payment_status")
        .gte("created_at", `${today}T00:00:00`),
      supabase
        .from("visits")
        .select("status")
        .gte("created_at", `${today}T00:00:00`),
      supabase
        .from("call_logs")
        .select("outcome")
        .gte("started_at", `${today}T00:00:00`),
      supabase
        .from("tracking")
        .select("tracking_status")
        .gte("updated_at", `${today}T00:00:00`),
    ]);

    return {
      bookings: bookings.data,
      visits: visits.data,
      calls: calls.data,
      deliveries: deliveries.data,
      errors: [bookings.error, visits.error, calls.error, deliveries.error],
    };
  },
};
