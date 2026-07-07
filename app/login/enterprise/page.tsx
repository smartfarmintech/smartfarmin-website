import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Enterprise Customer Login | Rythu360',
  description: 'Login as an enterprise customer'
}

export default function EnterpriseLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Enterprise Customer',
        roleId: 'enterprise',
        accentColor: 'slate',
        gradientFrom: 'from-slate-700',
        gradientTo: 'to-slate-900',
        illustration: '🏢',
        description: 'Corporate account for bulk operations'
      }}
    />
  )
}
