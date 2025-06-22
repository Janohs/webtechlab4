#!/bin/bash

# Backend Switcher Script
echo "Choose your backend:"
echo "1. JSON Server (port 3001)"
echo "2. PHP/XAMPP Backend"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "Switching to JSON Server..."
        cp .env.json .env.local
        echo "Backend set to JSON Server. Run 'npm run serve' to start frontend."
        ;;
    2)
        echo "Switching to PHP/XAMPP Backend..."
        cp .env.php .env.local
        echo "Backend set to PHP/XAMPP. Make sure XAMPP is running and run 'npm run serve' to start frontend."
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        ;;
esac
