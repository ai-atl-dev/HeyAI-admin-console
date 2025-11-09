# HeyAI Admin Console

![Architecture](architecture.png)

Voice-enabled AI assistant management platform. This admin console provides a comprehensive dashboard for managing AI agents, monitoring live calls, viewing analytics, and tracking usage for the HeyAI voice API platform.

## Overview

HeyAI Admin Console is a Next.js-based web application that serves as the control center for managing voice-enabled AI agents. Users can create agents, monitor active calls in real-time, view detailed analytics, and manage billing through an intuitive interface.

## Architecture

The system integrates multiple components to provide a complete voice AI management solution:

### System Flow

1. **User Management**: Admin creates and configures AI agents through the web interface
2. **Call Routing**: Twilio routes incoming calls to the appropriate agent based on phone number
3. **Backend Processing**: Go server handles call orchestration, speech processing, and AI inference
4. **Real-time Monitoring**: Dashboard displays live call metrics and agent status
5. **Data Storage**: BigQuery stores call logs, agent configurations, and analytics data
6. **Analytics**: Dashboard aggregates and visualizes usage patterns and performance metrics

### Component Integration

```
Admin Console (Next.js) ↔ BigQuery ↔ Dashboard Backend
                                ↓
                         Analytics & Logs
                                ↓
                    HeyAI Backend (Go) ↔ External AI Agents
                                ↓
                         Twilio Voice API
                                ↓
                            End Users
```

## Technology Stack

### Frontend Framework

- **Next.js 15**: React framework with App Router for server-side rendering and API routes
- **TypeScript**: Type-safe development with full IDE support
- **Tailwind CSS v4**: Utility-first CSS framework for responsive design
- **React 19**: Latest React features including Server Components

### UI Components

- **Radix UI**: Accessible, unstyled component primitives
- **Lucide Icons**: Modern icon library
- **Recharts**: Composable charting library for analytics visualization
- **Three.js + React Three Fiber**: 3D graphics for landing page animations

### Backend & Data

- **Next.js API Routes**: Serverless API endpoints
- **Google BigQuery**: Scalable data warehouse for analytics
- **Google Cloud SDK**: BigQuery client library
- **Server-Sent Events**: Real-time updates for live monitoring

### Development Tools

- **ESLint**: Code linting and quality checks
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing and optimization

## Features

### Implemented

- Agent management (create, update, delete, activate/deactivate)
- Real-time live user tracking per agent
- Dashboard with key metrics and analytics
- Call history and usage tracking
- Payment and billing overview
- Responsive design for all screen sizes
- Dark theme UI with modern aesthetics
- BigQuery integration for data persistence
- Live call monitoring with 5-second polling
- Per-agent active user counts
- 3D particle system landing page
- Siri-like voice animation

### Planned

- WebSocket integration for instant updates
- Advanced filtering and search in call history
- Export functionality for reports
- Multi-user authentication and roles
- Custom agent voice selection
- Call recording playback
- Real-time transcription display
- Cost optimization recommendations

## Configuration

### Environment Variables

Required environment variables for production:

```bash
# BigQuery Configuration
BIGQUERY_PROJECT_ID=heyai-backend
BIGQUERY_DATASET=agent_data
BIGQUERY_CREDENTIALS={"type":"service_account",...}

# Backend Integration
BACKEND_URL=https://heyai-backend-127756525541.us-central1.run.app

# API Security (optional)
API_SECRET_KEY=your-secret-key
```

### BigQuery Setup

1. **Create Google Cloud Project**:
   - Project ID: heyai-backend
   - Enable BigQuery API

2. **Create Service Account**:
   - Role: BigQuery Admin
   - Download JSON key file

3. **Create Dataset**:
   - Dataset name: agent_data
   - Location: us-central1

4. **Create Tables**:
   Run the SQL schema from `bigquery_schema.sql`:
   - `agents` - Agent configurations
   - `calls` - Call records and transcripts
   - `live_calls` - Active call monitoring
   - `usage_history` - Daily usage aggregates

### Service Account Credentials

Format the service account JSON as a single-line string for the `BIGQUERY_CREDENTIALS` environment variable. Use the provided `format-credentials.js` script:

```bash
node format-credentials.js service-account-key.json
```

Copy the output and set it as the environment variable value in your deployment platform.

## Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Import project from GitHub
   - Select the HeyAI-admin-console directory

2. **Configure Environment Variables**:
   - Add all required variables in Vercel dashboard
   - Ensure `BIGQUERY_CREDENTIALS` is properly formatted
   - Select all environments (Production, Preview, Development)

