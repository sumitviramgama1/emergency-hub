# Emergency Hub

Emergency Hub is a full-stack web application designed to provide quick and reliable assistance during emergencies. The platform offers services such as roadside assistance, medical emergencies, hospital emergencies, fuel shortages, and general services. It integrates AI-powered chatbots, location-based services, and troubleshooting guides to ensure users get the help they need when they need it most.

## Features

- **AI Chatbot**: Provides assistance for vehicle breakdowns, medical emergencies, fuel shortages, and more.
- **Location-Based Services**: Find nearby service providers, hospitals, and fuel stations.
- **Troubleshooting Guides**: Step-by-step guides for common issues like CPR, jump-starting a car, and more.
- **SOS Button**: Quickly request emergency help.
- **Service Provider Dashboard**: Manage requests and provide assistance.

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **Tailwind CSS**: For styling.
- **React Router**: For navigation.
- **Axios**: For API requests.
- **Google Maps API**: For location-based services.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: For database management.
- **Mongoose**: For object data modeling.
- **Google Generative AI**: For chatbot functionality.

## Folder Structure
. ├── backend/ │ ├── config/ # Database configuration │ ├── controllers/ # API controllers │ ├── models/ # Mongoose models │ ├── routes/ # API routes │ ├── .env # Backend environment variables │ ├── Dockerfile # Docker configuration for backend │ └── server.js # Entry point for the backend ├── frontend/ │ ├── public/ # Static assets │ ├── src/ # React source code │ ├── .env # Frontend environment variables │ ├── Dockerfile # Docker configuration for frontend │ └── vite.config.js # Vite configuration

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Docker (optional)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Install dependencies:
   npm install
3. Create a .env file and configure the following variables
   MONGO_URI=<your-mongodb-uri>
   PORT=5000
4. Start the server:
  npm start


Frontend Setup
1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install
3. Create a .env file and configure the following variables:
    VITE_BACKEND_URL=http://localhost:5000
    VITE_GOOGLE_MAP_API_KEY={YOUR_GOOGLE_API}
4. Start the frontend development server:
    npm run dev