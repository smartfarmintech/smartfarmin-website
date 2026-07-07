import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Organic Store Login | Rythu360',
  description: 'Login as an organic store seller'
}

export default function OrganicStoreLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Organic Store Seller',
        roleId: 'organic-store',
        accentColor: 'green',
        gradientFrom: 'from-green-500',
        gradientTo: 'to-emerald-600',
        illustration: '🏬',
        description: 'Sell certified organic products'
      }}
    />
  )
}
