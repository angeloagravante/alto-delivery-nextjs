'use client'

import { useSignUp } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Page() {
  // Check if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  if (!isClerkConfigured) {
    // Fallback for demo mode
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 p-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.svg"
                alt="Alto Delivery Logo"
                width={80}
                height={80}
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Alto Delivery
            </h1>
            <p className="text-gray-600">
              Demo Mode - Clerk authentication not configured
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                To enable user registration, configure your Clerk environment variables.
              </p>
              <div className="mt-6">
                <Link 
                  href="/sign-in"
                  className="bg-[#1E466A] text-white px-6 py-3 rounded-lg hover:bg-[#1E466A]/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <CustomSignUpForm />;
}

function CustomSignUpForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { user, isLoaded: userLoaded } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const router = useRouter();

  // Add CAPTCHA element when component mounts
  useEffect(() => {
    // Create CAPTCHA container if it doesn't exist
    if (!document.getElementById('clerk-captcha')) {
      const captchaDiv = document.createElement('div');
      captchaDiv.id = 'clerk-captcha';
      captchaDiv.style.display = 'none';
      document.body.appendChild(captchaDiv);
    }

    // Cleanup on unmount
    return () => {
      const captchaElement = document.getElementById('clerk-captcha');
      if (captchaElement && captchaElement.parentNode === document.body) {
        document.body.removeChild(captchaElement);
      }
    };
  }, []);

  // Handle existing session case - redirect if user is already signed in
  useEffect(() => {
    if (!(userLoaded && user)) return
    ;(async () => {
      try {
        const res = await fetch('/api/user/role', { cache: 'no-store' })
        const data = await res.json()
        if (data.onboarded) {
          router.push(data.role === 'ADMIN' || data.role === 'OWNER' ? '/dashboard' : '/customer')
        } else {
          router.push('/onboarding/role')
        }
      } catch {
        router.push('/onboarding/role')
      }
    })()
  }, [userLoaded, user, router]);

  // Handle OAuth callback - check if there's a pending sign up
  useEffect(() => {
    if (!isLoaded || !signUp) return;

    // Check if we're coming back from OAuth and there's a pending sign up
    if (signUp.status === 'complete') {
      setActive({ session: signUp.createdSessionId })
        .then(async () => {
          try {
            const res = await fetch('/api/user/role', { cache: 'no-store' })
            const data = await res.json()
            if (data.onboarded) {
              router.push(data.role === 'ADMIN' || data.role === 'OWNER' ? '/dashboard' : '/customer')
            } else {
              router.push('/onboarding/role')
            }
          } catch {
            router.push('/onboarding/role')
          }
        })
        .catch((err) => {
          console.error('Error setting active session:', err);
          setError('Error completing sign up. Please try again.');
        });
    }
  }, [isLoaded, signUp, setActive, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Check if we need to handle CAPTCHA or other verifications
      if (result.status === 'missing_requirements') {
        // Handle missing requirements (like CAPTCHA)
        console.log('Missing requirements:', result.missingFields);
      }

      // Start the verification process
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setShowVerification(true);
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setError(error.errors?.[0]?.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        try {
          const res = await fetch('/api/user/role', { cache: 'no-store' })
          const data = await res.json()
          if (data.onboarded) {
            router.push(data.role === 'ADMIN' || data.role === 'OWNER' ? '/dashboard' : '/customer')
          } else {
            router.push('/onboarding/role')
          }
        } catch {
          router.push('/onboarding/role')
        }
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      setError(error.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (strategy: 'oauth_google' | 'oauth_facebook') => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy,
  redirectUrl: `${window.location.origin}/onboarding/role`,
  redirectUrlComplete: `${window.location.origin}/onboarding/role`,
      });
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string; code?: string }> };
      const errorMessage = error.errors?.[0]?.message || `An error occurred during ${strategy.replace('oauth_', '')} sign up`;
      
      // Handle "session already exists" error
      if (errorMessage.toLowerCase().includes('session') || error.errors?.[0]?.code === 'session_exists') {
        // User is already signed in, redirect to dashboard
        router.push('/dashboard');
        return;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Alto Delivery Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Alto Delivery
          </h1>
          <p className="text-gray-600">
            Create your account to start using our delivery services
          </p>
        </div>
        
        {/* Sign Up Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {!showVerification ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Social Sign Up Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialSignUp('oauth_google')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialSignUp('oauth_facebook')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">or</span>
                </div>
              </div>

              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                  placeholder="Create a password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1E466A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E466A]/90 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          ) : (
            /* Verification Form */
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Verify your email
                </h2>
                <p className="text-gray-600 text-sm">
                  We sent a verification code to {email}
                </p>
              </div>

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors text-center"
                  placeholder="Enter 6-digit code"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1E466A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E466A]/90 focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify email'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowVerification(false)}
                  className="text-[#1E466A] hover:text-[#1E466A]/80 font-medium text-sm transition-colors"
                >
                  Back to sign up
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Sign In Link */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Already have an account?{' '}
            <Link 
              href="/sign-in" 
              className="text-[#1E466A] hover:text-[#1E466A]/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


