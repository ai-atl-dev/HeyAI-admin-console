
# BigQuery Implementation Guide

## API Endpoints to Create

### 1. Create Call Record

Create: `app/api/calls/create/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      call_id,
      caller_number,
      agent_id,
      status,
      duration,
      start_time,
      end_time,
      call_direction,
      from_number,
      to_number,
      recording_url,
      transcript,
      cost,
      region,
      metadata,
    } = body;

    // Validation
    if (!call_id || !agent_id || !status || !start_time) {
      return NextResponse.json(
        { error: "Missing required fields: call_id, agent_id, status, start_time" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Insert data
    const rows = [{
      call_id,
      caller_number: caller_number || null,
      agent_id,
      status,
      duration: duration || null,
      start_time: new Date(start_time).toISOString(),
      end_time: end_time ? new Date(end_time).toISOString() : null,
      created_at: new Date().toISOString(),
      call_direction: call_direction || null,
      from_number: from_number || null,
      to_number: to_number || null,
      recording_url: recording_url || null,
      transcript: transcript || null,
      cost: cost || null,
      region: region || null,
      metadata: metadata || null,
    }];

    await bigquery.dataset(DATASET).table('calls').insert(rows);

    return NextResponse.json({
      success: true,
      message: "Call record created successfully",
      call_id
    });
  } catch (error) {
    console.error("Error creating call record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create call record"
      },
      { status: 500 }
    );
  }
}
```

### 2. Update Call Record

