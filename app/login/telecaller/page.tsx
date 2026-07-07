import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Telecaller Login | Rythu360',
  description: 'Login as a telecaller to manage leads'
}

export default function TelecallerLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Telecaller',
        roleId: 'telecaller',
        accentColor: 'orange',
        gradientFrom: 'from-orange-500',
        gradientTo: 'to-red-600',
        illustration: '👨‍💼',
        description: 'Manage leads and farmer communications'
      }}
    />
  )
}
