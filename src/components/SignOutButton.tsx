'use client'

import { useClerk } from '@clerk/nextjs'

export default function SignOutButton() {
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' })
  }

  return (
    <button 
      onClick={handleSignOut}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
      Sign Out
    </button>
  )
}