Create: `app/api/calls/update/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { call_id, ...updates } = body;

    if (!call_id) {
      return NextResponse.json(
        { error: "call_id is required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Build update query dynamically
    const updateFields = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (value === null) return `${key} = NULL`;
        if (typeof value === 'string') return `${key} = '${value.replace(/'/g, "\\'")}'`;
        if (typeof value === 'number') return `${key} = ${value}`;
        if (typeof value === 'object') return `${key} = JSON '${JSON.stringify(value)}'`;
        return `${key} = '${value}'`;
      })
      .join(', ');

    if (!updateFields) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE \`${DATASET}.calls\`
      SET ${updateFields}
      WHERE call_id = '${call_id}'
    `;

    await bigquery.query({ query });

    return NextResponse.json({
      success: true,
      message: "Call record updated successfully"
    });
  } catch (error) {
    console.error("Error updating call record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update call record"
      },
      { status: 500 }
    );
  }
}
```

### 3. Create/Update Agent

Create: `app/api/agents/upsert/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      agent_id,
      agent_name,
      status,
      voice_model,
      language,
      max_concurrent_calls,
      config,
    } = body;

    if (!agent_id || !agent_name) {
      return NextResponse.json(
        { error: "agent_id and agent_name are required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Check if agent exists
    const [existingRows] = await bigquery.query({
      query: `SELECT agent_id FROM \`${DATASET}.agents\` WHERE agent_id = '${agent_id}'`,
    });

    const now = new Date().toISOString();

    if (existingRows.length > 0) {
      // Update existing agent
      const query = `
        UPDATE \`${DATASET}.agents\`
        SET
          agent_name = '${agent_name}',
          status = '${status || 'active'}',
          updated_at = TIMESTAMP('${now}'),
          ${voice_model ? `voice_model = '${voice_model}',` : ''}
          ${language ? `language = '${language}',` : ''}
          ${max_concurrent_calls ? `max_concurrent_calls = ${max_concurrent_calls},` : ''}
          ${config ? `config = JSON '${JSON.stringify(config)}'` : 'config = NULL'}
        WHERE agent_id = '${agent_id}'
      `;
      await bigquery.query({ query });
    } else {
      // Insert new agent
      const rows = [{
        agent_id,
        agent_name,
        status: status || 'active',
        created_at: now,
        updated_at: now,
        voice_model: voice_model || null,
        language: language || 'en-US',
        max_concurrent_calls: max_concurrent_calls || 1,
        total_calls: 0,
        total_minutes: 0.0,
        average_rating: null,
        config: config || null,
      }];
      await bigquery.dataset(DATASET).table('agents').insert(rows);
    }

    return NextResponse.json({
      success: true,
      message: "Agent record saved successfully"
    });
  } catch (error) {
    console.error("Error saving agent:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save agent"
      },
      { status: 500 }
    );
  }
}
```

### 4. Live Call Tracking

Create: `app/api/calls/live/update/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      call_id,
      agent_id,
      caller_number,
      status,
      start_time,
      current_duration,
      sentiment_score,
      current_topic,
      metadata,
    } = body;

    if (!call_id || !agent_id || !start_time) {
      return NextResponse.json(
        { error: "call_id, agent_id, and start_time are required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Check if live call record exists
    const [existingRows] = await bigquery.query({
      query: `SELECT call_id FROM \`${DATASET}.live_calls\` WHERE call_id = '${call_id}'`,
    });

    const now = new Date().toISOString();

    if (existingRows.length > 0) {
      // Update existing live call
      const query = `
        UPDATE \`${DATASET}.live_calls\`
        SET
          status = '${status || 'active'}',
          last_updated = TIMESTAMP('${now}'),
          current_duration = ${current_duration || 0},
          ${sentiment_score !== undefined ? `sentiment_score = ${sentiment_score},` : ''}
          ${current_topic ? `current_topic = '${current_topic}',` : ''}
          ${metadata ? `metadata = JSON '${JSON.stringify(metadata)}'` : 'metadata = NULL'}
        WHERE call_id = '${call_id}'
      `.replace(/,\s*WHERE/, ' WHERE'); // Remove trailing comma before WHERE

      await bigquery.query({ query });
    } else {
      // Insert new live call
      const rows = [{
        call_id,
        agent_id,
        caller_number: caller_number || null,
        status: status || 'active',
        start_time: new Date(start_time).toISOString(),
        last_updated: now,
        current_duration: current_duration || 0,
        sentiment_score: sentiment_score || null,
        current_topic: current_topic || null,
        metadata: metadata || null,
      }];
      await bigquery.dataset(DATASET).table('live_calls').insert(rows);
    }

    return NextResponse.json({
      success: true,
      message: "Live call record updated successfully"
    });
  } catch (error) {
    console.error("Error updating live call:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update live call"
      },
      { status: 500 }
    );
  }
}
```

Create: `app/api/calls/live/end/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { call_id } = body;

    if (!call_id) {
      return NextResponse.json(
        { error: "call_id is required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Delete from live_calls when call ends
    const query = `
      DELETE FROM \`${DATASET}.live_calls\`
      WHERE call_id = '${call_id}'
    `;

    await bigquery.query({ query });

    return NextResponse.json({
      success: true,
      message: "Live call ended and removed from tracking"
    });
  } catch (error) {
    console.error("Error ending live call:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to end live call"
      },
      { status: 500 }
    );
  }
}
```

### 5. Get Live Calls

Create: `app/api/calls/live/route.ts`

```typescript
import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function GET() {
  try {
    const bigquery = getBigQueryClient();

    const [rows] = await bigquery.query({
      query: `
        SELECT
          lc.call_id,
          lc.agent_id,
          lc.caller_number,
          lc.status,
          lc.start_time,
          lc.current_duration,
          lc.sentiment_score,
          lc.current_topic,
          a.agent_name
        FROM \`${DATASET}.live_calls\` lc
        LEFT JOIN \`${DATASET}.agents\` a ON lc.agent_id = a.agent_id
        WHERE lc.status = 'active'
        ORDER BY lc.start_time DESC
      `,
    });

    return NextResponse.json({
      success: true,
      live_calls: rows,
      count: rows.length
    });
  } catch (error) {
    console.error("Error fetching live calls:", error);
    return NextResponse.json(
      {
        success: false,
        live_calls: [],
        count: 0,
        error: error instanceof Error ? error.message : "Failed to fetch live calls"
      },
      { status: 500 }
    );
  }
}
```

## Usage Examples

### Example 1: Recording a New Call

```typescript
// When a call starts
await fetch('/api/calls/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: 'call_123456',
    caller_number: '+1234567890',
    agent_id: 'agent_001',
    status: 'in-progress',
    start_time: new Date().toISOString(),
    call_direction: 'inbound',
    from_number: '+1234567890',
    to_number: '+0987654321',
  })
});

// Track it live
await fetch('/api/calls/live/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: 'call_123456',
    agent_id: 'agent_001',
    caller_number: '+1234567890',
    status: 'active',
    start_time: new Date().toISOString(),
    current_duration: 0,
  })
});
```

### Example 2: Updating Call During Progress

```typescript
// Update call every 5 seconds with current status
await fetch('/api/calls/live/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: 'call_123456',
    agent_id: 'agent_001',
    status: 'active',
    start_time: callStartTime,
    current_duration: 125, // seconds
    sentiment_score: 0.75,
    current_topic: 'Product inquiry',
  })
});
```

### Example 3: Ending a Call

```typescript
// When call ends
const endTime = new Date();
const duration = Math.floor((endTime - startTime) / 1000);

// Update the main call record
await fetch('/api/calls/update', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: 'call_123456',
    status: 'completed',
    duration: duration,
    end_time: endTime.toISOString(),
    recording_url: 'https://...',
    transcript: 'Full call transcript here...',
    cost: 0.25,
  })
});

// Remove from live tracking
await fetch('/api/calls/live/end', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    call_id: 'call_123456',
  })
});
```

### Example 4: Creating an Agent

```typescript
await fetch('/api/agents/upsert', {
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
      expertise: ['product_support', 'billing']
    }
  })
});
```
