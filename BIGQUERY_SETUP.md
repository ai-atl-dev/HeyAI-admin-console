# BigQuery Dashboard Setup Instructions

## Prerequisites

- Google Cloud Project with BigQuery enabled
- Service account with BigQuery permissions
- Service account JSON key file

## Environment Variables Setup

### 1. Local Development (.env.local)

Create a `.env.local` file in your project root:

```bash
BIGQUERY_PROJECT_ID=heyai-backend
BIGQUERY_DATASET=agent_data
BIGQUERY_CREDENTIALS={"type":"service_account","project_id":"heyai-backend",...}
```

**Important:** The `BIGQUERY_CREDENTIALS` must be a single-line JSON string. To convert your service account JSON file:

#### Option A: Manual Conversion
1. Open your service account JSON file
2. Copy the entire content
3. Remove all newlines and extra spaces
4. Paste as a single line in `.env.local`

#### Option B: Using Command Line (PowerShell)
```powershell
$json = Get-Content service-account-key.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
Write-Output "BIGQUERY_CREDENTIALS=$json"
```

#### Option C: Using Node.js
```javascript
const fs = require('fs');
const credentials = JSON.stringify(JSON.parse(fs.readFileSync('service-account-key.json', 'utf8')));
console.log(`BIGQUERY_CREDENTIALS=${credentials}`);
```

### 2. Vercel Deployment

#### Step 1: Add Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `BIGQUERY_PROJECT_ID` | `heyai-backend` | Production, Preview, Development |
| `BIGQUERY_DATASET` | `agent_data` | Production, Preview, Development |
| `BIGQUERY_CREDENTIALS` | `{...}` (see below) | Production, Preview, Development |

#### Step 2: Format BIGQUERY_CREDENTIALS for Vercel
1. Open your service account JSON file
2. Minify it to a single line (no newlines)
3. Copy the entire JSON string
4. Paste it into the Vercel environment variable value field

**Example:**
```json
{"type":"service_account","project_id":"heyai-backend","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n","client_email":"service@heyai-backend.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/service%40heyai-backend.iam.gserviceaccount.com"}
```

#### Step 3: Redeploy
After adding environment variables, trigger a new deployment for changes to take effect.

## Service Account Permissions

Your service account needs the following BigQuery permissions:

- `bigquery.jobs.create` - To run queries
- `bigquery.tables.getData` - To read table data
- `bigquery.datasets.get` - To access datasets

**Recommended Role:** `BigQuery Data Viewer` + `BigQuery Job User`

### Grant Permissions via Google Cloud Console:
1. Go to **IAM & Admin** → **IAM**
2. Find your service account
3. Click **Edit** (pencil icon)
4. Add roles:
   - `BigQuery Data Viewer`
   - `BigQuery Job User`
5. Save

## Testing the Setup

### 1. Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Navigate to `http://localhost:3000/admin/dashboard` and check:
- Stats cards load with real data
- Recent activity shows actual calls
- Quick stats display percentages

### 2. Check API Routes Directly

Test each endpoint:

```bash
# Stats endpoint
curl http://localhost:3000/api/dashboard/stats

# Recent activity endpoint
curl http://localhost:3000/api/dashboard/recent-activity

# Quick stats endpoint
curl http://localhost:3000/api/dashboard/quick-stats
```

Expected responses should contain data from your BigQuery tables.

## Troubleshooting

### Error: "Missing BigQuery configuration"
- Verify all three environment variables are set
- Check for typos in variable names
- Restart your development server after adding variables

### Error: "Failed to initialize BigQuery client"
- Verify `BIGQUERY_CREDENTIALS` is valid JSON
- Check that the JSON is properly escaped (especially newlines in private_key)
- Ensure no extra quotes or spaces around the JSON string

### Error: "Permission denied"
- Verify service account has correct BigQuery permissions
- Check that the project ID matches your Google Cloud project
- Ensure the dataset name is correct

### Error: "Table not found"
- Verify dataset name is `agent_data`
- Check that tables exist: `calls`, `usage_history`, `payments`
- Confirm table names match exactly (case-sensitive)

### No Data Showing
- Check if tables have data: Run queries in BigQuery console
- Verify date/time columns are properly formatted
- Check browser console for JavaScript errors

## Data Refresh

The dashboard automatically refreshes every 30 seconds. To change this interval, modify the `useEffect` in `app/admin/dashboard/page.tsx`:

```typescript
// Current: 30 seconds
const interval = setInterval(fetchDashboardData, 30000)

// Change to 60 seconds
const interval = setInterval(fetchDashboardData, 60000)
```

## API Routes Overview

### `/api/dashboard/stats`
Returns top-level statistics:
- Total calls (all time)
- Active agents (today)
- Total minutes (all time)
- Revenue (all time)

### `/api/dashboard/recent-activity`
Returns last 10 calls with:
- Caller number
- Agent ID
- Status
- Duration
- Start time

### `/api/dashboard/quick-stats`
Returns today's metrics:
- Success rate (% completed)
- Average call duration (minutes)
- Agent utilization (%)

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Rotate** service account keys periodically
3. **Use** least-privilege permissions for service accounts
4. **Monitor** BigQuery usage and costs
5. **Enable** audit logging for BigQuery access

## Cost Optimization

BigQuery charges for data scanned. To minimize costs:

1. **Partition tables** by date (e.g., `start_time`)
2. **Use** `WHERE` clauses to limit scanned data
3. **Cache** query results when possible
4. **Monitor** query costs in Google Cloud Console

Example partitioned query:
```sql
SELECT COUNT(*) as total
FROM `agent_data.calls`
WHERE DATE(start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
```

## Support

For issues or questions:
- Check BigQuery logs in Google Cloud Console
- Review Next.js server logs
- Verify environment variables are correctly set
- Test API routes individually before debugging the frontend
