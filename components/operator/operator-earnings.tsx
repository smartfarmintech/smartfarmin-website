'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, TrendingUp, DollarSign } from 'lucide-react'

interface EarningRecord {
  id: string
  booking_number: string
  machine_name: string
  booking_period: string
  amount: number
  commission_rate: number
  platform_commission: number
  gst: number
  net_earnings: number
  transaction_date: string
}

interface Summary {
  period: string
  total_bookings: number
  total_earnings: number
  platform_commission: number
  gst: number
  net_earnings: number
  avg_booking_value: number
}

const mockEarnings: EarningRecord[] = [
  {
    id: '1',
    booking_number: 'BK-001',
    machine_name: 'Tractor - 50HP',
    booking_period: '3 days (Jul 20-22)',
    amount: 4500,
    commission_rate: 15,
    platform_commission: 675,
    gst: 121.5,
    net_earnings: 3703.5,
    transaction_date: '2024-07-23',
  },
  {
    id: '2',
    booking_number: 'BK-002',
    machine_name: 'Rotavator - 7FT',
    booking_period: '2 days (Jul 18-19)',
    amount: 2400,
    commission_rate: 15,
    platform_commission: 360,
    gst: 64.8,
    net_earnings: 1975.2,
    transaction_date: '2024-07-20',
  },
]

const monthlySummary: Summary = {
  period: 'July 2024',
  total_bookings: 12,
  total_earnings: 45250,
  platform_commission: 6787.5,
  gst: 1221.75,
  net_earnings: 37240.75,
  avg_booking_value: 3770.83,
}

export default function OperatorEarnings() {
  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-medium text-muted-foreground mb-1">Total Bookings</p>
          <p className="text-2xl font-bold">{monthlySummary.total_bookings}</p>
          <p className="text-xs text-muted-foreground mt-1">{monthlySummary.period}</p>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-muted-foreground mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-green-700">₹{monthlySummary.total_earnings}</p>
          <p className="text-xs text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Avg: ₹{monthlySummary.avg_booking_value.toFixed(0)}
          </p>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-xs font-medium text-muted-foreground mb-1">Deductions</p>
          <p className="text-2xl font-bold text-yellow-700">
            ₹{(monthlySummary.platform_commission + monthlySummary.gst).toFixed(0)}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Commission + GST</p>
        </Card>

        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-xs font-medium text-muted-foreground mb-1">Net Earnings</p>
          <p className="text-2xl font-bold text-primary">₹{monthlySummary.net_earnings.toFixed(0)}</p>
          <p className="text-xs text-primary/70 mt-1">After all deductions</p>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Earnings Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Gross Earnings</span>
              <span className="font-semibold">₹{monthlySummary.total_earnings}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b text-red-600">
              <span className="text-muted-foreground">Platform Commission (15%)</span>
              <span className="font-semibold">-₹{monthlySummary.platform_commission.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b text-red-600">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-semibold">-₹{monthlySummary.gst.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary/10 px-3 rounded-lg font-bold">
              <span>Net Earnings</span>
              <span className="text-primary">₹{monthlySummary.net_earnings.toFixed(0)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-blue-700">₹{(monthlySummary.net_earnings * 0.8).toFixed(0)}</p>
              <p className="text-xs text-blue-600 mt-1">Ready to withdraw</p>
            </div>

            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download GST Invoice
            </Button>
          </div>
        </div>
      </Card>

      {/* Earnings Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <Badge variant="outline">Last 30 days</Badge>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {mockEarnings.map(earning => (
              <div key={earning.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Booking</p>
                    <p className="font-medium">{earning.booking_number}</p>
                    <p className="text-xs text-muted-foreground">{earning.machine_name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Period</p>
                    <p className="text-sm">{earning.booking_period}</p>
                    <p className="text-xs text-muted-foreground">{earning.transaction_date}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Gross</p>
                    <p className="font-medium">₹{earning.amount}</p>
                    <p className="text-xs text-muted-foreground">Commission: {earning.commission_rate}%</p>
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Net Amount</p>
                    <p className="text-lg font-bold text-primary">₹{earning.net_earnings.toFixed(0)}</p>
                    <Badge variant="secondary" className="mt-1">Completed</Badge>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {mockEarnings.map(earning => (
              <div key={earning.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{earning.booking_number}</p>
                    <p className="text-sm text-muted-foreground">{earning.machine_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₹{earning.net_earnings.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{earning.transaction_date}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <p className="text-center text-muted-foreground py-4">No pending transactions</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
