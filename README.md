# RydeShare Application Server

This is the backend server for RydeShare, a ride-sharing platform. It is built with Node.js, Express, TypeORM, PostgreSQL, and Redis, and provides RESTful APIs for user management, authentication (including OTP via SMS and email), trip creation, and trip search.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Overview](#api-overview)
- [Notes](#notes)

---

## Features

- User registration and login (email/password and phone/OTP)
- JWT-based authentication and authorization
- OTP verification via SMS (Twilio) and email (Mailtrap)
- Trip creation, retrieval, and search with flexible filters
- Vehicle and location management
- Image upload and storage for user and vehicle profiles
- Redis integration for OTP storage and verification
- PostgreSQL database with TypeORM entities for users, vehicles, trips, and locations
- Input validation using Joi schemas
- Centralized error handling

---

## Project Structure

```
src
├── config
│   └── default.ts          # default config
│   └── test.ts            # test config
├── database
│   └── data-source.ts     # TypeORM data source
├── middlewares
│   └── errorHandler.ts    # centralized error handling middleware
│   └── notFound.ts        # 404 not found middleware
├── modules
│   └── trips
│       ├── trips.controller.ts  # trip-related routes
│       ├── trips.service.ts     # business logic for trips
│       └── trips.entity.ts      # TypeORM entity for trips
│   └── users
│       ├── users.controller.ts  # user-related routes
│       ├── users.service.ts     # business logic for users
│       └── users.entity.ts      # TypeORM entity for users
│   └── vehicles
│       ├── vehicles.controller.ts  # vehicle-related routes
│       ├── vehicles.service.ts     # business logic for vehicles
│       └── vehicles.entity.ts      # TypeORM entity for vehicles
│   └── locations
│       ├── locations.controller.ts  # location-related routes
│       ├── locations.service.ts     # business logic for locations
│       └── locations.entity.ts      # TypeORM entity for locations
├── services
│   └── otp.service.ts      # service for sending and verifying OTP
│   └── auth.service.ts     # authentication service
├── utils
│   └── logger.ts           # logger utility
│   └── response.ts         # standardized response format
├── app.ts                  # main application file
└── server.ts               # entry point of the application
```

---

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- Redis
- Twilio account (for SMS OTP)
- Mailtrap account (for email OTP)

---

## Setup & Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd ryde-share-server`
3. Install dependencies: `npm install`
4. Setup database: Create a PostgreSQL database and update the `data-source.ts` file with your database credentials.
5. Configure environment variables: Create a `.env` file in the root directory and set the required variables (refer to `.env.example`).
6. Run migrations: `npm run typeorm migration:run`
7. Start the server: `npm run dev`

---

## Environment Variables

| Variable            | Description                               |
| ------------------- | ----------------------------------------- |
| PORT                | Port number for the server                |
| DATABASE_URL        | PostgreSQL database connection string     |
| REDIS_URL           | Redis connection URL                      |
| TWILIO_ACCOUNT_SID  | Twilio Account SID                        |
| TWILIO_AUTH_TOKEN   | Twilio Auth Token                         |
| TWILIO_PHONE_NUMBER | Twilio Phone Number                       |
| MAILTRAP_USER       | Mailtrap SMTP username                    |
| MAILTRAP_PASSWORD   | Mailtrap SMTP password                    |
| JWT_SECRET          | Secret key for JWT signing                |
| NODE_ENV            | Node environment (development/production) |

---

## Running the Project

- Development mode: `npm run dev`
- Production mode: `npm start`
- Run tests: `npm test`

---

## API Overview

- **Authentication**

  - `POST /api/auth/register`: User registration
  - `POST /api/auth/login`: User login
  - `POST /api/auth/otp`: Request OTP
  - `POST /api/auth/verify-otp`: Verify OTP

- **Users**

  - `GET /api/users`: Get all users
  - `GET /api/users/:id`: Get user by ID
  - `PUT /api/users/:id`: Update user by ID
  - `DELETE /api/users/:id`: Delete user by ID

- **Trips**

  - `POST /api/trips`: Create a new trip
  - `GET /api/trips`: Get all trips
  - `GET /api/trips/:id`: Get trip by ID
  - `PUT /api/trips/:id`: Update trip by ID
  - `DELETE /api/trips/:id`: Delete trip by ID

- **Vehicles**

  - `POST /api/vehicles`: Add a new vehicle
  - `GET /api/vehicles`: Get all vehicles
  - `GET /api/vehicles/:id`: Get vehicle by ID
  - `PUT /api/vehicles/:id`: Update vehicle by ID
  - `DELETE /api/vehicles/:id`: Delete vehicle by ID

- **Locations**
  - `POST /api/locations`: Add a new location
  - `GET /api/locations`: Get all locations
  - `GET /api/locations/:id`: Get location by ID
  - `PUT /api/locations/:id`: Update location by ID
  - `DELETE /api/locations/:id`: Delete location by ID

---

## Notes

- This project is built with TypeScript for better development experience and maintainability.
- For production deployment, it is recommended to use a process manager like PM2 and a reverse proxy like Nginx.
- Ensure that the Redis server is running before starting the application, as it is used for OTP storage and verification.
- The Twilio and Mailtrap configurations are essential for the authentication module to function correctly.
