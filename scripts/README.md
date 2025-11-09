# BigQuery Data Seeding Scripts

Scripts to create tables and populate sample data in BigQuery for dashboard testing.

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install dotenv
   ```

2. **Set up environment variables:**
   Create `.env.local` with your BigQuery credentials:
   ```bash
   BIGQUERY_PROJECT_ID=heyai-backend
   BIGQUERY_DATASET=agent_data
   BIGQUERY_CREDENTIALS={"type":"service_account",...}
   ```

## Step 1: Create Tables

### Option A: Using BigQuery Console
1. Go to [BigQuery Console](https://console.cloud.google.com/bigquery)
2. Select your project: `heyai-backend`
3. Click "Compose New Query"
4. Copy and paste the SQL from `create-bigquery-tables.sql`
5. Click "Run"

### Option B: Using bq Command-Line Tool
```bash
bq query --use_legacy_sql=false < scripts/create-bigquery-tables.sql
```

## Step 2: Seed Sample Data

Run the Node.js seeding script:

```bash
node scripts/seed-bigquery.js
```

This will generate and insert:
- **100 sample calls** (last 30 days)
- **50 usage history records** (last 30 days)
- **20 payment records** (last 60 days)

### Sample Data Details

**Calls Table:**
- Random phone numbers
- 5 different agents (agent-001 to agent-005)
- Mix of completed/failed/busy statuses
- Durations: 30 seconds to 10 minutes
- Costs calculated at $0.05/minute

**Usage History Table:**
- Aggregated stats per agent
- Random call counts and minutes
- Timestamps spread over 30 days

**Payments Table:**
- Random amounts ($50-$550)
- Mix of completed/pending statuses
- Credit card and bank transfer methods

## Step 3: Verify Data

### Check row counts:
```bash
bq query --use_legacy_sql=false "
SELECT 
  'calls' as table_name, 
  COUNT(*) as row_count 
FROM \`heyai-backend.agent_data.calls\`
UNION ALL
SELECT 
  'usage_history', 
  COUNT(*) 
FROM \`heyai-backend.agent_data.usage_history\`
UNION ALL
SELECT 
  'payments', 
  COUNT(*) 
FROM \`heyai-backend.agent_data.payments\`
"
```

### View recent calls:
```bash
bq query --use_legacy_sql=false "
SELECT 
  caller_number,
  agent_id,
  status,
  duration,
  start_time
FROM \`heyai-backend.agent_data.calls\`
ORDER BY start_time DESC
LIMIT 10
"
```

## Step 4: Test Dashboard

1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard:
   ```
   http://localhost:3000/admin/dashboard
   ```

3. You should see:
   - Total calls count
   - Active agents (today)
   - Total minutes
   - Recent activity with sample calls

## Customization

### Generate More Data

Edit `seed-bigquery.js` and change the counts:

```javascript
const calls = generateCalls(500);        // Generate 500 calls
const usageHistory = generateUsageHistory(200);  // 200 usage records
const payments = generatePayments(100);  // 100 payments
```

### Adjust Time Range

Change the `daysAgo` parameter:

```javascript
const startTime = randomTimestamp(7);  // Last 7 days only
```

### Add Today's Data

To ensure you have data for "today" stats:

```javascript
// Add some calls from today
for (let i = 0; i < 10; i++) {
  const duration = randomDuration();
  calls.push({
    call_id: `call-today-${i}`,
    caller_number: randomPhone(),
    agent_id: randomAgent(),
    status: 'completed',
    duration: duration,
    cost: randomCost(duration),
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + duration * 1000).toISOString(),
  });
}
```

## Troubleshooting

### Error: "Table not found"
Run the SQL script to create tables first (Step 1).

### Error: "Permission denied"
Ensure your service account has these roles:
- BigQuery Data Editor
- BigQuery Job User

### Error: "Invalid credentials"
Check that `BIGQUERY_CREDENTIALS` in `.env.local` is valid JSON.

### No data showing in dashboard
1. Check BigQuery console to verify data was inserted
2. Check browser console for API errors
3. Verify environment variables are loaded correctly

## Clean Up Data

To delete all sample data:

```bash
bq query --use_legacy_sql=false "
DELETE FROM \`heyai-backend.agent_data.calls\` WHERE 1=1;
DELETE FROM \`heyai-backend.agent_data.usage_history\` WHERE 1=1;
DELETE FROM \`heyai-backend.agent_data.payments\` WHERE 1=1;
"
```

To drop tables entirely:

```bash
bq rm -f -t heyai-backend:agent_data.calls
bq rm -f -t heyai-backend:agent_data.usage_history
bq rm -f -t heyai-backend:agent_data.payments
```

## Cost Considerations

- Sample data generation is free
- BigQuery charges for:
  - Storage: ~$0.02/GB/month (minimal for sample data)
  - Queries: ~$5/TB scanned
- The sample data (~100-200 rows) will cost less than $0.01/month

## Next Steps

After seeding data:
1. Test all dashboard features
2. Verify API endpoints return correct data
3. Check date filtering and aggregations
4. Test auto-refresh functionality
5. Monitor BigQuery costs in Google Cloud Console
