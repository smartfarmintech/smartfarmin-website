import { RoleLoginTemplate } from '@/components/auth/role-login-template'

export const metadata = {
  title: 'Crop Buyer Login | Rythu360',
  description: 'Login as a crop buyer'
}

export default function CropBuyerLoginPage() {
  return (
    <RoleLoginTemplate
      config={{
        roleTitle: 'Crop Buyer',
        roleId: 'crop-buyer',
        accentColor: 'violet',
        gradientFrom: 'from-violet-500',
        gradientTo: 'to-purple-600',
        illustration: '👨‍🏫',
        description: 'Purchase agricultural products'
      }}
    />
  )
}
