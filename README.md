# Syntechxhub User Management System

A beginner-friendly REST API built with Node.js, Express, MongoDB, and Mongoose. It supports CRUD operations and protects user endpoints with HTTP Basic Authentication.

## Features

- Create, read, update, and delete users
- MongoDB persistence through Mongoose
- Basic authentication for `/api/users` endpoints
- Input validation and useful HTTP status codes
- Passwords are hashed with bcrypt; plain-text passwords are never returned
- Duplicate email protection
- `.env` secrets excluded from Git with `.gitignore`

## Requirements

- Node.js 18 or later
- npm
- MongoDB installed locally **or** a MongoDB Atlas connection string
- Postman (for testing)

## Setup

1. Extract the project folder and open a terminal inside it.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.
   - Windows Command Prompt: `copy .env.example .env`
   - macOS/Linux: `cp .env.example .env`

4. Edit `.env`. For local MongoDB, the default URI is:

   ```text
   MONGODB_URI=mongodb://127.0.0.1:27017/syntechxhub_users
   ```

   Set `API_USERNAME` and `API_PASSWORD` to your own values. Never commit `.env` to GitHub.

5. Make sure MongoDB is running, then start the server:

   ```bash
   npm start
   ```

6. Open `http://localhost:3000/` in a browser. You should see a JSON message confirming the API is running.

## Authentication

In Postman, open the **Authorization** tab, choose **Basic Auth**, and enter the values from your `.env` file. Every `/api/users` route requires this authentication.

Basic Auth is suitable here to demonstrate the assignment requirement. For production, use HTTPS, rate limiting, stronger identity management, and a carefully reviewed authentication design.

## API endpoints

Base URL: `http://localhost:3000/api/users`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users` | Create a user |
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get one user |
| PATCH | `/api/users/:id` | Update name and/or email |
| DELETE | `/api/users/:id` | Delete a user |

### 1. Create a user

`POST http://localhost:3000/api/users`

Body → raw → JSON:

```json
{
  "name": "Asha Kumar",
  "email": "asha@example.com",
  "password": "ExamplePass123"
}
```

The response returns the user ID, name, and email. It does not return the password or password hash.

### 2. Get all users

`GET http://localhost:3000/api/users`

### 3. Get one user

`GET http://localhost:3000/api/users/PASTE_USER_ID_HERE`

Replace the placeholder with the ID returned by the create request.

### 4. Update a user

`PATCH http://localhost:3000/api/users/PASTE_USER_ID_HERE`

Body → raw → JSON:

```json
{
  "name": "Asha K."
}
```

### 5. Delete a user

`DELETE http://localhost:3000/api/users/PASTE_USER_ID_HERE`

## Common responses

- `200 OK`: successful read/update/delete
- `201 Created`: user created
- `400 Bad Request`: invalid input or ID
- `401 Unauthorized`: missing or incorrect Basic Auth
- `404 Not Found`: user ID does not exist
- `409 Conflict`: email already exists
- `500 Internal Server Error`: unexpected server problem

## Suggested project structure

```text
Syntechxhub_User_Management_System/
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   └── userRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Before submitting

- Run the project locally and test every endpoint in Postman.
- Add screenshots of successful POST, GET, PATCH, and DELETE requests to your report if requested.
- Add your own explanation of the architecture and what you learned.
- Upload the entire source code to a public GitHub repository named `Syntechxhub_User_Management_System` (or follow the exact naming format provided by your internship).
- Do not upload `.env`, database credentials, or real personal data.

## Learning note

This is a starter implementation for an internship assignment. Review the code, run it, test each endpoint, and be ready to explain the request flow, CRUD, Mongoose schema, password hashing, and Basic Auth during evaluation.
