#!/bin/bash
echo "This will erase the contents of .env!"
echo "Please make sure you've run npm.sh before running this one!"
#read -p "Enter the DB host (localhost): " DB_HOST
#read -p "Enter the DB port (3306): " DB_PORT
#read -p "Enter the DB username (root): " DB_USERNAME
#read -p "Enter the DB password (password): " DB_PASSWORD
#read -p "Enter the DB name (mydatabase): " DB_NAME

# sqlite admin uuid
DEFAULTUUID='a0000001-0000-0000-0000-000000000001'

# where 'npm' and 'node' are installed
DEFAULTNODEDIR='/usr/local/bin/'

read -p "Enter DB file path ($PWD/server-data.sqlite): " DB_FILE_PATH
read -p "Enter the APP server port (3000): " PORT
read -p "Enter Admin UUID: ($DEFAULTUUID)" adminaccuuid
read -s -p "Enter Admin Password (8 Characters) (changeme): " adminpass
#read -p "Enter NodeJS Exec: ($DEFAULTNODEDIR)" node_execution_dir

#echo "DB_HOST="${DB_HOST:-localhost} > .env
#echo "DB_PORT="${DB_PORT:-3306} >> .env
#echo "DB_USERNAME="${DB_USERNAME:-root} >> .env
#echo "DB_PASSWORD="${DB_PASSWORD:-password} >> .env
#echo "DB_NAME="${DB_NAME:-mydatabase} >> .env
echo "DB_FILE_PATH="${DB_FILE_PATH:-$PWD/server-data.sqlite} > .env
echo "PORT="${PORT:-3000} >> .env
echo "ADMINUUID="${adminaccuuid:-$DEFAULTUUID} >> .env
echo "ADMINPASS="${adminpass:-changeme} >> .env
echo "OK ($PWD/.env)"

$DEFAULTNODEDIR/node $PWD/configure_admin_account.js

echo "Have a look at up.sh"
#mkdir {./static, ./static/javascript, ./static/images}