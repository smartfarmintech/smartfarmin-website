import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Agriculture Expert Login | Rythu360',
  description: 'Login as an agriculture expert'
}

export default function AgriExpertLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Agriculture Expert',
        roleId: 'agri-expert',
        accentColor: 'teal',
        gradientFrom: 'from-teal-500',
        gradientTo: 'to-cyan-600',
        illustration: '👨‍🎓',
        description: 'Provide farming expertise and consultation'
      }}
    />
  )
}
