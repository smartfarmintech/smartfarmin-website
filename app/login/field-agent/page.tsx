import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Field Agent Login | Rythu360',
  description: 'Login as a field agent to conduct farm visits'
}

export default function FieldAgentLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Field Agent',
        roleId: 'field-agent',
        accentColor: 'indigo',
        gradientFrom: 'from-indigo-500',
        gradientTo: 'to-blue-600',
        illustration: '🕵️',
        description: 'Conduct farm visits and verification'
      }}
    />
  )
}
