# User Schema Documentation

## Overview

The User model is a comprehensive schema used to store all user-related information in the Eqic Game platform, including authentication details, profile information, wallet connections, and preferences.

## Schema Structure

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  walletAddresses: [
    {
      address: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['phantom', 'solflare', 'metamask', 'other'],
        default: 'other'
      },
      isPrimary: {
        type: Boolean,
        default: false
      },
      dateAdded: {
        type: Date,
        default: Date.now
      }
    }
  ],
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxLength: 500,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      inApp: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showWallet: {
        type: Boolean,
        default: false
      },
      showActivity: {
        type: Boolean,
        default: true
      }
    }
  },
  socialLinks: {
    twitter: String,
    discord: String,
    github: String,
    website: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## Field Descriptions

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Unique user identifier for display and login |
| `email` | String | User's email address, also used for login |
| `password` | String | Hashed password for authentication |

### Wallet Integration

| Field | Type | Description |
|-------|------|-------------|
| `walletAddresses` | Array | Collection of user's blockchain wallet addresses |
| `walletAddresses.address` | String | The actual wallet address on the blockchain |
| `walletAddresses.type` | String | The wallet provider (Phantom, Solflare, etc.) |
| `walletAddresses.isPrimary` | Boolean | Whether this is the user's primary wallet |
| `walletAddresses.dateAdded` | Date | When this wallet was connected |

### Profile Information

| Field | Type | Description |
|-------|------|-------------|
| `avatar` | String | URL to user's profile picture |
| `bio` | String | User's self-description |
| `role` | String | User's role in the platform |
| `socialLinks` | Object | Links to user's social media profiles |
| `isVerified` | Boolean | Whether the user's account is verified |

### User Preferences

| Field | Type | Description |
|-------|------|-------------|
| `preferences.theme` | String | User's preferred UI theme |
| `preferences.notifications` | Object | User's notification settings |
| `preferences.privacy` | Object | User's privacy settings |

### Timestamps

| Field | Type | Description |
|-------|------|-------------|
| `lastLogin` | Date | When the user last logged in |
| `createdAt` | Date | When the user account was created |
| `updatedAt` | Date | When the user account was last updated |

## Methods

The User model includes the following methods:

- `toJSON()`: Returns a sanitized version of the user object (excludes password)
- Virtual field `profileUrl`: Generates the user's profile URL

## Indexes

The schema uses indexes for the following fields to improve query performance:
- `username`
- `email`
- `walletAddresses.address`

## Usage Examples

### Creating a new user
```javascript
const user = new User({
  username: 'gameplayer',
  email: 'player@example.com',
  password: 'hashedPassword123'
});
await user.save();
```

### Adding a wallet address
```javascript
user.walletAddresses.push({
  address: 'solana123xyz',
  type: 'phantom',
  isPrimary: true
});
await user.save();
```

### Updating preferences
```javascript
user.preferences.theme = 'dark';
user.preferences.notifications.email = false;
await user.save();
``` 