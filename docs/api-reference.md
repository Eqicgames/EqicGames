# Eqic Games API Reference

This document provides detailed information about the Eqic Games REST API endpoints, including authentication, request parameters, and response formats.

## Base URL

All API endpoints are relative to:

```
https://api.eqicgame.world/v1
```

## Authentication

Most API endpoints require authentication. Obtain an authentication token by logging in or registering a new account.

Include the token in the header of your requests:

```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

API errors follow a standard format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## User API

### Register User

**POST /api/users/register**

Register a new user account.

**Request Body:**
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "player123",
    "email": "player@example.com",
    "walletAddresses": [],
    "avatar": "default-avatar.png",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Login User

**POST /api/users/login**

Authenticate a user and get a token.

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "player123",
    "email": "player@example.com",
    "walletAddresses": ["solana_wallet_address"],
    "avatar": "avatar_url.png",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get User Profile

**GET /api/users/profile**

Get the current user's profile information.

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "player123",
    "email": "player@example.com",
    "walletAddresses": ["solana_wallet_address"],
    "avatar": "avatar_url.png",
    "bio": "Gamer and collector",
    "role": "user",
    "preferences": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "marketing": false,
        "transactions": true
      }
    },
    "socialLinks": {
      "twitter": "player123",
      "discord": "player#1234"
    },
    "isVerified": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "assetCount": 10
  }
}
```

### Update User Profile

**PUT /api/users/profile**

Update the current user's profile information.

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "username": "new_username",
  "avatar": "new_avatar_url.png",
  "bio": "Updated bio information",
  "preferences": {
    "theme": "light"
  },
  "socialLinks": {
    "twitter": "new_twitter_handle"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "username": "new_username",
    "avatar": "new_avatar_url.png",
    "bio": "Updated bio information",
    "preferences": {
      "theme": "light",
      "notifications": {
        "email": true,
        "marketing": false,
        "transactions": true
      }
    },
    "socialLinks": {
      "twitter": "new_twitter_handle",
      "discord": "player#1234"
    }
  }
}
```

### Connect Wallet

**POST /api/users/connect-wallet**

Connect a blockchain wallet to the user's account.

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "walletAddress": "solana_wallet_address",
  "signature": "signed_message",
  "walletType": "phantom"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet connected successfully",
  "walletAddresses": [
    {
      "address": "solana_wallet_address",
      "type": "phantom",
      "isPrimary": true,
      "dateAdded": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Asset API

### Get User Assets

**GET /api/users/assets**

Get all assets owned by the current user.

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "assets": [
    {
      "id": "asset_id_1",
      "name": "Legendary Sword",
      "assetType": "item",
      "rarity": "legendary",
      "game": {
        "id": "game_id",
        "name": "Epic Adventure"
      },
      "metadata": {
        "power": 100,
        "durability": 1000,
        "imageUrl": "sword_image.png"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "asset_id_2",
      "name": "Dragon Mount",
      "assetType": "mount",
      "rarity": "epic",
      "game": {
        "id": "game_id",
        "name": "Epic Adventure"
      },
      "metadata": {
        "speed": 200,
        "flight": true,
        "imageUrl": "dragon_image.png"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User Transactions

**GET /api/users/transactions?page=1&limit=10**

Get transaction history for the current user.

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "transaction_id",
      "type": "purchase",
      "asset": {
        "id": "asset_id",
        "name": "Legendary Sword",
        "imageUrl": "sword_image.png"
      },
      "sender": {
        "username": "seller_username",
        "avatar": "seller_avatar.png"
      },
      "receiver": {
        "username": "player123",
        "avatar": "avatar_url.png"
      },
      "amount": 100,
      "currency": "SOL",
      "status": "completed",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

## Marketplace API

### List Asset

**POST /api/marketplace/listings**

List an asset for sale on the marketplace.

**Headers:**
```
x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "assetId": "asset_id",
  "price": 100,
  "currency": "SOL"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset listed successfully",
  "listing": {
    "id": "listing_id",
    "assetId": "asset_id",
    "seller": "user_id",
    "price": 100,
    "currency": "SOL",
    "listedAt": "2023-01-01T00:00:00.000Z",
    "isActive": true
  }
}
```

### Get Marketplace Listings

**GET /api/marketplace/listings?page=1&limit=10&filter=active**

Get active listings on the marketplace.

**Response:**
```json
{
  "success": true,
  "listings": [
    {
      "id": "listing_id",
      "asset": {
        "id": "asset_id",
        "name": "Legendary Sword",
        "assetType": "item",
        "rarity": "legendary",
        "imageUrl": "sword_image.png",
        "game": {
          "id": "game_id",
          "name": "Epic Adventure"
        }
      },
      "seller": {
        "username": "seller_username",
        "avatar": "seller_avatar.png"
      },
      "price": 100,
      "currency": "SOL",
      "listedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. Current limits are:

- 60 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Exceeding these limits will result in a 429 Too Many Requests response. 