import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Admin Login | Rythu360',
  description: 'Admin platform access'
}

export default function AdminLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Admin',
        roleId: 'admin',
        accentColor: 'red',
        gradientFrom: 'from-red-600',
        gradientTo: 'to-pink-700',
        illustration: '👑',
        description: 'Platform administration and management'
      }}
    />
  )
}
