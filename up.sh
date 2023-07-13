#!/bin/bash
if [ -f .env ]; then
  /usr/local/bin/node application.js
else
  echo ".env file not found. Run configure.sh to generate it."
fi

