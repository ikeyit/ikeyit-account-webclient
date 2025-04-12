# iKeyit Account Web Client

A lightweight authentication center web frontend designed to provide user account management functionality with minimal dependencies. This project serves as the client-side interface for user authentication, registration, and account management.

## Overview

This web application provides a modern, responsive interface for user authentication and account management. It's built with performance and simplicity in mind, making it easy to integrate with backend authentication services.

Key features include:
- User login with multiple authentication methods
- Account registration
- Profile management
- Responsive design for all devices

## Technology Stack

### Core Libraries
- [React](https://react.dev/) - UI library
- [React Router](https://reactrouter.com/) - Client-side routing
- [React Hook Form](https://react-hook-form.com/) - Form validation and handling
- [Yup](https://github.com/jquense/yup) - Schema validation

### UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Headless UI components

### Internationalization
- [i18next](https://www.i18next.com/) - Localization framework

## Getting Started

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
```sh
git clone [repository-url]
cd ikeyit-account-webclient
```

2. Install dependencies
```sh
npm install
```

## Development

Start the development server:
```sh
npm run dev
```

This will start the development server at http://localhost:6111 (or as configured in vite.config.js).

## Building for Production

Build the application for production:
```sh
npm run build
```

The built files will be in the `dist` directory. In production, these minified JS and CSS files should be deployed to a CDN, and the backend should be configured to use these files.

## Preview Production Build

To preview the production build locally:
```sh
npm run preview
```

## Project Structure

- `/src` - Source code
  - `/assets` - Static assets
  - `/components` - Reusable UI components
  - `/hooks` - Custom React hooks
  - `/layouts` - Page layouts
  - `/lib` - Utility functions and API clients
  - `/locales` - Internationalization resources
  - `/pages` - Application pages

## License

[License information]
