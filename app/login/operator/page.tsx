import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Machinery Operator Login | Rythu360',
  description: 'Login as a machinery operator to manage bookings'
}

export default function OperatorLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Machinery Operator',
        roleId: 'operator',
        accentColor: 'cyan',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-cyan-600',
        illustration: '👨‍🔧',
        description: 'Manage your machinery and service requests'
      }}
    />
  )
}
