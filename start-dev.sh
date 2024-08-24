#!/bin/bash

# Start the backend and frontend
npm run dev:backend & npm run dev:frontend

# Wait for all background processes to finish
wait