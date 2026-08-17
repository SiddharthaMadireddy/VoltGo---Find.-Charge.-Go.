# VoltGo ⚡️

VoltGo is a smart EV charging network web application that allows users to find charging stations, manage their electric vehicles, book charging slots, and handle payments seamlessly through an integrated wallet system.

## 🚀 Features

- **EV Station Locator**: Find and explore over 2,500+ charging stations, including 70+ dynamically generated city stations and 39+ ultra-fast premium highway hubs across major routes in India.
- **Premium UX & Animations**: Experience a highly polished, interactive UI with ultra-premium CSS animations, including a cinematic full-screen login transition and dynamic levitating components.
- **Dynamic Usage Dashboard**: Track your charging stats with real-time, dynamically calculated spending and connector usage metrics based on your actual session history.
- **Authentication**: Secure Google OAuth integration for quick sign-up and login.
- **Wallet & Payments**: Add money to your VoltGo wallet and pay for your charging sessions and reservations seamlessly.
- **Vehicle Management**: Add and manage your electric vehicles (battery capacity, connector types, etc.) in your virtual garage.
- **Smart Bookings**: Reserve your charging slot in advance and get real-time status updates.
- **Real-time Notifications**: Get notified about your bookings, wallet transactions, and more.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: SQLite (via `better-sqlite3`)
- **Authentication**: Google OAuth (`@react-oauth/google`, `google-auth-library`)
- **Icons**: Lucide React

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd VoltGo
   ```

2. Install the dependencies for both frontend and backend:
   ```bash
   npm install
   ```

### Running the Application

This project uses `concurrently` to run both the Vite frontend server and the Express backend server simultaneously with a single command.

1. Start the development servers:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   - **Frontend App**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)

*Note: The SQLite database (`database.sqlite`) will be automatically created in your project root upon first startup, seeded with essential schema and data.*

## 🔐 Configuration (Google OAuth)

The application uses Google OAuth for authentication. To ensure login functionality works locally:

1. You must have a Google Cloud Console Project.
2. Ensure your OAuth Client ID has `http://localhost:5173` added to its **Authorized JavaScript origins** and **Authorized redirect URIs**.
3. (Optional) If you wish to use a different Client ID, update the `GOOGLE_CLIENT_ID` in `src/main.tsx` and the audience ID in `server/index.js`.
