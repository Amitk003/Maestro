# Setup Guide

## What you need before starting

- Node.js 18 or higher
- npm 9 or higher
- A PostgreSQL database (or Supabase account)
- A Gemini API key (from Google AI Studio)
- (Optional) A Redis server for production

## Step by step

### 1. Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs everything for all apps and packages (npm workspaces).

### 2. Set up environment variables

Copy the example file:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

| Variable | What it is |
|----------|------------|
| DATABASE_URL | Your PostgreSQL connection string |
| GEMINI_API_KEY | Your Google Gemini API key |
| NEXTAUTH_SECRET | A random string for session encryption |
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anonymous key |

### 3. Set up the database (Supabase)

1. Create a project at https://supabase.com
2. Copy your project URL and anon key into `.env`
3. Go to the SQL Editor in your Supabase dashboard
4. Open each file in `supabase/migrations/` in order:
   - `00001_schema.sql` - creates all tables
   - `00002_rls.sql` - sets up row-level security
   - `00003_seed.sql` - inserts demo data
   - `00004_triggers.sql` - creates auto-profile trigger
   - `00005_agent_logs_tasks.sql` - creates staff_tasks table
5. Run each file in the SQL Editor

### 4. Set up Google OAuth (optional)

1. Go to https://console.cloud.google.com and create a project
2. Enable the Google OAuth API
3. Create OAuth credentials (Web application type)
4. Add redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret
6. In your Supabase dashboard, go to Authentication > Providers
7. Enable Google and paste the Client ID and Secret

### 5. Start development

```bash
npm run dev
```

This starts both:
- The Next.js frontend at http://localhost:3000
- The agent worker at http://localhost:3001

### 6. Log in

Open http://localhost:3000 in your browser. You will see a login page. You can:
- Enter your email to receive a magic link
- Sign in with Google (if configured)
- After sign-in, a profile is created automatically

## Environment variables reference

```
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Redis (optional - for production)
REDIS_URL=redis://localhost:6379

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Weather API
WEATHER_API_KEY=your-openweathermap-api-key

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Production deployment

### Frontend (apps/web)

Deploy to Vercel:
1. Push your code to GitHub
2. Go to https://vercel.com and import the repo
3. Set root directory to `apps/web`
4. Add all environment variables
5. Deploy

### Agent Worker (apps/agent-worker)

Deploy to Railway:
1. Go to https://railway.app and create a new project
2. Connect your GitHub repo
3. Set root directory to `apps/agent-worker`
4. Set start command to `node dist/index.js`
5. Add all environment variables
6. Deploy

### Database

Use Supabase for managed PostgreSQL. Create a project and copy the connection string.
