# 🎙️ HeyAI - Give Voice to Your AI Agents

> **Transform your AI agents into voice-powered assistants that people can actually call.**

HeyAI is a complete voice API platform that gives your AI agents a phone number and a voice. Users can call your AI, have natural conversations, and get tasks done - all through a simple phone call.

---

## 🤔 What Problem Does HeyAI Solve?

Imagine you have a powerful AI agent that can:
- Schedule appointments
- Answer customer support questions
- Process orders
- Provide information

**The Problem**: Users can only interact with it through text (chat, website forms, etc.)

**The Solution**: HeyAI gives your AI agent:
- ☎️ A real phone number people can call
- 🗣️ A natural voice to speak with
- 🎧 Ability to understand spoken language
- 📊 Analytics and monitoring dashboard

---

## 🎯 How It Works (Simple Overview)

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Person    │─────▶│   HeyAI      │─────▶│  Your AI    │─────▶│   Action     │
│  📱 Calls   │      │  Voice API   │      │   Agent     │      │  ✅ Done     │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
                           │
                           ▼
                     ┌──────────────┐
                     │  Dashboard   │
                     │  📊 Monitor  │
                     └──────────────┘
```

1. **User calls** your AI's phone number
2. **HeyAI receives** the call and transcribes speech to text
3. **Your AI agent** processes the request
4. **HeyAI converts** AI's response to voice
5. **User hears** the response naturally
6. **You monitor** everything from the dashboard

---

## ✨ Key Features

### 🎨 Beautiful Landing Page
- **3D Particle System**: Stunning WebGL-powered background with 60fps animations
- **Siri-like Voice Animation**: Real-time audio waveform visualization
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🛠️ Powerful Admin Dashboard
- **📱 Agent Management**: Create and configure multiple AI voice agents
- **📊 Live Call Monitoring**: See active calls in real-time
- **📈 Usage Analytics**: Track calls, duration, costs, and success rates
- **💰 Payment Dashboard**: Monitor spending and billing
- **📜 Call History**: Complete audit trail of all interactions

### 🔌 API Integration
- **RESTful APIs**: Easy integration with any AI model (OpenAI, Anthropic, Google, etc.)
- **Real-time Updates**: Live call status and monitoring
- **BigQuery Backend**: Scalable data storage and analytics

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HeyAI Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌─────────────────┐             │
│  │   Frontend   │◀────────│   API Routes    │             │
│  │  (Next.js)   │         │  (Next.js API)  │             │
│  └──────────────┘         └─────────────────┘             │
│         │                          │                       │
│         │                          ▼                       │
│         │                  ┌──────────────┐               │
│         │                  │  BigQuery DB │               │
│         │                  │  (Analytics) │               │
│         │                  └──────────────┘               │
│         │                                                  │
│  ┌──────▼──────────────────────────────────────┐         │
│  │         Voice Processing Layer              │         │
│  │  • Speech-to-Text (Transcription)          │         │
│  │  • Text-to-Speech (Voice Synthesis)        │         │
│  │  • Call Routing & Management               │         │
│  └─────────────────────────────────────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: React Hooks

#### Backend & Data
- **API**: Next.js API Routes (serverless)
- **Database**: Google BigQuery (scalable analytics)
- **Authentication**: Built-in session management
- **Real-time**: Server-Sent Events (SSE) for live updates

#### Voice Infrastructure
- **Speech-to-Text**: Voice transcription engine
- **Text-to-Speech**: Natural voice synthesis
- **Call Routing**: Telephony integration

### Database Schema

HeyAI uses **Google BigQuery** for scalable data storage:

**Tables:**
- `agents` - AI agent configurations
- `calls` - Call records and transcripts
- `live_calls` - Active call monitoring
- `usage_history` - Daily usage aggregates

See `bigquery_schema.sql` for complete schema.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Google Cloud account (for BigQuery)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/heyai-admin-console.git
cd heyai-admin-console
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up BigQuery

#### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "heyai-backend")
3. Enable BigQuery API

#### Create a Service Account

1. Go to IAM & Admin → Service Accounts
2. Create a new service account
3. Grant role: **BigQuery Admin**
4. Create and download JSON key

#### Create BigQuery Dataset and Tables

1. Open BigQuery in Google Cloud Console
2. Create a dataset named `agent_data`
3. Run the SQL in `bigquery_schema.sql` to create tables

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# API Security
API_SECRET_KEY=your-secret-key-here

# BigQuery Configuration
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_DATASET=agent_data
BIGQUERY_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}
```

**Important**:
- Replace `your-project-id` with your Google Cloud project ID
- Paste the entire JSON content from your service account key into `BIGQUERY_CREDENTIALS`

### 5. Test BigQuery Connection

```bash
node test-bigquery.js
```

