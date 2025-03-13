# eBike Renting Platform API

## Overview

This API allows users to rent e-bikes, manage stations, and track journeys.

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB instance (local or cloud)
- Environment variables:
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT authentication

### Installation

```sh
# Clone the repository
git clone <repo-url>
cd ebike-renting-api

# Install dependencies
npm install

# Edit .env file and configure environment variables

# Start the server
npm start
```

The API will run on `http://localhost:5000`.

## Authentication

### Signup

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "jwt_token_here"
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "jwt_token_here"
}
```

## Stations

### Get Nearby Stations

**Endpoint:** `GET /api/stations/nearby`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Query Parameters:**

- `latitude`: Required, float (-90 to 90)
- `longitude`: Required, float (-180 to 180)
- `maxDistance`: Optional, integer (default: 5000 meters)

**Response:**

```json
[
  {
    "name": "Central Station",
    "location": { "type": "Point", "coordinates": [longitude, latitude] },
    "capacity": 10,
    "availableBikes": []
  }
]
```

### Create Station

**Endpoint:** `POST /api/stations`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Request Body:**

```json
{
  "name": "Downtown Station",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "capacity": 15
}
```

**Response:**

```json
{
  "name": "Downtown Station",
  "location": { "type": "Point", "coordinates": [-122.4194, 37.7749] },
  "capacity": 15
}
```

## Bikes

### Create a Bike

**Endpoint:** `POST /api/bikes`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Request Body:**

```json
{
  "qrCode": "unique-bike-123",
  "currentStation": "stationId",
  "status": "available"
}
```

**Response:**

```json
{
  "_id": "bikeId",
  "qrCode": "unique-bike-123",
  "currentStation": "stationId",
  "status": "available"
}
```

### Update Bike Status

**Endpoint:** `PATCH /api/bikes/:bikeId`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Request Body:**

```json
{
  "status": "in_use"
}
```

**Response:**

```json
{
  "_id": "bikeId",
  "status": "in_use"
}
```

### Delete a Bike

**Endpoint:** `DELETE /api/bikes/:bikeId`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Response:**

```json
{
  "message": "Bike deleted successfully"
}
```

## Journeys

### Start a Journey

**Endpoint:** `POST /api/journeys/start`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Request Body:**

```json
{
  "bikeId": "bikeId",
  "stationId": "stationId"
}
```

**Response:**

```json
{
  "message": "Journey started successfully",
  "journey": { "_id": "journeyId", "startTime": "2023-01-01T12:00:00Z" }
}
```

### End a Journey

**Endpoint:** `POST /api/journeys/end`

**Headers:**

```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

**Request Body:**

```json
{
  "bikeId": "bikeId",
  "stationId": "stationId"
}
```

**Response:**

```json
{
  "message": "Journey ended successfully",
  "cost": 2.5
}
```

---
