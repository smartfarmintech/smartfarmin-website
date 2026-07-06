// ======================== CRM & TELECALLER OPERATIONS ========================

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== LEAD MANAGEMENT ===================

export async function createLead(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const lead = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    farm_location: formData.get('farm_location'),
    land_size_acres: parseFloat(formData.get('land_size_acres') as string),
    crop_type: formData.get('crop_type'),
    interested_in: formData.get('interested_in'), // machinery, drone_services, marketplace
    source: formData.get('source'), // website, call, referral, event
    assigned_to: user.id,
    status: 'new',
    created_at: new Date().toISOString(),
  }

  const { data: newLead, error } = await supabase
    .from('leads')
    .insert(lead)
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { leadId: newLead.id } }
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
  notes?: string,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Update lead
  const { error: updateError } = await supabase
    .from('leads')
    .update({
      status: newStatus,
      last_updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (updateError) return { ok: false, error: updateError.message }

  // Add to status history
  const { error: historyError } = await supabase
    .from('lead_status_history')
    .insert({
      lead_id: leadId,
      old_status: null,
      new_status: newStatus,
      changed_by: user.id,
      notes,
      changed_at: new Date().toISOString(),
    })

  if (historyError) return { ok: false, error: historyError.message }
  return { ok: true }
}

export async function assignLead(leadId: string, telecallerId: string): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .update({
      assigned_to: telecallerId,
      last_updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== LEAD INTERACTIONS & FOLLOW-UPS ===================

export async function addLeadInteraction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const interaction = {
    lead_id: formData.get('lead_id'),
    interaction_type: formData.get('interaction_type'), // call, email, sms, visit, whatsapp
    notes: formData.get('notes'),
    outcome: formData.get('outcome'), // positive, negative, pending
    created_by: user.id,
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('lead_interactions')
    .insert(interaction)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function scheduleFollowUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const followUp = {
    lead_id: formData.get('lead_id'),
    scheduled_date: formData.get('scheduled_date'),
    scheduled_time: formData.get('scheduled_time'),
    reminder_type: formData.get('reminder_type'), // email, sms, notification
    assigned_to: user.id,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('lead_follow_ups')
    .insert(followUp)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== CONVERSION TRACKING ===================

export async function recordLeadConversion(
  leadId: string,
  conversionData: Record<string, any>,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Update lead status
  const { error: leadError } = await supabase
    .from('leads')
    .update({
      status: 'converted',
      converted_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (leadError) return { ok: false, error: leadError.message }

  // Create conversion record
  const { error: conversionError } = await supabase
    .from('lead_conversions')
    .insert({
      lead_id: leadId,
      converted_by: user.id,
      conversion_value: conversionData.conversion_value,
      product_type: conversionData.product_type, // machinery, drone_service, marketplace_order
      booking_id: conversionData.booking_id,
      order_id: conversionData.order_id,
      converted_at: new Date().toISOString(),
    })

  if (conversionError) return { ok: false, error: conversionError.message }
  return { ok: true }
}

// =================== TELECALLER PERFORMANCE ===================

export async function getTelecallerStats(): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Get leads assigned
  const { data: leads, count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('assigned_to', user.id)

  // Get conversions
  const { data: conversions, count: conversionsCount } = await supabase
    .from('lead_conversions')
    .select('*', { count: 'exact' })
    .eq('converted_by', user.id)

  // Get interactions this month
  const monthStart = new Date()
  monthStart.setDate(1)

  const { data: interactions, count: interactionsCount } = await supabase
    .from('lead_interactions')
    .select('*', { count: 'exact' })
    .eq('created_by', user.id)
    .gte('created_at', monthStart.toISOString())

  const conversionRate = leadsCount ? (conversionsCount / leadsCount) * 100 : 0
  const totalValue = conversions?.reduce((sum, c) => sum + (c.conversion_value || 0), 0) || 0

  return {
    ok: true,
    data: {
      total_leads: leadsCount || 0,
      conversions: conversionsCount || 0,
      conversion_rate: conversionRate,
      interactions_this_month: interactionsCount || 0,
      total_conversion_value: totalValue,
    },
  }
}

// =================== LEAD IMPORT & BULK OPERATIONS ===================

export async function importLeads(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const leadsData = JSON.parse(formData.get('leads_data') as string)

  const leads = leadsData.map((lead: any) => ({
    ...lead,
    assigned_to: user.id,
    status: 'new',
    created_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('leads')
    .insert(leads)

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { imported_count: leads.length } }
}

// =================== LEAD TAGS & CATEGORIZATION ===================

export async function addLeadTag(
  leadId: string,
  tag: string,
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('lead_tags')
    .insert({
      lead_id: leadId,
      tag,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function removeLeadTag(
  leadId: string,
  tag: string,
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('lead_tags')
    .delete()
    .eq('lead_id', leadId)
    .eq('tag', tag)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
