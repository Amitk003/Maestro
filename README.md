# Maestro

**Your restaurant runs itself.**

Maestro is a restaurant operating system that thinks ahead. While other systems just show you what is happening right now, Maestro predicts what is going to happen next - and acts before you have to.

## What makes Maestro different?

**Normal restaurant software:**
- A menu QR code so customers can order
- A screen in the kitchen that shows orders
- A dashboard with yesterday's sales numbers
- You have to figure out the rest yourself

**Maestro:**
- Customers describe what they feel like eating - Maestro crafts the perfect meal for them
- The kitchen gets orders routed to the right station automatically - no bottlenecks
- Inventory knows what is going bad and suggests how to use it up
- Staff get told what to do and when - no standing around wondering
- The manager sees the whole restaurant as a living map with live heatmaps

## What you get

**For customers**
Tell Maestro how you feel and what you have time for. It builds a personal dining plan and tells you exactly when your food will arrive. No guessing.

**For the kitchen**
Orders show up on the right station with prep details. If one station gets busy, orders move to another station automatically. You only see what matters to you.

**For wait staff**
A ranked list of what to do next. Move this table. Check on that table. Take a break when it is slow. No manager yelling across the room.

**For managers and owners**
A live map of your restaurant showing every table, every kitchen station, and every staff member. Click anything to see details. Run "what if" scenarios. Watch the AI agents negotiate in real time.

## Tech stack

| Part | What we use |
|------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Real-time | Socket.io |
| AI | Google Gemini (for reasoning + fast classification) |
| Database | PostgreSQL (via Supabase) |
| Cache | Redis |
| Agent runtime | Dedicated Node.js worker |

## Quick start

```bash
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

Frontend runs on http://localhost:3000.
Agent worker runs on http://localhost:3001.

## Project structure

```
apps/
  web/           # Customer, staff, and manager interfaces
  agent-worker/  # AI agents and digital twin engine
packages/
  shared/        # Shared types, validation schemas, constants
docs/            # Documentation
```

## Documentation

See the [docs](docs/) folder for setup guides, architecture details, and agent descriptions.
