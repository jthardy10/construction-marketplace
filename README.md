# Construction Marketplace

This is a web application for a construction marketplace, built with React, Express, and MongoDB. The platform allows clients to post construction projects and contractors to bid on these projects.

## Features

- User authentication (register, login, logout)
- User roles (client and contractor)
- Project creation and management
- Bid creation and management
- Project listing with filtering and search functionality
- Detailed project view with milestones
- Bid comparison for clients
- Contractor dashboard for managing bids
- Responsive design using Tailwind CSS

## Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication

## Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB

### Backend Setup
1. Navigate to the backend directory:
   cd backend
2. Install dependencies:
   npm install
3. Create a .env file in the backend directory and add the following:
   PORT=8000
   JWT_SECRET=your_secret_key_here
   MONGODB_URI=your_mongodb_connection_string
4. Start the backend server:
   npm run dev

### Frontend Setup
1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install
3. Start the frontend development server:
   npm run dev

## Contact

If you have any questions or concerns, please open an issue in this repository.
