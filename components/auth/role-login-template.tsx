'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

type RoleLoginConfig = {
  roleTitle: string
  roleId: string
  accentColor: string
  gradientFrom: string
  gradientTo: string
  illustration: string
  description: string
}

export function RoleLoginTemplate({ config }: { config: RoleLoginConfig }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'otp'>('email')
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Authentication logic will be integrated with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Redirect to dashboard based on role
      router.push(`/${config.roleId}/dashboard`)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br ${config.gradientFrom}/10 to-transparent rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br ${config.gradientTo}/10 to-transparent rounded-full blur-3xl`} />
      </div>

      <div className="relative z-10">
        {/* Back button */}
        <div className="pt-6 px-4 md:px-8 animate-fade-in">
          <button
            onClick={() => router.push('/roles')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roles
          </button>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md px-4">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl animate-fade-in">
              {/* Role header */}
              <div className="text-center mb-8">
                <div className={`text-7xl mb-4 inline-block`}>
                  {config.illustration}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {config.roleTitle} Login
                </h1>
                <p className="text-gray-300 text-sm">
                  {config.description}
                </p>
              </div>

              {/* Brand */}
              <div className="text-center mb-8">
                <p className="text-gray-400 text-xs">Powered by</p>
                <p className={`bg-clip-text text-transparent bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} font-bold text-lg`}>
                  Rythu360
                </p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Authentication method tabs */}
                <div className="flex gap-2 bg-white/5 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                          loginMethod === 'email'
                            ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white`
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('phone')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                          loginMethod === 'phone'
                            ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white`
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        Phone
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('otp')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                          loginMethod === 'otp'
                            ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white`
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        OTP
                      </button>
                </div>

                {/* Email/Phone input */}
                {loginMethod === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                )}

                {loginMethod === 'phone' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                )}

                {loginMethod === 'otp' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone for OTP
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                )}

                {/* Password field (for email login) */}
                {loginMethod === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember me & Forgot password */}
                {loginMethod === 'email' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-500"
                      />
                      <span className="text-sm text-gray-400">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {/* Login button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    isLoading
                      ? 'opacity-75 cursor-not-allowed'
                      : `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} hover:shadow-lg hover:shadow-${config.accentColor}/50`
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-gray-400">or continue with</span>
                  </div>
                </div>

                {/* Social login */}
                <button
                  type="button"
                  className="w-full py-2 px-4 rounded-lg border border-white/20 hover:border-white/40 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-white/5"
                >
                  <span className="text-lg">🔐</span>
                  <span className="text-sm font-medium">Google</span>
                </button>
              </form>

              {/* Register link */}
              <div className="mt-8 text-center border-t border-white/10 pt-8">
                <p className="text-gray-400 text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    href={`/register/${config.roleId}`}
                    className={`bg-clip-text text-transparent bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} font-semibold hover:underline`}
                  >
                    Register here
                  </Link>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-gray-500">
                <Link href="/terms" className="hover:text-gray-400">
                  Terms
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-gray-400">
                  Privacy
                </Link>
                <span>•</span>
                <button className="hover:text-gray-400">
                  Language
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
