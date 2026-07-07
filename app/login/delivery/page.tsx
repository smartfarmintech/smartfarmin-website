import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Delivery Partner Login | Rythu360',
  description: 'Login as a delivery partner'
}

export default function DeliveryLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Delivery Partner',
        roleId: 'delivery',
        accentColor: 'red',
        gradientFrom: 'from-red-500',
        gradientTo: 'to-orange-600',
        illustration: '🚚',
        description: 'Deliver products to customers'
      }}
    />
  )
}
