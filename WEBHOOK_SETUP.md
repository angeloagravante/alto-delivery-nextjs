# Clerk Webhook Setup Guide

## Problem
You're getting a "User not found" error when trying to create stores because users are only created in Clerk's authentication system, but not automatically in your Prisma database.

## Solution
I've implemented two solutions:

### 1. Immediate Fix (Already Implemented)
The stores API now automatically creates users in the database if they don't exist. This will work immediately without any additional setup.

### 2. Proper Webhook Setup (Recommended)
Set up a Clerk webhook to automatically create/update/delete users in your database when they sign up, update their profile, or delete their account.

## Webhook Setup Steps

### Step 1: Get Your Webhook Secret
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** in the sidebar
3. Click **Add Endpoint**
4. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/clerk`
5. Select these events:
   - `user.created`
   - `user.updated` 
   - `user.deleted`
6. Copy the signing secret

### Step 2: Add Environment Variable
Add this to your `.env.local` file:
```
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 3: Deploy
Deploy your application so the webhook endpoint is accessible.

## How It Works

1. **User signs up** → Clerk sends `user.created` webhook → User created in your database
2. **User updates profile** → Clerk sends `user.updated` webhook → User updated in your database  
3. **User deletes account** → Clerk sends `user.deleted` webhook → User deleted from your database

## Fallback Mechanism
If the webhook isn't configured, the stores API will automatically create users with temporary information when they first try to create a store. The webhook will update this information later.

## Testing
1. Sign up a new user through Clerk
2. Try to create a store
3. Check your database - the user should now exist
4. Check your webhook logs for successful user creation

## Troubleshooting
- Make sure your webhook endpoint is publicly accessible
- Verify the `CLERK_WEBHOOK_SECRET` environment variable is set correctly
- Check your application logs for webhook errors
- Ensure your database is running and accessible
