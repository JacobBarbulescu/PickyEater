# 1. Install root dev dependencies
npm install

# 2. Install backend/frontend
npm run install:all

# 3: copy env file and fill in necessary components
cp backend/.env.example backend/.env
fill in session, mongo_uri, and redis_url (get later)

# 4: After Mongo/Redis running:
npm run dev

View backend on localhost:5000
View frontend on localhost:5173


# Extra: How to make an admin account
Make a normal account
Manually change role to "admin" on MongoDB.
Log out and log back into that account so login token refreshes
Click on "Admin" in top left corner or navigate to /admin