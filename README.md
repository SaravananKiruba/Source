# ABI Estates - Booking & Registration Management System

Phase-1 UI Implementation with React + Chakra UI

## Features

### Staff Portal
- **Booking Management**: Digital booking form with search, filter, and sorting
- **Payment Processing**: Mock Razorpay integration with receipt generation
- **Registration Workflow**: Complete registration request management
- **Token Management**: Slot booking and token assignment
- **Dashboard**: Statistics and audit logs
- **RBAC**: Role-based access control with login
- **Generate Booking Links**: Create unique links for customer self-service

### Customer Portal (NEW!)
- **Google OAuth Login**: Mock Google authentication for customers
- **Self-Service Booking**: Customers can fill booking forms themselves
- **Online Payments**: Secure Razorpay payment integration
- **Booking Dashboard**: View all bookings and payment status
- **Unique Booking Links**: Sales can send personalized booking links

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
```

## Access Points

### Staff Portal
- URL: http://localhost:3000/login
- Default Credentials:
  - **Admin**: admin@abiestates.com / admin123
  - **Sales**: sales@abiestates.com / sales123
  - **Accounts**: accounts@abiestates.com / accounts123
  - **Legal**: legal@abiestates.com / legal123

### Customer Portal
- URL: http://localhost:3000/customer/login
- Login: Click "Continue with Google" (mock OAuth)
- Features:
  - View bookings and make payments
  - Complete booking forms
  - Track payment status

## Customer Booking Flow

1. Sales staff generates a unique booking link from staff portal
2. Customer receives link via email/WhatsApp
3. Customer clicks link → redirected to Google login
4. After login, customer fills booking form (3 steps)
5. Customer makes advance payment via Razorpay
6. Receipt generated automatically
7. Staff receives notification

## Tech Stack

- React 18
- TypeScript
- Chakra UI
- React Router
- Vite
- Mock Google OAuth
- Mock Razorpay Integration
