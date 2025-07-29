#!/bin/bash

echo "Running ESLint on all files..."

echo "Checking app.js..."
./node_modules/.bin/eslint -c .eslintrc.js ./secondChance-backend/app.js --fix

echo "Checking authRoutes.js..."
./node_modules/.bin/eslint -c .eslintrc.js ./secondChance-backend/routes/authRoutes.js --fix

echo "Checking secondChanceItemsRoutes.js..."
./node_modules/.bin/eslint -c .eslintrc.js ./secondChance-backend/routes/secondChanceItemsRoutes.js --fix

echo "Checking searchRoutes.js..."
./node_modules/.bin/eslint -c .eslintrc.js ./secondChance-backend/routes/searchRoutes.js --fix

echo "Checking util/import-mongo/index.js..."
./node_modules/.bin/eslint -c .eslintrc.js ./secondChance-backend/util/import-mongo/index.js --fix

echo "Checking sentiment/index.js..."
./node_modules/.bin/eslint -c .eslintrc.js ./sentiment/index.js --fix

echo "All files processed!"