You should see:
```
✅ BigQuery connection test completed successfully!
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### Adding Your First AI Agent

1. Navigate to **Admin Console** (click button in top-right)
2. Go to **Add Agent** page
3. Fill in the form:
   - **Agent Name**: e.g., "Customer Support Bot"
   - **Provider**: e.g., "OpenAI" or "Anthropic"
   - **API Key**: Your AI provider's API key
4. Click **[Add Agent]**

Your agent is now saved to BigQuery and ready to use!

### Viewing Active Agents

1. Go to **Existing Agents** page
2. See all your configured agents
3. **Actions**:
   - **Activate/Deactivate**: Toggle agent status
   - **Delete**: Remove an agent

### Monitoring Calls

#### Live Calls Dashboard
- Go to **Live** page
- See real-time active calls
- Monitor call duration and status

#### Call History
- Go to **Usage History** page
- View complete call records
- See duration, cost, status for each call

#### Analytics Dashboard
- Go to **Dashboard** page
- View key metrics:
  - Total calls
  - Active agents
  - Total minutes
  - Success rate
  - Average duration

### Managing Payments

- Go to **Payment** page
- View total spending on calls
- Add funds to your account (coming soon)

---

## 🔌 API Documentation

### Agent Management

#### Create or Update Agent
```http
POST /api/agents/upsert
Content-Type: application/json

{
  "agent_id": "agent_123",
  "agent_name": "Support Bot",
  "status": "active",
  "voice_model": "OpenAI",
  "language": "en-US",
  "max_concurrent_calls": 5,
  "config": {
    "api_key": "sk-...",
    "provider": "OpenAI"
  }
}
```

#### Get All Agents
```http
GET /api/agents
```

#### Delete Agent
```http
DELETE /api/agents?agent_id=agent_123
```

### Call Management

#### Get Call History
```http
GET /api/calls/history?limit=50&offset=0
```

#### Get Live Calls
```http
GET /api/calls/live
```

### Dashboard Stats

#### Get Statistics
```http
GET /api/dashboard/stats
```

#### Get Recent Activity
```http
GET /api/dashboard/recent-activity
```

#### Get Quick Stats
```http
GET /api/dashboard/quick-stats
```

---

## 🎨 Design System

### Colors
- **Primary**: Yellow (`#FACC15`) - Action buttons, accents
- **Background**: Black (`#000000`) - Dark theme
- **Foreground**: White (`#FFFFFF`) - Text
- **Success**: Green - Completed calls
- **Error**: Red - Failed calls
- **Warning**: Yellow - In-progress calls

### Typography
- **Headings**: Sentient (custom font)
- **Body**: Inter
- **Code/Mono**: Geist Mono

---

## 📁 Project Structure

```
heyai-admin-console/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── admin/
│   │   ├── dashboard/              # Analytics dashboard
│   │   ├── add-agent/              # Create new agents
│   │   ├── existing-agents/        # Manage agents
│   │   ├── live/                   # Live call monitoring
│   │   ├── usage-history/          # Call history
│   │   └── payment/                # Billing
│   └── api/
│       ├── agents/                 # Agent CRUD APIs
│       ├── calls/                  # Call management APIs
│       └── dashboard/              # Analytics APIs
├── components/
│   ├── gl/                         # 3D graphics engine
│   ├── siri-animation.tsx          # Voice visualization
│   ├── ui/                         # Reusable UI components
│   └── ...
├── lib/
│   └── bigquery.ts                 # BigQuery client
├── types/
│   └── dashboard.ts                # TypeScript types
└── bigquery_schema.sql             # Database schema
```

---

## 🧪 Development & Testing

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Test BigQuery Connection
```bash
node test-bigquery.js
```

### Linting
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### BigQuery "Streaming Buffer" Error

**Error**: `UPDATE or DELETE statement over table would affect rows in the streaming buffer`

**Solution**: This happens when trying to update recently inserted data. Wait 10-30 minutes for BigQuery to flush the buffer, or delete and re-add the agent.

### Environment Variables Not Loading

**Solution**:
1. Make sure `.env` file is in the project root
2. Restart the development server
3. Check that variables don't have quotes around them

### Can't Connect to BigQuery

**Solution**:
1. Verify service account has BigQuery Admin role
2. Check that `BIGQUERY_CREDENTIALS` contains valid JSON
3. Run `node test-bigquery.js` to diagnose

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Set these in your hosting platform:
- `API_SECRET_KEY`
- `BIGQUERY_PROJECT_ID`
- `BIGQUERY_DATASET`
- `BIGQUERY_CREDENTIALS`

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

Need help? Have questions?

- **Issues**: [GitHub Issues](https://github.com/your-username/heyai/issues)
- **Documentation**: See this README
- **Email**: support@heyai.com

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- 3D graphics powered by [Three.js](https://threejs.org/)
- Analytics by [Google BigQuery](https://cloud.google.com/bigquery)

---

**Made with ❤️ by the HeyAI Team**