# Store Management System

This document describes the store management system implemented in the Alto Delivery Next.js application.

## Features

### Store Management
- **Maximum 3 stores per user**: Users can create up to 3 stores
- **Store information**: Each store has a name, description, and logo
- **Logo upload**: Users can upload custom logos for their stores using UploadThing
- **CRUD operations**: Create, read, update, and delete stores

### Store Menu in Header
- **Store switcher**: Dropdown menu in the dashboard header to switch between stores
- **Visual indicators**: Shows store logos and names
- **Current store display**: Always shows the currently selected store

## Database Schema

### Store Model
```prisma
model Store {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  logoUrl     String?
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  products    Product[]
}
```

### Updated Product Model
```prisma
model Product {
  // ... existing fields
  storeId     String   @db.ObjectId
  store       Store    @relation(fields: [storeId], references: [id])
}
```

## API Endpoints

### GET /api/stores
- Fetches all stores for the authenticated user
- Returns array of store objects

### POST /api/stores
- Creates a new store
- Validates user can only have maximum 3 stores
- Requires store name
- Optional: description and logoUrl

### PUT /api/stores/[id]
- Updates an existing store
- Validates store ownership
- Can update name, description, and logoUrl

### DELETE /api/stores/[id]
- Deletes a store and all associated products
- Validates store ownership

### POST /api/upload
- Handles file uploads via UploadThing
- Supports store logo uploads (max 4MB, images only)

## Components

### StoreMenu
- Located in dashboard header
- Shows current store with logo/name
- Dropdown to switch between stores
- Handles store selection

### StoreManagement
- Main store management page (/dashboard/stores)
- Lists all user stores
- Add/edit/delete store functionality
- Logo upload integration

### DashboardWrapper
- Wraps dashboard layout
- Manages store state
- Passes store change handlers to header

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── stores/
│   │       ├── route.ts          # Main stores API
│   │       └── [id]/route.ts     # Individual store API
│   │   └── upload/
│   │       └── route.ts          # File upload API
│   └── dashboard/
│       └── stores/
│           └── page.tsx          # Stores management page
├── components/
│   └── dashboard/
│       ├── StoreMenu.tsx         # Store switcher in header
│       ├── StoreManagement.tsx   # Store management interface
│       └── DashboardWrapper.tsx  # Dashboard layout wrapper
├── lib/
│   └── uploadthing.ts            # UploadThing configuration
└── types/
    └── store.ts                  # Store type definitions
```

## Usage

### Adding a Store
1. Navigate to `/dashboard/stores`
2. Click "Add Store" button
3. Fill in store name and description
4. Upload a logo (optional)
5. Click "Create Store"

### Switching Stores
1. Click on the store menu in the dashboard header
2. Select desired store from dropdown
3. The selected store will be displayed and used for operations

### Managing Stores
- Edit store details by clicking the edit button
- Delete stores by clicking the delete button
- View store information and creation date

## Dependencies

- **@uploadthing/react**: File upload components
- **uploadthing**: File upload service
- **@clerk/nextjs**: Authentication
- **@prisma/client**: Database operations

## Environment Variables

Ensure these environment variables are set:
- `DATABASE_URL`: MongoDB connection string
- `UPLOADTHING_SECRET`: UploadThing secret key
- `UPLOADTHING_APP_ID`: UploadThing app ID

## Future Enhancements

- Store-specific product management
- Store analytics and reporting
- Multi-store order management
- Store templates and themes
- Store sharing and collaboration
