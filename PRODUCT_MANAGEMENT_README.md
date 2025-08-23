
# Product Management System

## Overview

The Product Management System provides a comprehensive solution for managing products in the Alto Delivery platform. Users can add, edit, delete, and organize products by category, with full integration to the store selector system.

## Features

### 🏪 Store-Based Product Management
- Products are automatically filtered based on the selected store
- Store selector integration ensures users only see products from their current store
- Seamless switching between stores updates the product list

### 📱 Product Menu Interface
- **Product Menu Page**: Main interface with submenu navigation (`/dashboard/products`)
- **Category-Based Organization**: Products are grouped and filtered by category
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎯 Dedicated Submenu Pages

#### 1. Add Product (`/dashboard/products/add`)
- **Full Content Area**: Uses the complete dashboard content area for better UX
- **Comprehensive Form**: Organized into logical sections (Basic Info, Pricing & Inventory, Images)
- **Multiple Image Upload**: Support for up to 10 product images with drag & drop
- **Advanced Image Management**: 
  - Drag & drop interface with visual feedback
  - Multiple image support (JPEG, PNG, WebP, GIF)
  - Image preview grid with main image indicator
  - Upload progress tracking
  - Image removal and reordering
- **Form Validation**: Comprehensive validation with error handling
- **Auto-redirect**: Automatically redirects to manage page after creation
- **Store Context**: Shows current store name and context
- **Clean Interface**: No navigation buttons - uses sidebar for navigation

#### 2. Manage Products (`/dashboard/products/view`)
- **Product Overview**: Statistics and summary information
- **Category Filtering**: Filter products by specific categories
- **Grid/List Views**: Toggle between different display modes
- **Individual Actions**: Edit and delete individual products
- **Clean Interface**: No navigation buttons - uses sidebar for navigation

#### 3. Bulk Actions (`/dashboard/products/manage`)
- **Bulk Operations**: Perform operations on multiple products
- **Selection Interface**: Checkbox-based product selection
- **Bulk Updates**: Update stock, category, or delete multiple products
- **Instructions Guide**: Clear guidance on bulk operations
- **Safety Confirmations**: Confirmation dialogs for destructive actions
- **Clean Interface**: No navigation buttons - uses sidebar for navigation

### ✨ Core Functionality

#### Add Products
- **Full-Page Form**: Comprehensive form using the entire content area
- **Multiple Image Upload**: Advanced image management system
  - **UploadThing Integration**: Professional file hosting service
  - **Drag & Drop**: Intuitive image upload interface
  - **Multiple Formats**: Support for JPEG, PNG, WebP, GIF
  - **File Size Limits**: Up to 8MB per image
  - **Image Count**: Up to 10 images per product
  - **Main Image**: First image automatically becomes the main product image
  - **Visual Preview**: Grid layout showing all uploaded images
  - **Progress Tracking**: Real-time upload progress indicators
- **Extended Categories**: 20+ predefined categories including:
  - Coffee & Beverages
  - Food & Meals
  - Clothing & Fashion
  - Fruits & Vegetables
  - Meat & Poultry
  - Seafood
  - Grains & Cereals
  - Snacks & Treats
  - Condiments & Sauces
  - Dairy & Eggs
  - Bakery & Pastries
  - Frozen Foods
  - Canned Goods
  - Personal Care
  - Household Items
  - Electronics
  - Books & Stationery
  - Sports & Fitness
  - Toys & Games
  - Other

#### Manage Products
- **Edit Product Modal**: Update product details inline with image management
- **Delete Products**: Remove products with confirmation
- **Stock Management**: Visual indicators for stock levels
- **Multiple Images**: Support for editing multiple product images
- **Image URLs**: Manual image URL management in edit mode

#### Product Organization
- **Category Filtering**: Filter products by specific categories
- **Grid/List Views**: Toggle between different display modes
- **Sorting Options**: Sort by name, price, stock, or category
- **Search & Filter**: Find products quickly

### 📊 Product Overview Dashboard
- **Total Products**: Count of all products in the store
- **Inventory Value**: Total monetary value of all products
- **Low Stock Alerts**: Products with stock ≤ 10
- **Out of Stock**: Products with zero stock
- **Category Distribution**: Overview of product categories

