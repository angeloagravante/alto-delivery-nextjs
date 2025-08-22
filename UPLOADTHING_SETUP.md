# UploadThing Setup Guide

## Current Issue
The application is experiencing 400 Bad Request errors when trying to load images from UploadThing URLs (`utfs.io` domain).

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Optional: Custom UploadThing URL (usually not needed)
# NEXT_PUBLIC_UPLOADTHING_URL=https://uploadthing.com
```

## How to Get UploadThing Credentials

1. Go to [https://uploadthing.com/dashboard](https://uploadthing.com/dashboard)
2. Sign up or log in to your account
3. Create a new project or select an existing one
4. Go to the "API Keys" section
5. Copy your `API Key` (this is your `UPLOADTHING_APP_ID`)
6. Copy your `API Secret` (this is your `UPLOADTHING_SECRET`)

## Verification Steps

1. After setting the environment variables, restart your development server
2. Check the browser console for the "UPLOADTHING CONFIGURATION CHECK" logs
3. Verify that both `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` show as `true`
4. Try uploading a new image to see if the 400 errors are resolved

## Common Issues

- **400 Bad Request**: Usually indicates missing or incorrect environment variables
- **Authentication Failed**: Check that `UPLOADTHING_SECRET` is set correctly
- **Upload Fails**: Verify `UPLOADTHING_APP_ID` is correct

## Testing

Use the "Test Logo Display" button in the store management form to verify that external images work correctly, then try uploading a new image to test the UploadThing integration.
