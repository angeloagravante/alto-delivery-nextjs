
# Alto Delivery - Next.js Delivery Platform

A modern delivery service platform built with Next.js, TypeScript, and a comprehensive tech stack.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Clerk
- **File Storage**: UploadThing
- **Styling**: Tailwind CSS
- **Main Color**: #1E466A

## 🏗️ Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── sign-in/           # Authentication page
│   ├── layout.tsx         # Root layout with Clerk provider
│   └── page.tsx           # Homepage with landing content
├── middleware.ts          # Clerk authentication middleware
└── globals.css           # Global styles and color scheme
```

## 🎨 Design Features

- **Primary Color Scheme**: #1E466A (deep blue)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional interface
- **Authentication Flow**: Integrated sign-in/sign-up pages
- **Dashboard**: Analytics cards and quick action buttons

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="mongodb+srv://root:randompassword@cluster0.ab1cd.mongodb.net/mydb?retryWrites=true&w=majority"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXNzdXJpbmctbW9yYXktNzcuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_JqSYMJgDLYmuWsb9VJbz7Xyjnb2Ds5fs3VIL66S7qk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy the `.env` file with your credentials

3. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📱 Features

### Authentication
- Sign-in and sign-up pages with Clerk integration
- Protected routes with middleware
- User session management

### Dashboard
- Overview cards for orders and revenue
- Quick action buttons
- Responsive layout

### Landing Page
- Professional hero section
- Feature highlights with icons
- Call-to-action buttons

## 🔐 Security

- Route protection with Clerk middleware
- Environment variable configuration
- Secure authentication flow

## 📦 Database Schema

The project uses Prisma with MongoDB for data management:

- **User**: Clerk integration with user profiles
- **Order**: Order management with status tracking
- **OrderItem**: Individual items within orders

## 🎯 Next Steps

1. **Enhanced Authentication**: Complete Clerk integration
2. **Order Management**: Full CRUD operations for orders
3. **File Upload**: Integration with UploadThing for documents/images
4. **Real-time Updates**: WebSocket integration for live order tracking
5. **Payment Integration**: Stripe or similar payment processor
6. **Admin Panel**: Management interface for administrators

## Learn More About Next.js


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