### 🚀 Quick Actions & Bulk Operations
- **Bulk Selection**: Select multiple products for batch operations
- **Bulk Update Stock**: Update stock levels for multiple products
- **Bulk Update Category**: Change categories for multiple products
- **Bulk Delete**: Remove multiple products at once

## Navigation Structure

### Sidebar Navigation
```
Products (with dropdown)
├── Add Product → /dashboard/products/add
├── Manage Products → /dashboard/products/view
└── Bulk Actions → /dashboard/products/manage
```

### Page Flow
1. **Main Products Page** (`/dashboard/products`) → Redirects to Manage Products
2. **Add Product Page** (`/dashboard/products/add`) → Dedicated product creation
3. **Manage Products Page** (`/dashboard/products/view`) → Main product management
4. **Bulk Actions Page** (`/dashboard/products/manage`) → Bulk operations

### Cross-Navigation
- Each page is focused on a specific task without redundant navigation buttons
- Users navigate between pages using the sidebar dropdown menu
- Clean, distraction-free interface on each page
- Consistent navigation pattern using the main sidebar

## Technical Implementation

### Components

#### Core Components
- `ProductManagement`: Main product management interface with grid/list views
- `ProductOverview`: Statistics and summary information
- `ProductQuickActions`: Bulk operations and quick actions
- `ProductImageUpload`: Advanced multiple image upload component
- `EditProductModal`: Product editing interface with image management
- `ProductList`: Legacy component (maintained for compatibility)

#### New Components
- `ProductImageUpload`: 
  - Drag & drop interface using react-dropzone
  - UploadThing integration for professional file hosting
  - Multiple image support with visual preview
  - Upload progress tracking
  - Image management (add, remove, reorder)
  - Main image indicator
  - File type and size validation

#### Page Components
- `AddProductPage`: Redesigned full-page form interface
- `ManageProductsPage`: Main product management interface
- `BulkActionsPage`: Bulk operations interface

#### Enhanced Features
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Table View**: Alternative list view for detailed information
- **Sorting & Filtering**: Client-side sorting with visual indicators
- **Real-time Updates**: Immediate UI updates after operations
- **Professional Image Upload**: Enterprise-grade file hosting and management

### Data Flow

1. **Store Selection**: User selects a store from the header dropdown
2. **Product Fetching**: Products are fetched from `/api/products?storeId={id}`
3. **Category Filtering**: Products are filtered by selected category
4. **Display**: Products are organized and displayed with management options
5. **Operations**: CRUD operations update both local state and database
6. **Image Management**: Images are uploaded via UploadThing and stored as URLs

### API Integration

#### Endpoints Used
- `GET /api/products?storeId={id}`: Fetch products for a store
- `POST /api/products`: Create new product with images array
- `PUT /api/products/{id}`: Update existing product with images array
- `DELETE /api/products/{id}`: Delete product

#### UploadThing Integration
- **Product Images Endpoint**: `/api/uploadthing/core.ts`
- **File Types**: JPEG, PNG, WebP, GIF
- **File Size**: Up to 8MB per image
- **Max Files**: 10 images per product
- **Authentication**: Clerk-based user authentication
- **Security**: User ownership verification

#### Authentication
- All API calls require Clerk authentication
- Store ownership verification ensures data security
- User can only access products from their own stores
- Upload authentication via Clerk middleware

### State Management

#### Local State
- `products`: Array of current products
- `selectedCategory`: Currently selected category filter
- `loading`: Loading state for API calls
- `message`: Success/error message display
- `images`: Array of product image URLs
- `uploadProgress`: Real-time upload progress tracking

#### Context Integration
- Uses `DashboardWrapper` context for store selection
- Automatic product refresh when store changes
- Consistent state across dashboard components

## User Experience

### Navigation
- **Sidebar Link**: Products accessible from main navigation with dropdown
- **Breadcrumb**: Clear indication of current location
- **Store Context**: Always shows current store selection
- **Cross-Page Navigation**: Easy switching between product tasks

