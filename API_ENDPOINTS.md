# Dashboard API Endpoints Reference

## Overview

Three API endpoints power the admin dashboard, fetching real-time data from BigQuery.

## Endpoints

### 1. `/api/dashboard/stats`
HIHIHIHIHI
**Method:** GET

**Description:** Returns top-level statistics for the dashboard cards.

**Response:**
```typescript
{
  totalCalls: number;      // Total number of calls (all time)
  activeAgents: number;    // Distinct agents active today
  totalMinutes: number;    // Total call duration in minutes (all time)
  revenue: number;         // Total revenue from all calls
  error?: string;          // Error message if query fails
}
```

**Example Response:**
```json
{
  "totalCalls": 1523,
  "activeAgents": 12,
  "totalMinutes": 45678,
  "revenue": 2345.67
}
```

**BigQuery Queries:**
- Total Calls: `SELECT COUNT(*) FROM calls`
- Active Agents: `SELECT COUNT(DISTINCT agent_id) FROM calls WHERE DATE(start_time) = CURRENT_DATE()`
- Total Minutes: `SELECT SUM(duration) / 60 FROM calls`
- Revenue: `SELECT SUM(cost) FROM calls`

---

### 2. `/api/dashboard/recent-activity`

**Method:** GET

**Description:** Returns the 10 most recent calls for the activity feed.

**Response:**
```typescript
{
  calls: Array<{
    caller_number: string;   // Phone number of caller
    agent_id: string;        // ID of the agent handling the call
    status: string;          // Call status (e.g., "completed", "failed")
    duration: number;        // Call duration in seconds
    start_time: string;      // ISO timestamp of call start
  }>;
  error?: string;            // Error message if query fails
}
```

**Example Response:**
```json
{
  "calls": [
    {
      "caller_number": "+1234567890",
      "agent_id": "agent-001",
      "status": "completed",
      "duration": 180,
      "start_time": "2025-11-08T14:30:00Z"
    },
    {
      "caller_number": "+0987654321",
      "agent_id": "agent-002",
      "status": "completed",
      "duration": 245,
      "start_time": "2025-11-08T14:25:00Z"
    }
  ]
}
```

**BigQuery Query:**
```sql
SELECT caller_number, agent_id, status, duration, start_time
FROM `agent_data.calls`
ORDER BY start_time DESC
LIMIT 10
```

---

### 3. `/api/dashboard/quick-stats`

**Method:** GET

**Description:** Returns today's performance metrics for the quick stats panel.

**Response:**
```typescript
{
  successRate: number;        // Percentage of completed calls today (0-100)
  avgDuration: number;        // Average call duration in minutes today
  agentUtilization: number;   // Agent utilization percentage (0-100)
  error?: string;             // Error message if query fails
}
```

**Example Response:**
```json
{
  "successRate": 87.5,
  "avgDuration": 3.2,
  "agentUtilization": 12.5
}
```

**BigQuery Queries:**

**Success Rate:**
```sql
SELECT 
  COUNTIF(status = 'completed') as completed,
  COUNT(*) as total
FROM `agent_data.calls`
WHERE DATE(start_time) = CURRENT_DATE()
```
Calculation: `(completed / total) * 100`

**Average Duration:**
```sql
SELECT AVG(duration) / 60 as avg_minutes
FROM `agent_data.calls`
WHERE DATE(start_time) = CURRENT_DATE()
```

**Agent Utilization:**
```sql
SELECT COUNT(*) as calls_today
FROM `agent_data.calls`
WHERE DATE(start_time) = CURRENT_DATE()
```
Calculation: `(calls_today / 1440) * 100` (1440 = minutes in a day)

---

## Error Handling

All endpoints return a 500 status code with an error message if the query fails:

```json
{
  "totalCalls": 0,
  "activeAgents": 0,
  "totalMinutes": 0,
  "revenue": 0,
  "error": "Failed to initialize BigQuery client: Missing credentials"
}
```

Common errors:
- Missing environment variables
- Invalid BigQuery credentials
- Table not found
- Permission denied
- Network timeout

---

## Testing Endpoints

### Using cURL

```bash
# Test stats endpoint
curl http://localhost:3000/api/dashboard/stats

# Test recent activity
curl http://localhost:3000/api/dashboard/recent-activity

# Test quick stats
curl http://localhost:3000/api/dashboard/quick-stats
```

### Using Browser

Navigate to:
- http://localhost:3000/api/dashboard/stats
- http://localhost:3000/api/dashboard/recent-activity
- http://localhost:3000/api/dashboard/quick-stats

### Using Postman/Insomnia

Create GET requests to the endpoints above.

---

## Performance Considerations

### Caching

Consider adding caching to reduce BigQuery costs:

```typescript
// Example with Next.js cache
export const revalidate = 30; // Revalidate every 30 seconds

export async function GET() {
  // ... query logic
}
```

### Query Optimization

1. **Use partitioned tables** for better performance
2. **Add WHERE clauses** to limit data scanned
3. **Use LIMIT** to cap result sizes
4. **Cache results** on the client side

### Cost Monitoring

- Each query scans data and incurs costs
- Monitor usage in Google Cloud Console
- Set up billing alerts
- Consider query result caching

---

## Frontend Integration

The dashboard page fetches all three endpoints in parallel:

```typescript
const [statsRes, recentRes, quickRes] = await Promise.all([
  fetch("/api/dashboard/stats"),
  fetch("/api/dashboard/recent-activity"),
  fetch("/api/dashboard/quick-stats"),
]);
```

Auto-refresh every 30 seconds:
```typescript
const interval = setInterval(fetchDashboardData, 30000);
```

---

## Extending the API

### Adding New Endpoints

1. Create a new route file: `app/api/dashboard/[name]/route.ts`
2. Import BigQuery client: `import { getBigQueryClient, DATASET } from "@/lib/bigquery"`
3. Write your query
4. Return JSON response with `NextResponse.json()`
5. Add TypeScript types to `types/dashboard.ts`
6. Update dashboard page to fetch new endpoint

### Example: Adding a "Top Agents" Endpoint

```typescript
// app/api/dashboard/top-agents/route.ts
import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function GET() {
  try {
    const bigquery = getBigQueryClient();
    
    const [rows] = await bigquery.query({
      query: `
        SELECT 
          agent_id,
          COUNT(*) as call_count,
          AVG(duration) as avg_duration
        FROM \`${DATASET}.calls\`
        WHERE DATE(start_time) = CURRENT_DATE()
        GROUP BY agent_id
        ORDER BY call_count DESC
        LIMIT 5
      `,
    });

    return NextResponse.json({ agents: rows });
  } catch (error) {
    return NextResponse.json(
      { agents: [], error: error.message },
      { status: 500 }
    );
  }
}
```
