# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Life Game - A gamified task/habit tracking web app. Users earn XP, level up, build streaks, and unlock achievements.

**Tech Stack:**
- Frontend: React 18 + Vite 5 + TypeScript
- Backend: Express + TypeScript
- Database: Supabase (PostgreSQL)
- Deployment: Railway

## Development Commands

```bash
# Install all dependencies (from root)
npm install

# Development (runs both frontend and backend)
npm run dev

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Build for production
npm run build:frontend

# Start (builds and runs in production mode)
npm start
```

## Architecture

### Backend (`backend/src/`)
- `index.ts` - Express server, serves static frontend files, routes API
- `config.ts` - Supabase client, JWT config
- `routes/` - API endpoints (auth, tasks, habits, achievements, user, dashboard)
- `middleware/auth.ts` - JWT authentication
- `services/` - Business logic (XP calculation, achievement checking)

### Frontend (`frontend/src/`)
- `api/` - Axios API clients
- `pages/` - Route pages (Login, Dashboard, Tasks, Habits, Achievements)
- `components/` - Reusable UI components
- `hooks/useAuth.tsx` - Authentication context

### Database Schema
- `users` - id, username, password_hash, level, total_xp, streaks
- `tasks` - id, user_id, title, description, xp_reward, due_date, repeat_rule, completed
- `habits` - id, user_id, name, xp_reward, current_streak, longest_streak
- `habit_logs` - id, habit_id, check_in_date (tracks daily check-ins)
- `achievements` - id, user_id, achievement_key, unlocked_at

## Deployment

Railway deploys from git. The `start` script builds frontend, then backend, then starts Express. Express serves both API and static frontend files.

### Required Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default 3001)

## Important Notes

### Node.js Compatibility
- Railway uses Node.js 18.x
- `@supabase/supabase-js` 2.39.0 is compatible with Node 18
- React 18.x and Vite 5.x are compatible with Node 18
- Do NOT upgrade to newer versions that require Node 20+

### Build Artifacts
- `backend/dist/` and `frontend/dist/` are gitignored
- Railway rebuilds from source on each deploy

### SSL
- Railway automatically handles SSL for the default domain
- Custom domains need DNS CNAME pointing to Railway, SSL is automatic

### Git History
- Never commit `.env`, `node_modules/`, or `dist/` folders
- If accidentally committed, use `git filter-repo` to remove