### Visual Design
- **Consistent Styling**: Matches Alto Delivery brand colors
- **Status Indicators**: Color-coded stock levels and alerts
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive Layout**: Optimized for all device sizes
- **Professional Upload**: Enterprise-grade image upload interface

### Workflow
1. **Select Store**: Choose store from header dropdown
2. **Choose Task**: Use sidebar dropdown to navigate to specific product management task
3. **Perform Actions**: Add, edit, or manage products on focused pages
4. **Image Management**: Upload and manage multiple product images
5. **Bulk Operations**: Use bulk actions for multiple products
6. **Navigate Between**: Use sidebar to switch between different product pages

## Usage Examples

### Adding a New Product with Images
1. Navigate to `/dashboard/products/add`
2. Fill in basic information (name, description, category)
3. Set pricing and inventory details
4. **Upload Images**: 
   - Drag & drop multiple images or click to select
   - Images automatically upload with progress tracking
   - First image becomes the main product image
   - Reorder images by dragging
   - Remove unwanted images
5. Submit the form
6. Automatically redirected to manage products page

### Managing Product Images
1. **Upload Interface**: 
   - Drag & drop area with visual feedback
   - File type and size validation
   - Upload progress indicators
   - Image preview grid
2. **Image Management**:
   - Hover over images to see remove button
   - Main image indicator
   - Image count display
   - Maximum image limit enforcement

### Managing Existing Products
1. Navigate to `/dashboard/products/view`
2. Use category filters to find specific products
3. Click "Edit" on any product card
4. Update information including image URLs
5. Add/remove image URLs manually
6. Save changes

### Bulk Operations
1. Navigate to `/dashboard/products/manage`
2. Select multiple products using checkboxes
3. Click "Bulk Actions" button
4. Choose operation (update stock, category, or delete)
5. Confirm action

### Navigation Between Pages
- Use sidebar dropdown to access different product pages
- Clean interface without redundant navigation buttons
- Consistent navigation pattern using the main sidebar
- Focused experience on each dedicated page

## Future Enhancements

### Planned Features
- **Product Import/Export**: CSV/Excel file support
- **Advanced Search**: Full-text search with filters
- **Product Variants**: Support for different sizes, colors, etc.
- **Inventory Tracking**: Stock movement history
- **Product Analytics**: Sales and performance metrics
- **Advanced Image Management**: 
  - Image cropping and editing
  - Automatic image optimization
  - Image alt text management
  - Image SEO optimization
- **Product Templates**: Predefined product structures

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Service worker for offline functionality
- **Performance**: Virtual scrolling for large product lists
- **Caching**: Redis integration for improved performance
- **Image CDN**: Global image delivery optimization
- **Image Compression**: Automatic image optimization

## Troubleshooting

### Common Issues
- **No Products Displayed**: Check if store is selected
- **Category Filter Not Working**: Ensure products have valid categories
- **Bulk Operations Fail**: Verify all selected products exist
- **Image Upload Fails**: Check file size and type restrictions
- **Navigation Issues**: Verify sidebar dropdown is working

### Image Upload Issues
- **File Size**: Ensure images are under 8MB
- **File Type**: Use JPEG, PNG, WebP, or GIF formats
- **Image Count**: Maximum 10 images per product
- **Upload Progress**: Check network connection and file size
- **Authentication**: Ensure user is properly logged in

### Performance Tips
- Use category filters to reduce displayed products
- Switch to list view for large product catalogs
- Close modals when not in use
- Refresh page if experiencing lag
- Use dedicated pages for specific tasks
- Optimize image sizes before upload

## Contributing

When contributing to the product management system:

1. **Follow Component Structure**: Maintain existing component hierarchy
2. **State Management**: Use existing context and state patterns
3. **Styling**: Follow Tailwind CSS conventions
4. **Testing**: Ensure TypeScript compilation passes
5. **Documentation**: Update this README for new features
6. **Navigation**: Maintain consistent navigation patterns
7. **Image Handling**: Follow established image upload patterns

## Support

For technical support or feature requests:
- Check existing issues in the repository
- Review API documentation
- Test with different store configurations
- Verify Clerk authentication setup
- Test navigation between product pages
- Verify UploadThing configuration
- Check image upload requirements and limits
