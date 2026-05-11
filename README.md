### Instructions on how to run this project

### 0. Need to have already
Docker (currently running on your desktop)
Node.js
### 1. Install dependencies
npm install

npm run install:all


### 2. Environment file

A backend/.env file is included in this submission. No changes are needed.

If .env file not working properly:

cp backend/.env.example backend/.env
Open backend/.env and set JWT_SECRET=anyrandomstring


### 3. Start the app
npm run dev

This starts MongoDB, Redis, and the backend through Docker, and the React frontend locally.

Frontend: http://localhost:5173
Backend: http://localhost:5000

### 4. Seed the database (first time only)
In a separate terminal, from the backend folder:

node userSeed.js
node foodSeed.js

You MUST do userSeed.js first, then foodSeed.js for the createdBy field to be set properly


## Test accounts

Admin:

Email - admin@gmail.com

Password - Admin123!

User (Jason):

Email - jason@gmail.com

Password - Jason123!
