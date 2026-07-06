// ======================== FIELD AGENT OPERATIONS ========================

'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionState } from '@/lib/types/actions'

// =================== FIELD AGENT TASKS ===================

export async function assignTaskToFieldAgent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()

  const task = {
    assigned_to: formData.get('field_agent_id'),
    task_type: formData.get('task_type'), // farm_survey, kyc_verification, machine_demo, training
    description: formData.get('description'),
    location: formData.get('location'),
    target_user: formData.get('target_user'),
    scheduled_date: formData.get('scheduled_date'),
    scheduled_time: formData.get('scheduled_time'),
    priority: formData.get('priority'), // low, medium, high
    status: 'assigned',
    created_at: new Date().toISOString(),
  }

  const { data: newTask, error } = await supabase
    .from('field_agent_tasks')
    .insert(task)
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { taskId: newTask.id } }
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: string,
  notes?: string,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('field_agent_tasks')
    .update({
      status: newStatus,
      completion_notes: notes,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .eq('assigned_to', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== FARM SURVEYS & ASSESSMENTS ===================

export async function createFarmSurvey(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const survey = {
    created_by: user.id,
    farmer_id: formData.get('farmer_id'),
    soil_type: formData.get('soil_type'),
    ph_level: parseFloat(formData.get('ph_level') as string),
    irrigation_type: formData.get('irrigation_type'),
    current_crops: formData.get('current_crops'),
    land_size_acres: parseFloat(formData.get('land_size_acres') as string),
    annual_rainfall: parseFloat(formData.get('annual_rainfall') as string),
    farmer_income: formData.get('farmer_income'), // low, medium, high
    notes: formData.get('notes'),
    survey_date: new Date().toISOString(),
  }

  const { data: newSurvey, error } = await supabase
    .from('farm_surveys')
    .insert(survey)
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { surveyId: newSurvey.id } }
}

// =================== KYC VERIFICATION ===================

export async function initiateKYCVerification(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const kyc = {
    farmer_id: formData.get('farmer_id'),
    verified_by: user.id,
    aadhar_verified: formData.get('aadhar_verified') === 'true',
    bank_verified: formData.get('bank_verified') === 'true',
    land_verified: formData.get('land_verified') === 'true',
    verification_notes: formData.get('verification_notes'),
    status: 'completed',
    verified_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('kyc_verifications')
    .insert(kyc)

  if (error) return { ok: false, error: error.message }

  // Update farmer profile
  await supabase
    .from('farmers')
    .update({
      kyc_status: 'verified',
      kyc_verified_by: user.id,
      kyc_verified_at: new Date().toISOString(),
    })
    .eq('id', formData.get('farmer_id'))

  return { ok: true }
}

// =================== MACHINE DEMOS & TRAINING ===================

export async function createMachineDemo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const demo = {
    created_by: user.id,
    farmer_id: formData.get('farmer_id'),
    machine_id: formData.get('machine_id'),
    demo_date: formData.get('demo_date'),
    demo_time: formData.get('demo_time'),
    location: formData.get('location'),
    attendees_count: parseInt(formData.get('attendees_count') as string),
    feedback: formData.get('feedback'),
    interested: formData.get('interested') === 'true',
    status: 'scheduled',
    created_at: new Date().toISOString(),
  }

  const { data: newDemo, error } = await supabase
    .from('machine_demos')
    .insert(demo)
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { demoId: newDemo.id } }
}

export async function completeMachineDemo(
  demoId: string,
  completionData: Record<string, any>,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('machine_demos')
    .update({
      status: 'completed',
      feedback: completionData.feedback,
      interested: completionData.interested,
      completed_at: new Date().toISOString(),
    })
    .eq('id', demoId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== FARMER VISITS & FOLLOW-UPS ===================

export async function logFarmerVisit(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const visit = {
    created_by: user.id,
    farmer_id: formData.get('farmer_id'),
    visit_date: formData.get('visit_date'),
    visit_type: formData.get('visit_type'), // routine, emergency, follow_up, survey
    duration_minutes: parseInt(formData.get('duration_minutes') as string),
    topics_discussed: formData.get('topics_discussed'),
    farmer_feedback: formData.get('farmer_feedback'),
    next_follow_up: formData.get('next_follow_up'),
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('farmer_visits')
    .insert(visit)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== PERFORMANCE TRACKING ===================

export async function getFieldAgentMetrics(): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Get tasks assigned
  const { count: tasksAssigned } = await supabase
    .from('field_agent_tasks')
    .select('*', { count: 'exact' })
    .eq('assigned_to', user.id)

  // Get completed tasks this month
  const monthStart = new Date()
  monthStart.setDate(1)

  const { count: tasksCompleted } = await supabase
    .from('field_agent_tasks')
    .select('*', { count: 'exact' })
    .eq('assigned_to', user.id)
    .eq('status', 'completed')
    .gte('completed_at', monthStart.toISOString())

  // Get farmers visited
  const { count: farmersVisited } = await supabase
    .from('farmer_visits')
    .select('*', { count: 'exact' })
    .eq('created_by', user.id)
    .gte('visit_date', monthStart.toISOString())

  // Get surveys completed
  const { count: surveysCompleted } = await supabase
    .from('farm_surveys')
    .select('*', { count: 'exact' })
    .eq('created_by', user.id)
    .gte('survey_date', monthStart.toISOString())

  const completionRate = tasksAssigned ? (tasksCompleted / tasksAssigned) * 100 : 0

  return {
    ok: true,
    data: {
      tasks_assigned: tasksAssigned || 0,
      tasks_completed_month: tasksCompleted || 0,
      completion_rate: completionRate,
      farmers_visited_month: farmersVisited || 0,
      surveys_completed_month: surveysCompleted || 0,
    },
  }
}

// =================== EXPENSE TRACKING ===================

export async function logExpense(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const expense = {
    field_agent_id: user.id,
    expense_type: formData.get('expense_type'), // travel, meals, demo_materials, other
    amount: parseFloat(formData.get('amount') as string),
    description: formData.get('description'),
    expense_date: formData.get('expense_date'),
    receipt_url: formData.get('receipt_url'),
    status: 'pending_approval',
    created_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('field_agent_expenses')
    .insert(expense)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// =================== FARMER FEEDBACK & RATINGS ===================

export async function submitFarmerFeedback(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const feedback = {
    field_agent_id: user.id,
    farmer_id: formData.get('farmer_id'),
    rating: parseInt(formData.get('rating') as string),
    feedback_text: formData.get('feedback_text'),
    is_satisfied: formData.get('is_satisfied') === 'true',
    feedback_date: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('farmer_feedback')
    .insert(feedback)

  if (error) return { ok: false, error: error.message }

  // Update agent average rating
  const { data: feedbacks } = await supabase
    .from('farmer_feedback')
    .select('rating')
    .eq('field_agent_id', user.id)

  if (feedbacks) {
    const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    await supabase
      .from('field_agents')
      .update({
        average_rating: avgRating,
        total_ratings: feedbacks.length,
      })
      .eq('user_id', user.id)
  }

  return { ok: true }
}
