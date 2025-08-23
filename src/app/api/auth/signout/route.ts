import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/')
  }
  
  // For Clerk, we redirect to Clerk's sign-out URL
  redirect('/api/auth/clerk/signout')
}
