import { supabase } from "@/lib/supabase/client";

// REVENUE ANALYTICS QUERIES
export const analyticsQueries = {
  // Daily Revenue
  async getDailyRevenue(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("*")
      .eq("metric_key", "revenue")
      .gte("metric_date", startDate)
      .lte("metric_date", endDate)
      .order("metric_date", { ascending: true });

    return { data, error };
  },

  // Monthly Revenue with breakdown
  async getMonthlyRevenue(year: number) {
    const { data, error } = await supabase
      .from("monthly_metrics")
      .select("*")
      .eq("metric_key", "revenue")
      .eq("year", year)
      .order("month", { ascending: true });

    return { data, error };
  },

  // Revenue by source/platform
  async getRevenueBySource() {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("dimension, sum_value")
      .eq("metric_key", "revenue")
      .gt("metric_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

    return { data, error };
  },

  // USER METRICS QUERIES
  async getActiveUsers(days = 30) {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("metric_date, count_value")
      .eq("metric_key", "active_users")
      .gt("metric_date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      .order("metric_date", { ascending: true });

    return { data, error };
  },

  // New user registrations
  async getNewUserRegistrations(days = 30) {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("metric_date, count_value")
      .eq("metric_key", "new_users")
      .gt("metric_date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      .order("metric_date", { ascending: true });

    return { data, error };
  },

  // User retention cohorts
  async getUserRetention() {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("breakdown")
      .eq("metric_key", "retention_cohort")
      .order("metric_date", { ascending: false })
      .limit(1);

    return { data: data?.[0]?.breakdown, error };
  },

  // BOOKING & TRANSACTION METRICS
  async getBookingMetrics(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select("booking_state, booking_number, total_amount, payment_status, created_at")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    return { data, error };
  },

  // Payment success rate
  async getPaymentSuccessRate() {
    const { data, error } = await supabase
      .from("payment_requests")
      .select("request_status")
      .eq("request_status", "completed");

    return { data, error };
  },

  // Transaction volume & value
  async getTransactionVolume(days = 30) {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("metric_date, count_value, sum_value")
      .eq("metric_key", "transactions")
      .gt("metric_date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      .order("metric_date", { ascending: true });

    return { data, error };
  },

  // OPERATIONAL METRICS
  async getFieldAgentActivity() {
    const { data, error } = await supabase
      .from("v_field_agent_activity")
      .select("*")
      .limit(100);

    return { data, error };
  },

  async getFieldOperatorPerformance() {
    const { data, error } = await supabase
      .from("operators")
      .select("id, full_name, rating_avg, total_bookings, daily_wage")
      .order("rating_avg", { ascending: false })
      .limit(50);

    return { data, error };
  },

  // LEADS & CONVERSION
  async getLeadMetrics() {
    const { data, error } = await supabase
      .from("leads")
      .select("id, status_id, priority, temperature, score, converted_at, last_contacted_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    return { data, error };
  },

  async getConversionFunnel() {
    const { data, error } = await supabase
      .from("lead_status")
      .select("id, name, is_won, is_lost");

    return { data, error };
  },

  // MARKETPLACE METRICS
  async getProductSalesMetrics(productId?: string) {
    let query = supabase.from("order_items").select("product_id, quantity, line_total, created_at");

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(200);

    return { data, error };
  },

  async getTopSellingProducts() {
    const { data, error } = await supabase
      .from("v_product_catalog")
      .select("product_id, name, price, quantity_available, rating_avg, rating_count")
      .order("rating_count", { ascending: false })
      .limit(20);

    return { data, error };
  },

  // GEOGRAPHIC DISTRIBUTION
  async getUsersByGeography() {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("village_id")
      .not("village_id", "is", null);

    return { data, error };
  },

  async getRevenueByRegion() {
    const { data, error } = await supabase
      .from("daily_metrics")
      .select("dimension, sum_value")
      .eq("metric_key", "revenue_by_region")
      .gte("metric_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

    return { data, error };
  },

  // HEALTH & PERFORMANCE METRICS
  async getSystemHealth() {
    const { data, error } = await supabase
      .from("system_health")
      .select("*")
      .order("checked_at", { ascending: false })
      .limit(10);

    return { data, error };
  },

  async getErrorRate(days = 7) {
    const { data, error } = await supabase
      .from("error_logs")
      .select("level, created_at")
      .gt("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    return { data, error };
  },

  // CUSTOMER METRICS
  async getCustomerLifetimeValue() {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("user_id, amount, txn_type")
      .eq("txn_type", "debit");

    return { data, error };
  },

  async getChurnRate(days = 90) {
    const thirtyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("user_profiles")
      .select("user_id, last_active_at")
      .lt("last_active_at", thirtyDaysAgo);

    return { data, error };
  },
};
