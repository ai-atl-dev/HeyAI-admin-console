# BigQuery API Usage Examples

This guide shows you how to use the API endpoints to save data to BigQuery from your application.

## 🎯 Quick Overview

You now have these endpoints:
- `POST /api/calls/create` - Create a new call record
- `PATCH /api/calls/update` - Update an existing call
- `POST /api/agents/upsert` - Create or update an agent
- `POST /api/calls/live/update` - Track a live call
- `POST /api/calls/live/end` - End a live call
- `GET /api/calls/live` - Get all active calls

## 📞 Complete Call Lifecycle Example

### Step 1: When a Call Starts

When a user initiates or receives a call, create the call record AND start tracking it live:

```typescript
// Example: User calls your AI agent
const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const startTime = new Date().toISOString();

// 1. Create the call record in the main calls table
const createResponse = await fetch('/api/calls/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: callId,
    caller_number: '+1234567890',
    agent_id: 'agent_001',
    status: 'in-progress',
    start_time: startTime,
    call_direction: 'inbound',
    from_number: '+1234567890',
    to_number: '+0987654321',
  })
});

const createData = await createResponse.json();
console.log(createData); // { success: true, message: "...", call_id: "..." }

// 2. Start tracking it as a live call
const liveResponse = await fetch('/api/calls/live/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: callId,
    agent_id: 'agent_001',
    caller_number: '+1234567890',
    status: 'active',
    start_time: startTime,
    current_duration: 0,
  })
});
```

### Step 2: During the Call (Update Every 5-10 Seconds)

Update the live call status with current duration and sentiment:

```typescript
// Set up an interval to update every 5 seconds
const updateInterval = setInterval(async () => {
  const currentDuration = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);

  await fetch('/api/calls/live/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call_id: callId,
      agent_id: 'agent_001',
      status: 'active',
      start_time: startTime,
      current_duration: currentDuration,
      sentiment_score: 0.75, // Optional: from sentiment analysis
      current_topic: 'Product inquiry', // Optional: what's being discussed
    })
  });
}, 5000); // Update every 5 seconds
```

### Step 3: When the Call Ends

Update the final call details and remove from live tracking:

```typescript
// Stop the update interval
clearInterval(updateInterval);

const endTime = new Date();
const duration = Math.floor((endTime.getTime() - new Date(startTime).getTime()) / 1000);

// 1. Update the main call record with final data
await fetch('/api/calls/update', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: callId,
    status: 'completed',
    duration: duration,
    end_time: endTime.toISOString(),
    recording_url: 'https://your-storage.com/recordings/call_123.mp3', // Optional
    transcript: 'Full transcript of the conversation...', // Optional
    cost: 0.25, // Optional: cost in USD
  })
});

// 2. Remove from live tracking
await fetch('/api/calls/live/end', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: callId,
  })
});

console.log('Call ended and saved successfully!');
```

## 🤖 Creating Agents

Before you can create calls, you need at least one agent:

```typescript
// Create a new agent
const response = await fetch('/api/agents/upsert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent_id: 'agent_001',
    agent_name: 'Customer Support Agent',
    status: 'active',
    voice_model: 'eleven_labs_v2',
    language: 'en-US',
    max_concurrent_calls: 5,
    config: {
      greeting: 'Hello! How can I help you today?',
      tone: 'friendly',
      expertise: ['product_support', 'billing', 'technical']
    }
  })
});

const data = await response.json();
console.log(data); // { success: true, message: "Agent created successfully", agent_id: "agent_001" }
```

## 📊 Displaying Live Calls

Fetch and display active calls on your live monitor page:

```typescript
// In your Live Monitor component
const fetchLiveCalls = async () => {
  const response = await fetch('/api/calls/live');
  const data = await response.json();

  if (data.success) {
    console.log(`Active calls: ${data.count}`);
    console.log(data.live_calls);
    // Update your UI with live_calls array
  }
};

// Fetch every 3 seconds for real-time updates
useEffect(() => {
  fetchLiveCalls();
  const interval = setInterval(fetchLiveCalls, 3000);
  return () => clearInterval(interval);
}, []);
```

## 🔗 Integration with Voice Providers

### Example: Twilio Webhook Integration

When you receive a webhook from Twilio:

