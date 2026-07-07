import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Government Officer Login | Rythu360',
  description: 'Login as a government officer'
}

export default function GovernmentLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Government Officer',
        roleId: 'government',
        accentColor: 'slate',
        gradientFrom: 'from-slate-600',
        gradientTo: 'to-gray-700',
        illustration: '👮',
        description: 'Manage government schemes and programs'
      }}
    />
  )
}
