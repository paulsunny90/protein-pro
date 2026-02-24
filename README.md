# Protein-Pro: Full Control Flow & Project Overview

Protein-Pro is a full-stack e-commerce application designed for selling health and fitness supplements. This project follows a modern MERN-like architecture using TypeScript for both the Client and Server.

## 🚀 Project Architecture

The project is divided into two main parts:
- **Client**: A React application built with Vite and TypeScript.
- **Server**: A Node.js/Express application built with TypeScript, using MongoDB for data storage.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**:  CSS  Tailwind (as seen in some features)
- **State Management**: Redux Toolkit & React Context API
- **Routing**: React Router DOM (v6)
- **Payments**: PayPal SDK Integration
- **Authentication**: Custom JWT-based & Google OAuth (Passport)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js & JWT
- **File Storage**: Multi-part uploads (Multer) saved to `/uploads` folder

---

## 🔄 Full Control Flow

The following describes the end-to-end flow of data and control within the application.

### 1. Application Initialization
- **Server**: `Server/index.ts` is the entry point. It connects to MongoDB via `config/db.config.ts` and starts the Express server defined in `app.ts`.
- **Client**: `Client/src/main.tsx` initializes the React app, wrapping it in `AuthProvider` and `Redux Provider`.

### 2. Request Handling Flow
When a user interacts with the application (e.g., viewing products), the flow is as follows:

1.  **User Action**: User navigates to `/products` in their browser.
2.  **Frontend Route**: `App.tsx` renders `ProductsPage`.
3.  **Data Fetching**: `ProductsPage` calls a service function in `Client/src/services/productService.ts`.
4.  **API Call**: The service uses `axios` (defined in `Client/src/utils/api.ts`) to send a GET request to `http://localhost:5000/api/products`.
5.  **Express Middleware**: The request hits `Server/app.ts`, passing through CORS, JSON, and Cookie-parser middlewares.
6.  **Server Routing**: `app.ts` routes the request to `Server/routes/index.routes.ts`, which then delegates to `Server/routes/product.routes.ts`.
7.  **Controller Logic**: `product.controller.ts` receives the request and calls the Mongoose `Product` model.
8.  **Database Interaction**: MongoDB returns the product list.
9.  **Response**: The controller sends the JSON response back to the client.
10. **State Update**: The client-side service returns the data, which is then stored in Redux for the UI to render.

### 3. Authentication Flow
#### A. Password-Based Login
- Client sends login data to `/api/auth/login`.
- `auth.controller.ts` validates credentials against the `User` model.
- If valid, a token is issued and set via cookies or response body.

#### B. Google OAuth
- Client initiates login via `/auth/google`.
- Server uses `Passport` to redirect to Google.
- Upon successful authentication, Google calls the callback URL.
- Server creates/finds the user and redirects to `/auth/login-success` on the frontend with verification.

### 4. Ordering & Payment Flow
1.  **Placement**: User clicks "Place Order" in `OrderPage`.
2.  **Order Creation**: Frontend calls `/api/orders` to create a new order in MongoDB.
3.  **PayPal Integration**: Frontend fetches the PayPal Client ID from `/api/config/paypal` and initializes the PayPal button.
4.  **Transaction**: User completes payment via PayPal.
5.  **Finalization**: Upon success, a call is made to the backend to update the order status to "Paid".

### 5. Admin Control Flow
- Admin routes are protected by `AdminProtectedRoute` on the frontend and custom middleware on the backend.
- Admin manages products/users/orders via the `features/admin` components, which interact with dedicated admin-level endpoints.

---

## 📁 Directory Structure Summary

```
protein-pro/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── features/       # Modular features (User & Admin)
│   │   ├── services/       # API service layers
│   │   ├── store/          # Redux slices
│   │   └── App.tsx         # Main Routing
│   └── vite.config.ts      # Vite configuration
├── Server/                 # Express Backend
│   ├── config/             # DB & App configurations
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation
│   └── app.ts              # Express initialization
└── README.md               # You are here
```

## 🛠️ Setup Instructions

### Backend
1. `cd Server`
2. `npm install`
3. Create `.env` file with `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc.
4. `npm run dev`

### Frontend
1. `cd Client`
2. `npm install`
3. Create `.env` file with `VITE_API_BASE_URL`.
4. `npm run dev`