```typescript
// app/api/webhooks/twilio/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const callSid = formData.get('CallSid') as string;
  const from = formData.get('From') as string;
  const to = formData.get('To') as string;
  const callStatus = formData.get('CallStatus') as string;
  const duration = formData.get('CallDuration') as string;

  // Map Twilio status to your status
  const status = callStatus === 'completed' ? 'completed' :
                 callStatus === 'in-progress' ? 'in-progress' : 'failed';

  if (callStatus === 'ringing') {
    // Create new call when ringing
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callSid,
        caller_number: from,
        agent_id: 'agent_001', // Your agent ID
        status: 'in-progress',
        start_time: new Date().toISOString(),
        call_direction: 'inbound',
        from_number: from,
        to_number: to,
      })
    });

    // Track as live
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/live/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callSid,
        agent_id: 'agent_001',
        caller_number: from,
        status: 'active',
        start_time: new Date().toISOString(),
        current_duration: 0,
      })
    });
  } else if (callStatus === 'completed') {
    // Update call when completed
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callSid,
        status: 'completed',
        duration: parseInt(duration || '0'),
        end_time: new Date().toISOString(),
      })
    });

    // Remove from live tracking
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/live/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callSid,
      })
    });
  }

  return NextResponse.json({ success: true });
}
```

### Example: Vapi.ai Webhook Integration

```typescript
// app/api/webhooks/vapi/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const eventType = body.type; // 'call.started', 'call.ended', etc.
  const callData = body.call;

  if (eventType === 'call.started') {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callData.id,
        caller_number: callData.customer?.number,
        agent_id: callData.assistantId || 'agent_001',
        status: 'in-progress',
        start_time: callData.startedAt,
        call_direction: callData.type, // 'inbound' or 'outbound'
      })
    });

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/live/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callData.id,
        agent_id: callData.assistantId || 'agent_001',
        caller_number: callData.customer?.number,
        status: 'active',
        start_time: callData.startedAt,
        current_duration: 0,
      })
    });
  } else if (eventType === 'call.ended') {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callData.id,
        status: callData.endedReason === 'hangup' ? 'completed' : 'failed',
        duration: callData.duration,
        end_time: callData.endedAt,
        transcript: callData.transcript,
        recording_url: callData.recordingUrl,
        cost: callData.cost,
      })
    });

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/calls/live/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call_id: callData.id,
      })
    });
  }

  return NextResponse.json({ success: true });
}
```

## 🔒 Adding API Key Protection (Optional but Recommended)

To secure your endpoints, add API key validation:

```typescript
// lib/auth.ts
export function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.API_SECRET_KEY;
}

// Then in your route:
import { validateApiKey } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  // ... rest of your code
}
```

Add `API_SECRET_KEY` to your environment variables in Vercel.

## 🧪 Testing Your Endpoints

### Test with cURL:

```bash
# Create a call
curl -X POST http://localhost:3000/api/calls/create \
  -H "Content-Type: application/json" \
  -d '{
    "call_id": "test_call_001",
    "caller_number": "+1234567890",
    "agent_id": "agent_001",
    "status": "completed",
    "duration": 120,
    "start_time": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'

# Create an agent
curl -X POST http://localhost:3000/api/agents/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_001",
    "agent_name": "Test Agent",
    "status": "active"
  }'

# Get live calls
curl http://localhost:3000/api/calls/live
```

### Test with JavaScript/TypeScript:

```typescript
// test.ts
async function testAPI() {
  // 1. Create agent
  console.log('Creating agent...');
  const agentRes = await fetch('http://localhost:3000/api/agents/upsert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: 'agent_test',
      agent_name: 'Test Support Agent',
      status: 'active',
    })
  });
  console.log(await agentRes.json());

  // 2. Create call
  console.log('Creating call...');
  const callRes = await fetch('http://localhost:3000/api/calls/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call_id: 'test_' + Date.now(),
      caller_number: '+1234567890',
      agent_id: 'agent_test',
      status: 'in-progress',
      start_time: new Date().toISOString(),
    })
  });
  console.log(await callRes.json());

  console.log('Test completed!');
}

testAPI();
```

## 📈 Next Steps

1. **Set up webhooks** from your voice provider (Twilio, Vapi, etc.)
2. **Test the flow** end-to-end with a real call
3. **Monitor your dashboard** to see data appear in real-time
4. **Add authentication** to protect your endpoints
5. **Customize** the data you're collecting based on your needs

Your BigQuery integration is now complete and ready to save data!
