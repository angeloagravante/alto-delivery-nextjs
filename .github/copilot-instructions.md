# Alto Delivery Next.js Application

Alto Delivery is a modern web application built with Next.js 15.4.6, TypeScript, Tailwind CSS 4, and ESLint. This application uses the App Router pattern and includes a production-ready build system with hot reloading in development.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

Policy: Before coding, CREATE an implementation plan and get approval.

### Initial Setup
- Node.js v20.19.4 and npm v10.8.2 are required (already available in this environment)
- Dependencies are automatically installed during project initialization
- **CRITICAL**: This project was initialized from scratch - Google Fonts were removed from layout.tsx due to network restrictions in build environment

### Build and Development Commands
- Install dependencies: `npm install` -- takes 30-40 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
- Build for production: `npm run build` -- takes 15-20 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Start development server: `npm run dev` -- starts in 1-2 seconds with Turbopack. NEVER CANCEL. Set timeout to 60+ seconds.
- Start production server: `npm start` -- starts in 1-2 seconds after build. NEVER CANCEL. Set timeout to 60+ seconds.
- Lint code: `npm run lint` -- takes 2-3 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

### Development Workflow
0. Prepare an implementation plan and get approval before coding
1. **ALWAYS** run `npm install` first if node_modules doesn't exist
2. For development: `npm run dev` (uses Turbopack for fast builds)
3. For production testing: `npm run build && npm start`
4. **ALWAYS** run `npm run lint` before committing changes

## Validation

### Manual Testing Requirements
- **ALWAYS** test the application manually after making changes
- Development server: Navigate to http://localhost:3000 and verify the Next.js welcome page loads
- Production server: Run `npm run build && npm start`, then verify http://localhost:3000 works identically
- **CRITICAL**: Test user interactions - click links, verify page navigation works
- Take screenshots when making UI changes to document the impact

### End-to-End Testing Scenarios
- Load the homepage at http://localhost:3000
- Verify the Next.js logo and welcome text display correctly
- Click "Read our docs" link to test navigation (external links may fail due to network restrictions - this is expected)
- Verify footer links are clickable
- Test with both development (`npm run dev`) and production (`npm start`) servers

### Build Validation
- **ALWAYS** run `npm run build` after making changes to ensure production builds work
- **ALWAYS** run `npm run lint` to catch style and syntax issues
- Check build output for bundle size changes and warnings
- Verify static generation works correctly (pages show as "○ (Static)" in build output)

## Project Structure

### Key Directories and Files
```
/src/app/               - Next.js App Router application pages
/src/app/layout.tsx     - Root layout component (DO NOT add Google Fonts - they fail in build environment)
/src/app/page.tsx       - Homepage component
/src/app/globals.css    - Global Tailwind CSS styles
/public/                - Static assets (images, icons)
next.config.ts          - Next.js configuration
tsconfig.json           - TypeScript configuration
eslint.config.mjs       - ESLint configuration
postcss.config.mjs      - PostCSS/Tailwind configuration
package.json            - Dependencies and scripts
```

### Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Linting**: ESLint with Next.js and TypeScript configurations
- **Runtime**: Node.js 20.19.4
- **Package Manager**: npm 10.8.2

## Common Tasks

### Adding New Pages
- Create new files in `/src/app/` directory
- Use TypeScript (.tsx) for React components
- Follow App Router conventions for file naming
- Always run `npm run build` to verify static generation works

### Styling Changes
- Edit `/src/app/globals.css` for global styles
- Use Tailwind classes in component files
- PostCSS automatically processes Tailwind directives
- **DO NOT** add external font imports - they cause build failures

### Configuration Changes
- `next.config.ts` - Next.js build and runtime configuration
- `tsconfig.json` - TypeScript compiler options (includes path aliases with @/*)
- `eslint.config.mjs` - Code quality and style rules

### Troubleshooting
- **Build fails with font errors**: Remove any Google Fonts imports from layout.tsx
- **Development server won't start**: Run `rm -rf .next && npm install` then try again
- **Production server crashes**: Run `rm -rf .next && npm run build` to rebuild
- **Linting errors**: Run `npm run lint` to see specific issues

## Performance Notes
- Development server uses Turbopack for fast hot reloading
- Production builds are optimized and minified
- Static pages are pre-rendered at build time
- Build times are consistently under 20 seconds for this base application

## Dependencies
Current key dependencies (see package.json for complete list):
- react: 19.1.0
- react-dom: 19.1.0  
- next: 15.4.6
- typescript: ^5
- tailwindcss: ^4
- eslint: ^9

**NEVER** update major versions without testing thoroughly as breaking changes are common in these tools.

**CREATE** an implementation plan first then ask for approval before implementing.