import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Farmer Login | Rythu360',
  description: 'Login as a farmer to manage your crops and equipment rental'
}

export default function FarmerLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Farmer',
        roleId: 'farmer',
        accentColor: 'emerald',
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-green-600',
        illustration: '👨‍🌾',
        description: 'Access your farming dashboard and manage operations'
      }}
    />
  )
}
