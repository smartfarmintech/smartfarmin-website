// ======================== NOTIFICATION SERVICE ========================

import { createClient } from '@/lib/supabase/server'

export type NotificationType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_completed'
  | 'booking_cancelled'
  | 'payment_successful'
  | 'payment_failed'
  | 'refund_processed'
  | 'drone_service_completed'
  | 'lead_assigned'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'review_request'
  | 'message'

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app'

export interface CreateNotificationParams {
  user_id: string
  title: string
  message: string
  notification_type: NotificationType
  channels: NotificationChannel[]
  data?: Record<string, any>
  priority?: 'low' | 'normal' | 'high'
}

// =================== CREATE NOTIFICATION ===================

export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient()

  try {
    // Store in database
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.user_id,
        title: params.title,
        message: params.message,
        notification_type: params.notification_type,
        data: params.data || {},
        priority: params.priority || 'normal',
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[v0] Notification creation error:', error)
      return { success: false, error: error.message }
    }

    // Send through requested channels
    for (const channel of params.channels) {
      await sendNotification(params.user_id, notification.id, params, channel)
    }

    return { success: true, notification_id: notification.id }
  } catch (error) {
    console.error('[v0] Notification service error:', error)
    return { success: false, error: 'Notification creation failed' }
  }
}

// =================== SEND THROUGH CHANNELS ===================

async function sendNotification(
  userId: string,
  notificationId: string,
  params: CreateNotificationParams,
  channel: NotificationChannel,
) {
  const supabase = await createClient()

  try {
    // Get user contact info
    const { data: user } = await supabase
      .from('user_profiles')
      .select('email, phone')
      .eq('user_id', userId)
      .single()

    if (!user) return

    let sendResult = { success: false }

    switch (channel) {
      case 'email':
        sendResult = await sendEmailNotification(user.email, params)
        break
      case 'sms':
        sendResult = await sendSMSNotification(user.phone, params)
        break
      case 'push':
        sendResult = await sendPushNotification(userId, params)
        break
      case 'in_app':
        // Already stored in database
        sendResult = { success: true }
        break
    }

    // Log channel send
    if (sendResult.success) {
      await supabase
        .from('notification_channels_log')
        .insert({
          notification_id: notificationId,
          channel,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
    }
  } catch (error) {
    console.error(`[v0] Error sending ${channel} notification:`, error)
  }
}

// =================== EMAIL NOTIFICATIONS ===================

async function sendEmailNotification(
  email: string,
  params: CreateNotificationParams,
) {
  try {
    // Use your email service (SendGrid, AWS SES, Resend, etc.)
    // This is a template - implement based on your email service

    const emailContent = {
      to: email,
      subject: params.title,
      html: `
        <h2>${params.title}</h2>
        <p>${params.message}</p>
        ${params.data?.action_url ? `<a href="${params.data.action_url}">View Details</a>` : ''}
      `,
    }

    // TODO: Send via your email service
    console.log('[v0] Email would be sent:', emailContent)

    return { success: true }
  } catch (error) {
    console.error('[v0] Email send error:', error)
    return { success: false, error: 'Email send failed' }
  }
}

// =================== SMS NOTIFICATIONS ===================

async function sendSMSNotification(
  phone: string,
  params: CreateNotificationParams,
) {
  try {
    // Use Twilio, AWS SNS, or similar
    // This is a template - implement based on your SMS service

    const smsContent = {
      to: phone,
      body: `${params.title}: ${params.message}`,
    }

    // TODO: Send via your SMS service (e.g., Twilio)
    console.log('[v0] SMS would be sent:', smsContent)

    return { success: true }
  } catch (error) {
    console.error('[v0] SMS send error:', error)
    return { success: false, error: 'SMS send failed' }
  }
}

// =================== PUSH NOTIFICATIONS ===================

async function sendPushNotification(
  userId: string,
  params: CreateNotificationParams,
) {
  const supabase = await createClient()

  try {
    // Get user's push tokens
    const { data: devices } = await supabase
      .from('user_devices')
      .select('push_token')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (!devices || devices.length === 0) {
      return { success: true } // No devices registered
    }

    // Send push to each device
    // TODO: Implement based on your push service (FCM, APNs, OneSignal)

    console.log('[v0] Push notifications would be sent to', devices.length, 'devices')

    return { success: true }
  } catch (error) {
    console.error('[v0] Push send error:', error)
    return { success: false, error: 'Push send failed' }
  }
}

// =================== MARK AS READ ===================

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('[v0] Mark as read error:', error)
    return { success: false }
  }
}

