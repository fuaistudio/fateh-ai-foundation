# FATEH AI — Foundation Build 0.1.0

A real, runnable modular web-platform foundation. This is **not** the complete 300-module product and does not pretend the planned agents/studios are already implemented. It provides a working dashboard, 30-studio and agent directories, persistent project creation, health/overview APIs, and a server-side Gemini chat connection.

## Requirements
- Node.js 20 or newer
- Gemini API key for live AI chat (optional for dashboard/project features)

## Run
1. Extract this ZIP.
2. In the project folder, copy `.env.example` to `.env`.
3. Put your Gemini key in `.env` as `GEMINI_API_KEY=your_key`.
4. Run `npm start` (no third-party npm packages required).
5. Open `http://localhost:8787`.

Without a key, the dashboard and project storage work; live chat returns a clear not-connected message. Data is stored in `data/projects.json`.

## Current working features
- Responsive dashboard and navigation
- 30 categorized studio entries (directory/status only at this stage)
- Agent architecture directory (directory/status only at this stage)
- Create and persist projects
- Health and overview API endpoints
- Server-side Gemini `generateContent` chat integration

## Not yet implemented
Authentication, multi-user PostgreSQL, key vault/rotation, Groq routing, autonomous agent execution, specialist tools, media generation providers, real studio pipelines, billing, audit-grade security, and production deployment. Do not expose this starter publicly until authentication, authorization, rate limiting, HTTPS, durable database, and security review are added.

## API
- `GET /api/health`
- `GET /api/overview`
- `GET /api/studios`
- `GET /api/agents`
- `POST /api/projects` with `{ "name": "...", "description": "..." }`
- `POST /api/chat` with `{ "message": "..." }`
