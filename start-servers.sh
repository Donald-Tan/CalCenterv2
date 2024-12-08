#!/bin/bash
set -e

echo "Starting the backend server..."
cd backend/MySQLConnection
npm install
npm start &
BACKEND_PID=$!

echo "Starting the iOS server..."
cd ../frontend/CalCenterv2
npm install
npx expo start -i &
FRONTEND_PID=$!

echo "Backend and frontend servers are running."
echo "Backend PID: $BACKEND_PID, Frontend PID: $FRONTEND_PID"

wait