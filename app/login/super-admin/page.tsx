import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Super Admin Login | Rythu360',
  description: 'Super admin system access'
}

export default function SuperAdminLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Super Admin',
        roleId: 'super-admin',
        accentColor: 'gray',
        gradientFrom: 'from-black',
        gradientTo: 'to-gray-800',
        illustration: '👨‍💻',
        description: 'Full system control and oversight'
      }}
    />
  )
}
