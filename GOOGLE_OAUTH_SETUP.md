# Google OAuth Setup for Clerk

## Current Issue
Google Sign-In is not working because Google OAuth is not properly configured in your Clerk Dashboard.

## Step-by-Step Setup Guide

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create or select a project** for your Alto Delivery app
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" 
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add these **Authorized redirect URIs**:
     ```
     https://asserting-moray-77.clerk.accounts.dev/v1/oauth_callback
     http://localhost:3000/sign-in
     ```
   - Save and copy your **Client ID** and **Client Secret**

### 2. Clerk Dashboard Configuration

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Navigate to your project**: "asserting-moray-77" 
3. **Go to "User & Authentication" > "Social Connections"**
4. **Enable Google**:
   - Click on Google provider
   - Enter your Google OAuth **Client ID**
   - Enter your Google OAuth **Client Secret**
   - Save settings

### 3. Environment Variables Update

Your `.env.local` has been updated with the required Clerk URLs. You may also need to add:

```bash
# If you set up webhooks in Clerk Dashboard
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Testing

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/sign-in

3. Click "Continue with Google" - it should now redirect to Google's OAuth flow

### 5. Common Issues & Solutions

**Issue**: "OAuth client not found" or similar error
- **Solution**: Make sure the redirect URI in Google Cloud Console exactly matches what Clerk expects

**Issue**: "This app isn't verified" warning from Google
- **Solution**: This is normal for development. Click "Advanced" > "Go to [your app] (unsafe)" for testing

**Issue**: Still getting errors after setup
- **Solution**: Check browser developer console for specific error messages

### 6. Production Setup

For production deployment, you'll also need to:

1. **Add production redirect URI** to Google Cloud Console:
   ```
   https://your-production-domain.com/sign-in
   ```

2. **Update environment variables** in your production environment with the same values

3. **Verify domain ownership** in Google Cloud Console for production use

## Verification Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled  
- [ ] OAuth 2.0 Client ID created with correct redirect URIs
- [ ] Google OAuth enabled in Clerk Dashboard
- [ ] Client ID and Secret added to Clerk
- [ ] Environment variables updated
- [ ] Development server restarted
- [ ] Google sign-in button tested

## Support

If you continue to have issues:
- Check Clerk Dashboard logs for authentication errors
- Check browser developer console for JavaScript errors
- Verify all redirect URIs match exactly between Google and Clerk
