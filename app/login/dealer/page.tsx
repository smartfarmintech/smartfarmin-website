import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Fertilizer Dealer Login | Rythu360',
  description: 'Login as a fertilizer dealer'
}

export default function DealerLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Fertilizer Dealer',
        roleId: 'dealer',
        accentColor: 'amber',
        gradientFrom: 'from-amber-500',
        gradientTo: 'to-yellow-600',
        illustration: '🏪',
        description: 'Manage fertilizer inventory and sales'
      }}
    />
  )
}
