#!/bin/bash

# Detect the user's operating system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux detected
    echo "Detected Linux OS" 
    # Run appropriate commands for Linux
    # Start Docker database
    #docker-compose up -d database
    # Start Python backend
    cd Backend
    python server.py &
    # Start React frontend
    cd ../Frontend
    npm run start
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS detected 
    echo "Detected macOS"
    # Run appropriate commands for macOS
    # Start Docker database
    #docker-compose up -d database
    # Start Python backend
    cd Backend
    python server.py &
    # Start React frontend
    cd ../Frontend
    npm run start
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows detected
    echo "Detected Windows OS"
    # Run appropriate commands for Windows
    # Start Docker database
    #docker-compose up -d database
    # Start Python backend
    cd Backend
    start python server.py
    # Start React frontend
    cd ../Frontend
    start npm run start
else
    echo "Unsupported operating system"
    exit 1
fi