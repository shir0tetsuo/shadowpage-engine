#!/bin/bash
echo "This will erase the contents of .env!"
#read -p "Enter the DB host (localhost): " DB_HOST
#read -p "Enter the DB port (3306): " DB_PORT
#read -p "Enter the DB username (root): " DB_USERNAME
#read -p "Enter the DB password (password): " DB_PASSWORD
#read -p "Enter the DB name (mydatabase): " DB_NAME
read -p "Enter DB file path ($PWD/server-data.sql): " DB_FILE_PATH
read -p "Enter the APP server port (3000): " PORT

#echo "DB_HOST="${DB_HOST:-localhost} > .env
#echo "DB_PORT="${DB_PORT:-3306} >> .env
#echo "DB_USERNAME="${DB_USERNAME:-root} >> .env
#echo "DB_PASSWORD="${DB_PASSWORD:-password} >> .env
#echo "DB_NAME="${DB_NAME:-mydatabase} >> .env
echo "DB_FILE_PATH="${DB_FILE_PATH:-$PWD/server-data.sql} > .env
echo "PORT="${PORT:-3000} >> .env
echo "OK ($PWD/.env)"
#mkdir {./static, ./static/javascript, ./static/images}
