'use client'

import { Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'alert'
  title: string
  message: string
  timestamp: string
  actionLabel?: string
  onAction?: () => void
  read: boolean
}

interface BookingNotificationsProps {
  notifications?: Notification[]
}

export function BookingNotifications({
  notifications = [
    {
      id: '1',
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Your machinery booking for Jan 15, 2024 has been confirmed.',
      timestamp: '5 minutes ago',
      actionLabel: 'View Booking',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Operator Assigned',
      message: 'Ramesh Yadav has been assigned as your operator. He will arrive in 20 minutes.',
      timestamp: '2 minutes ago',
      actionLabel: 'Call Operator',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Weather Alert',
      message: 'Light rain expected in your area. Operator may need additional time.',
      timestamp: 'Just now',
      actionLabel: 'Reschedule',
      read: false,
    },
    {
      id: '4',
      type: 'success',
      title: 'Payment Received',
      message: 'Payment of ₹5,718 has been successfully processed.',
      timestamp: '30 minutes ago',
      actionLabel: 'View Invoice',
      read: true,
    },
    {
      id: '5',
      type: 'info',
      title: 'Booking Tips',
      message: 'Clear obstacles from your field and ensure personnel are briefed before machinery arrival.',
      timestamp: '2 hours ago',
      actionLabel: 'Read Guidelines',
      read: true,
    },
  ],
}: BookingNotificationsProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'alert':
        return 'bg-red-50 border-red-200'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 border ${getBackgroundColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-offset-2 ring-current' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">{getIcon(notification.type)}</div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-current flex-shrink-0 mt-2" />
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notification.timestamp}
                    </span>
                    {notification.actionLabel && (
                      <Button size="sm" variant="outline" onClick={notification.onAction}>
                        {notification.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Notification Preferences</h3>

        <div className="space-y-4">
          {[
            { label: 'Booking Updates', desc: 'Status changes for your bookings' },
            { label: 'Operator Messages', desc: 'Messages from your assigned operator' },
            { label: 'Weather Alerts', desc: 'Weather-related alerts for your area' },
            { label: 'Payment Notifications', desc: 'Payment confirmations and invoices' },
            { label: 'Promotions', desc: 'Special offers and discounts' },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors">
              <div>
                <p className="font-medium text-sm">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded"
              />
            </div>
          ))}
        </div>

        <Button className="w-full mt-4">Save Preferences</Button>
      </Card>
    </div>
  )
}