// =================== NOTIFICATION PREFERENCES ===================

export async function updateNotificationPreferences(
  userId: string,
  preferences: Record<string, any>,
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('notification_preferences')
      .upsert(
        { user_id: userId, ...preferences },
        { onConflict: 'user_id' },
      )

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('[v0] Preferences update error:', error)
    return { success: false }
  }
}

// =================== NOTIFICATION TEMPLATES ===================

export const notificationTemplates = {
  BOOKING_CREATED: (bookingId: string, machineType: string) => ({
    title: 'Booking Confirmed',
    message: `Your booking for ${machineType} has been created (ID: ${bookingId})`,
  }),

  BOOKING_ACCEPTED: (bookingId: string) => ({
    title: 'Booking Accepted',
    message: `Your booking ${bookingId} has been accepted by the operator`,
  }),

  BOOKING_COMPLETED: (bookingId: string) => ({
    title: 'Booking Completed',
    message: `Your booking ${bookingId} has been completed. Please leave a review.`,
  }),

  PAYMENT_SUCCESSFUL: (amount: number) => ({
    title: 'Payment Successful',
    message: `Payment of ₹${amount} has been processed successfully`,
  }),

  PAYMENT_FAILED: (amount: number) => ({
    title: 'Payment Failed',
    message: `Payment of ₹${amount} failed. Please try again.`,
  }),

  DRONE_SERVICE_COMPLETED: (serviceType: string) => ({
    title: 'Service Completed',
    message: `Your ${serviceType} service has been completed successfully`,
  }),

  LEAD_ASSIGNED: (telecallerName: string) => ({
    title: 'New Assignment',
    message: `You have been assigned a new lead by ${telecallerName}`,
  }),

  ORDER_SHIPPED: (orderId: string) => ({
    title: 'Order Shipped',
    message: `Your order ${orderId} has been shipped. Track your package now.`,
  }),

  ORDER_DELIVERED: (orderId: string) => ({
    title: 'Order Delivered',
    message: `Your order ${orderId} has been delivered. Thank you for shopping!`,
  }),

  REVIEW_REQUEST: (serviceName: string) => ({
    title: 'Share Your Feedback',
    message: `How was your experience with ${serviceName}? Leave a review.`,
  }),
}

// =================== BULK NOTIFICATIONS ===================

export async function sendBulkNotification(
  userIds: string[],
  params: Omit<CreateNotificationParams, 'user_id'>,
) {
  const supabase = await createClient()

  try {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      title: params.title,
      message: params.message,
      notification_type: params.notification_type,
      data: params.data || {},
      priority: params.priority || 'normal',
      is_read: false,
      created_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('notifications')
      .insert(notifications)

    if (error) return { success: false, error: error.message }
    return { success: true, count: notifications.length }
  } catch (error) {
    console.error('[v0] Bulk notification error:', error)
    return { success: false }
  }
}

// =================== SCHEDULED NOTIFICATIONS ===================

export async function scheduleNotification(
  params: CreateNotificationParams,
  scheduledFor: Date,
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('scheduled_notifications')
      .insert({
        user_id: params.user_id,
        title: params.title,
        message: params.message,
        notification_type: params.notification_type,
        channels: params.channels,
        data: params.data || {},
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
      })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (error) {
    console.error('[v0] Schedule notification error:', error)
    return { success: false }
  }
}
