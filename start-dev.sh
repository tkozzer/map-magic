#!/bin/bash

# Start the backend
npm run dev:backend &

# Start the frontend development server
cd frontend && npm install && npm run dev &

# Wait for all background processes to finish
wait