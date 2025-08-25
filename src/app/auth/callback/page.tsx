'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn, useSignUp, useUser } from '@clerk/nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user, isLoaded: userLoaded } = useUser()
  const { signIn, setActive: setActiveFromSignIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, setActive: setActiveFromSignUp, isLoaded: signUpLoaded } = useSignUp()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const goByRole = async () => {
      try {
        const res = await fetch('/api/user/role', { cache: 'no-store' })
        const data = await res.json()
        if (data.role === 'ADMIN') {
          router.replace('/admin')
        } else if (data.onboarded) {
          router.replace(data.role === 'OWNER' ? '/dashboard' : '/customer')
        } else {
          router.replace('/onboarding/role')
        }
      } catch (e) {
        console.error('Callback role check failed:', e)
        router.replace('/onboarding/role')
      }
    }

    const finalizeAndRoute = async () => {
      // If already signed in, route immediately
      if (userLoaded && user) {
        await goByRole()
        return
      }

      // Try pending sign-in
      if (signInLoaded && signIn?.status === 'complete') {
        const sid = signIn.createdSessionId
        if (sid) {
          try {
            await setActiveFromSignIn({ session: sid })
          } catch (e: unknown) {
            const err = e as { errors?: Array<{ message?: string; code?: string }> }
            const msg = err?.errors?.[0]?.message?.toLowerCase?.() || ''
            const code = err?.errors?.[0]?.code
            const isSessionExists = code === 'session_exists' || msg.includes('session')
            if (!isSessionExists) {
              setError('Unable to finalize sign in')
              return
            }
          }
        }
        await goByRole()
        return
      }

      // Try pending sign-up
      if (signUpLoaded && signUp?.status === 'complete') {
        const sid = signUp.createdSessionId
        if (sid) {
          try {
            await setActiveFromSignUp({ session: sid })
          } catch (e: unknown) {
            const err = e as { errors?: Array<{ message?: string; code?: string }> }
            const msg = err?.errors?.[0]?.message?.toLowerCase?.() || ''
            const code = err?.errors?.[0]?.code
            const isSessionExists = code === 'session_exists' || msg.includes('session')
            if (!isSessionExists) {
              setError('Unable to finalize sign up')
              return
            }
          }
        }
        await goByRole()
        return
      }

      // If nothing to finalize yet but Clerk may attach a session, try role check anyway
      if (signInLoaded || signUpLoaded) {
        await goByRole()
      }
    }

    finalizeAndRoute()
  }, [router, user, userLoaded, signIn, signInLoaded, signUp, signUpLoaded, setActiveFromSignIn, setActiveFromSignUp])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1E466A] border-t-transparent" />
        <p className="text-gray-700">Completing sign-in…</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