3. **Deploy**:
   - Vercel automatically builds and deploys
   - Access via provided URL

### Build Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## API Endpoints

### Agent Management

**GET /api/agents**
- Retrieves all agents from BigQuery
- Returns agent configurations and metadata

**POST /api/agents/upsert**
- Creates or updates an agent
- Accepts agent configuration in request body

**DELETE /api/agents?agent_id={id}**
- Removes an agent from the system
- Note: May fail if agent has recent calls (streaming buffer)

### Live Monitoring

**GET /api/live-users**
- Returns total live users and per-agent breakdown
- Polls backend every 5 seconds for updates
- Response format: `{liveUsers: number, byAgent: Record<string, number>}`

### Dashboard Analytics

**GET /api/dashboard/stats**
- Total calls, active agents, total minutes, revenue

**GET /api/dashboard/quick-stats**
- Success rate, average duration, agent utilization

**GET /api/dashboard/recent-activity**
- Last 10 calls with details

### Call Management

**GET /api/calls/history**
- Paginated call history
- Query params: limit, offset

**GET /api/calls/live**
- Currently active calls

## Development

### Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create Environment File**:
   ```bash
   cp .env.local.example .env.local
   ```

3. **Configure Variables**:
   Edit `.env.local` with your credentials

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Application**:
   Open http://localhost:3000

### Project Structure

```
HeyAI-admin-console/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── admin/
│   │   ├── dashboard/              # Analytics dashboard
│   │   ├── add-agent/              # Agent creation
│   │   ├── existing-agents/        # Agent management
│   │   ├── payment/                # Billing overview
│   │   └── layout.tsx              # Admin layout with sidebar
│   └── api/
│       ├── agents/                 # Agent CRUD operations
│       ├── live-users/             # Live user tracking
│       └── dashboard/              # Analytics endpoints
├── components/
│   ├── admin-sidebar.tsx           # Navigation sidebar
│   ├── siri-animation.tsx          # Voice visualization
│   ├── gl/                         # 3D graphics components
│   └── ui/                         # Reusable UI components
├── lib/
│   └── bigquery.ts                 # BigQuery client initialization
├── types/
│   └── dashboard.ts                # TypeScript type definitions
└── public/
    └── architecture.png            # System architecture diagram
```

### Key Components

- **AdminSidebar**: Navigation component with workspace and management sections
- **Dashboard**: Analytics overview with charts and metrics
- **ExistingAgents**: Agent list with live user counts and management actions
- **AddAgent**: Form for creating new agents
- **SiriAnimation**: Real-time audio waveform visualization

## Integration Points

### Backend Integration

The admin console communicates with the HeyAI Go backend for live user tracking:

- Endpoint: `/api/live-users`
- Method: GET
- Response: `{liveUsers: number, byAgent: {[agentId]: count}}`
- Polling: Every 5 seconds

### BigQuery Integration

All persistent data is stored in BigQuery:

- Agent configurations
- Call records and transcripts
- Usage metrics and analytics
- Billing information

The `getBigQueryClient()` function in `lib/bigquery.ts` handles connection management and credential parsing.

## Performance

- Server-side rendering for fast initial page loads
- Client-side navigation for instant page transitions
- Optimized BigQuery queries with proper indexing
- Lazy loading for 3D graphics components
- Efficient polling with 5-second intervals
- Caching strategies for static assets

## Security

- Service account credentials stored in environment variables
- API routes protected with proper error handling
- Input validation on all forms
- Secure BigQuery connections with service account authentication
- CORS configuration for API endpoints
- No sensitive data exposed in client-side code

## Troubleshooting

### BigQuery Connection Issues

If you see "Failed to initialize BigQuery client" errors:

1. Verify `BIGQUERY_CREDENTIALS` is valid JSON
2. Check service account has BigQuery Admin role
3. Ensure dataset and tables exist
4. Run validation script: `node validate-env.js`

### Streaming Buffer Errors

When deleting recently added agents:

- Error: "Cannot delete recently added agent"
- Cause: BigQuery streaming buffer (90-minute window)
- Solution: Wait a few minutes and retry

### Live Users Not Updating

If live user counts aren't updating:

1. Check backend is running and accessible
2. Verify `BACKEND_URL` environment variable
3. Check browser console for API errors
4. Ensure backend `/api/live-users` endpoint is working

## License

MIT License

## Support

For issues and questions, please open an issue in the repository or contact the development team.
