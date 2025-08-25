'use client'

import { useSignUp } from '@clerk/nextjs'
import { useState } from 'react'

export default function DebugSignUp() {
  const { signUp, isLoaded } = useSignUp()
  const [debugInfo, setDebugInfo] = useState<string>('')

  const testSignUp = async () => {
    if (!isLoaded || !signUp) {
      setDebugInfo('Clerk not loaded yet')
      return
    }

    try {
      const result = await signUp.create({
        emailAddress: 'test@example.com',
        password: 'password123',
      })
      
      setDebugInfo(`Success: ${JSON.stringify(result, null, 2)}`)
    } catch (err) {
      setDebugInfo(`Error: ${JSON.stringify(err, null, 2)}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Sign-Up</h1>
      <button
        onClick={testSignUp}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test Sign-Up
      </button>
      
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {debugInfo || 'Click the button to test sign-up'}
      </pre>
    </div>
  )
}
