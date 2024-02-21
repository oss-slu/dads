#!/bin/bash

# Detecting the user's operating system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux detected
    echo "Detected Linux OS" 
    # Start Python backend
    cd Backend
    python server.py &
    # Start React frontend and install dependencies 
    cd ../Frontend
    npm install
    npm run start
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS detected 
    echo "Detected macOS"
    # Start Python backend
    cd Backend
    python server.py &
    # Start React frontend and install dependencies 
    cd ../Frontend
    npm install
    npm run start
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows detected
    echo "Detected Windows OS"
    # Start Python backend
    cd Backend
    start python server.py
    # Start React frontend and install dependencies 
    cd ../Frontend
    start npm install
    start npm run start
else
    echo "Unsupported operating system"
    exit 1
fi