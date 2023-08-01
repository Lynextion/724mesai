#!/bin/bash

# Navigate to the React application directory
cd frontend/

# Install dependencies for the React application
npm install

# Build the React application
npm run build

# Navigate to the middleware directory
cd ../middleware/

# Install dependencies for the middleware
npm install

# Start the middleware server
npm start &
MIDDLEWARE_PID=$!

# Navigate back to the React application directory
cd path/to/your/react/app

# Start the React development server
npm start

# Terminate the middleware server when the React development server stops
kill $MIDDLEWARE_PID
