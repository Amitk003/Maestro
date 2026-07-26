# Maestro

Every restaurant runs on the same playbook: a menu, a POS, a ticket printer, and a lot of yelling. You know the story. The kitchen gets slammed, tables sit dirty, ingredients spoil, and nobody knows anything until it is too late.

Maestro is not that playbook.

## What Maestro does

Maestro models your restaurant as a living digital twin. Six AI agents watch every part of your operation in real time -- tables, kitchen stations, inventory, staff, weather, local events -- and negotiate with each other to keep things running smoothly. Before a bottleneck forms, before a customer waits too long, before food goes bad, the agents act.

Your restaurant runs itself.

## What that looks like

**For customers.** A guest types "25 minutes, light dinner, pre-show" into their phone. Maestro's Guest Alchemist agent reads the intent, checks kitchen load, checks ingredient freshness, and returns a perfect meal sequence -- starter, main, drink, timing. The order routes itself to the right station. No QR code menu maze. No flagging down a waiter.

**For the kitchen.** Tickets appear on the correct station with prep timers. Kitchen Conductor watches every station's load. When Grill hits 90%, it routes some items to Saute or Cold Prep automatically. Chefs see what matters, not everything.

**For wait staff.** Staff Harmony generates a ranked feed of micro-tasks: clear table 7, check on table 4, take a break in 10 minutes. One tap to execute. No manager assigning tables by intuition.

**For managers and owners.** A live floorplan with every table color-coded by status. Station heatmaps. Real-time agent negotiation feed. A what-if simulator: "What if 40 guests show up during heavy rain?" Run it and see the agents respond before it happens. KPI trend charts for turnover, bottleneck, waste, guest delight, staff energy.

**For your bottom line.** Less waste. Faster tables. Happier guests. Staff that do not burn out.

## How it works

```
Customer types "25 min, light pre-show dinner"
       |
       v
Guest Alchemist parses intent
  -> checks kitchen load
  -> checks ingredient freshness
  -> returns personalized sequence
       |
       v
Kitchen Conductor routes order to correct station
       |
       v
Staff Harmony generates micro-tasks for service
       |
       v
Inventory Guardian watches for spoilage
       |
       v
Demand Seer adjusts forecasts based on weather + events
       |
       v
Orchestrator scores and resolves all proposals
       |
       v
Everything updates in real time via Socket.io
```

## What makes it different

Normal restaurant systems are reactive. A ticket prints, someone yells, you deal with it. Maestro is proactive. The agents do not wait for problems. They detect them forming and act -- rerouting orders, promoting soon-to-expire ingredients, adjusting staffing, sending recovery perks to unhappy guests.

It works without AI too. Every agent has a heuristic fallback engine. If Gemini is down, the rules engine takes over. Your restaurant never stops running.

## Tech

| Part | What we use |
|------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Real-time | Socket.io |
| AI reasoning | Google Gemini (with heuristic fallback) |
| Database | PostgreSQL (via Supabase) |
| Agent runtime | Dedicated Node.js worker |
| State store | Zustand (client), In-memory + Redis (server) |

## Quick start

```bash
npm install
cp .env.example .env
# Fill in your Supabase credentials and API keys
npm run dev
```

Frontend: http://localhost:3000
Agent worker: http://localhost:3001

## Project structure

```
apps/
  web/             # Customer, staff, and manager interfaces
  agent-worker/    # AI agents and digital twin engine
packages/
  shared/          # Shared types, Zod schemas, constants
docs/              # Setup and architecture documentation
```

## Learn more

See [docs/](docs/) for setup guides, architecture details, and agent descriptions.

Maestro is in active development. Production deployment instructions are in the setup guide.
