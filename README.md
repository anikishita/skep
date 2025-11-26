# AntiGravity Connect

AntiGravity Connect is a production-ready, anonymous video chat application built with Next.js, Node.js, Socket.IO, and WebRTC.

## Features

*   **Anonymous**: No login required. Ephemeral IDs.
*   **Real-time**: Instant video/voice connections via WebRTC.
*   **Random Matching**: Connect with strangers instantly.
*   **Invite Links**: Share a unique link to invite a friend.
*   **Riot Games Aesthetic**: Sleek, dark, and immersive UI.

## Tech Stack

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express, Socket.IO.
*   **Database**: Redis (for ephemeral session storage).
*   **DevOps**: Docker, Docker Compose.

## Getting Started

### Prerequisites

*   Node.js 18+
*   Docker & Docker Compose (optional, for containerized run)
*   Redis (if running locally without Docker)

### Local Development

1.  **Install Dependencies**:
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Start Redis**:
    Ensure you have a Redis instance running on port 6379.
    ```bash
    # If you have docker
    docker run -p 6379:6379 -d redis:alpine
    ```

3.  **Start Backend**:
    ```bash
    cd server
    npm run dev
    ```
    Server will run on `http://localhost:3001`.

4.  **Start Frontend**:
    ```bash
    cd client
    npm run dev
    ```
    Client will run on `http://localhost:3000`.

### Docker Deployment (Recommended)

Run the entire stack with one command:

```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`.

## Production Deployment

### 1. Backend (Render/Railway/AWS)
*   Deploy the `server` directory.
*   Set environment variables:
    *   `PORT`: 3001 (or platform default)
    *   `REDIS_URL`: URL of your managed Redis instance.
    *   `CORS_ORIGIN`: Your frontend domain (e.g., `https://antigravity.vercel.app`).

### 2. Frontend (Vercel)

#### Quick Deploy
1. Import your repository in [Vercel](https://vercel.com/new)
2. Set the **Root Directory** to `client`
3. Vercel will automatically detect Next.js and use the correct build settings
4. Configure the following environment variable:
   *   `NEXT_PUBLIC_SOCKET_URL`: Your deployed backend URL (e.g., `https://api.antigravity.com`)
5. Deploy!

#### Manual Configuration
The `client` directory includes a `vercel.json` file with the following settings:
```json
{
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "outputDirectory": ".next"
}
```

#### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket server URL | `https://api.antigravity.com` |

**Note**: The WebSocket server (backend) must be deployed separately to a platform that supports WebSocket connections (e.g., Render, Railway, Fly.io, AWS). Vercel's serverless functions do not support persistent WebSocket connections.

## Privacy Policy

**Effective Date**: 2025-11-26

1.  **No Account Data**: We do not require or store email addresses, passwords, or personal identifiers.
2.  **Ephemeral Sessions**: User IDs are randomly generated and stored in memory (Redis) only for the duration of the session. They are automatically expired after 24 hours.
3.  **Media Streams**: Video and audio streams are peer-to-peer (P2P) and encrypted. They do not pass through our servers (except when using TURN, where they are encrypted and not recorded).
4.  **Data Retention**: We retain minimal logs (IP address hashes) for 24 hours solely for abuse prevention and rate limiting.

## Moderation Playbook

1.  **Automated**:
    *   **Rate Limiting**: IPs are limited to 10 connections per minute.
    *   **Profanity Filter**: Basic text chat filtering is enabled.
2.  **Reporting**:
    *   Users can report peers via the "Report" button.
    *   Reports log the session ID and timestamp.
    *   Repeated reports against an IP trigger a temporary 24-hour ban.
3.  **Admin**:
    *   Admins can revoke active bans via the Redis CLI or Admin API (if enabled).

## Testing

### Backend Unit Tests
Run `npm test` in the `server` directory to test room matching logic.

### Manual E2E Test
1.  Open `http://localhost:3000` in two separate browser windows (Incognito recommended).
2.  Click "Random Connect" in both windows.
3.  Verify that video/audio connects and chat works.
