import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "Alto Delivery",
  description: "Premium delivery service platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  if (isClerkConfigured) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className="antialiased">
            {children}
          </body>
        </html>
      </ClerkProvider>
    );
  }

  // Fallback for demo/development without Clerk
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
