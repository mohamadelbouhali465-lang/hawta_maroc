# Hawta Maroc

## Project Description

Hawta Maroc is a full-stack web application for managing deals, products, and user orders. It serves as a platform for browsing and comparing offers while allowing users to create quote requests and manage their purchases.

## Key Features

- **Deal Management System** - Browse, create, update, and delete product deals/offers
- **User Profiles** - User registration, authentication, and profile management with favorites and notification preferences
- **Quote Requests** - Submit and track quote requests from the home page
- **Order Comparison** - Compare and create buy requests from the Compare page
- **Activity Logging** - Audit records for support, security, campaigns, and payment actions
- **Gemini AI Integration** - Optional AI features via Gemini API

## Tech Stack

- **Frontend:** Vue.js with Vite
- **Backend:** Node.js
- **Database:** MongoDB
- **Optional:** Gemini API for AI features

## Core Collections

- `deals` - Products and offers
- `users` - User accounts and profiles
- `requests` - Quote requests
- `activities` - Audit logs
- `orders` - Purchase orders

## Getting Started

### Prerequisites

- Node.js

### Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and set `MONGODB_URI` to your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/database
   ```

3. Optional: set `GEMINI_API_KEY` in `.env` if you use Gemini features.

4. Run the full app:
   ```bash
   npm run dev
   ```

To run only the backend API without Vite:
```bash
npm run dev:backend
```

### Backend Health Check

```
http://localhost:3000/api/health
```

## MongoDB Setup

Use a local database for this project:

```
MONGODB_URI=mongodb://127.0.0.1:27017/hawta_maroc
```

The app creates these collections automatically when data is saved:

- `deals` - products/offers shown on the deals pages
- `users` - local demo accounts, profile data, favorites, and notification preferences
- `requests` - quote requests from the home page
- `activities` - simple audit records for support, security, campaign, and payment actions
- `orders` - buy requests created from the Compare page

## API Routes

### Deals
- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create a new deal
- `PUT /api/deals/:id` - Update a deal
- `DELETE /api/deals/:id` - Delete a deal

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user

### Authentication
- `POST /api/auth/login` - User login

### Requests
- `GET /api/requests` - Get all quote requests
- `POST /api/requests` - Create a quote request

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Log an activity

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create an order

## Important Notes

- **Sign-in** is a local development flow. Enter any email and password to create a user document.
- **Password Storage** - Passwords are stored plainly right now for local testing only. Add hashing and real authentication before production.
- **External Services** - Google, Facebook, payments, email reset, and file upload need external service credentials before they can be production features.
