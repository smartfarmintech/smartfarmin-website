import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Drone Operator Login | Rythu360',
  description: 'Login as a drone operator to provide aerial services'
}

export default function DroneLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Drone Operator',
        roleId: 'drone',
        accentColor: 'purple',
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-pink-600',
        illustration: '🚁',
        description: 'Manage drone services and bookings'
      }}
    />
  )
}
