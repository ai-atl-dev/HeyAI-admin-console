# BigQuery Quick Start Guide

Complete setup in 30 minutes! Follow these steps in order.

## 🚀 Step 1: GCP Project Setup (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable BigQuery API:
   - Go to "APIs & Services" > "Library"
   - Search "BigQuery API"
   - Click "Enable"

## 📊 Step 2: Create Dataset and Tables (10 minutes)

### Create Dataset
1. Open BigQuery in GCP Console
2. Click your project → "Create Dataset"
3. Dataset ID: `agent_data`
4. Location: Choose your region
5. Click "Create Dataset"

### Create Tables Using SQL
1. Click "Compose New Query"
2. Copy and paste the contents of `bigquery_schema.sql`
3. **Replace** `your-project-id` with your actual GCP project ID
4. Click "Run"

This creates 4 tables:
- ✅ `calls` - Main call records
- ✅ `agents` - Agent information
- ✅ `live_calls` - Active call monitoring
- ✅ `usage_history` - Daily statistics

## 🔑 Step 3: Create Service Account (5 minutes)

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `vercel-bigquery-access`
4. Click "Create and Continue"
5. Add roles:
   - **BigQuery Data Editor**
   - **BigQuery Job User**
6. Click "Continue" → "Done"

### Download Credentials
1. Click on the service account you created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON"
5. Click "Create" - a JSON file downloads
6. **Save this file securely!**

## ⚙️ Step 4: Configure Vercel (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" > "Environment Variables"

### Add These Variables:

#### 1. BIGQUERY_PROJECT_ID
```
Key: BIGQUERY_PROJECT_ID
Value: your-gcp-project-id
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 2. BIGQUERY_DATASET
```
Key: BIGQUERY_DATASET
Value: agent_data
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 3. BIGQUERY_CREDENTIALS
```
Key: BIGQUERY_CREDENTIALS
Value: [Entire JSON from downloaded file, minified to one line]
Environments: ✅ Production ✅ Preview ✅ Development
```

**How to minify JSON:**
- Open your downloaded JSON file
- Copy all contents
- Use [JSON Minifier](https://codebeautify.org/jsonminifier)
- Paste the result as the value (should be one long line)

Example:
```
{"type":"service_account","project_id":"your-project","private_key_id":"abc123",...}
```

4. Click "Save" for each variable

## 🔄 Step 5: Deploy (2 minutes)

### Option A: Redeploy in Vercel
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### Option B: Git Push
```bash
git add .
git commit -m "Configure BigQuery"
git push
```

## ✅ Step 6: Test (3 minutes)

### Test in BigQuery Console
Run this query to verify tables exist:
```sql
SELECT table_name
FROM `your-project-id.agent_data.INFORMATION_SCHEMA.TABLES`
```

You should see: calls, agents, live_calls, usage_history

### Test Your Dashboard
1. Visit your deployed site: `https://your-site.vercel.app/admin/dashboard`
2. You should see:
   - Total Calls: 3 (from sample data)
   - Active Agents: 1
   - Recent Activity showing 3 sample calls

### If Dashboard Shows Errors:
1. Check Vercel logs: `Deployments` > Click deployment > `Functions`
2. Verify environment variables are set correctly
3. Make sure BIGQUERY_CREDENTIALS is properly formatted (one line, no quotes)

## 📝 Step 7: Start Using It!

Now you can insert real call data. See `BIGQUERY_IMPLEMENTATION_GUIDE.md` for:
- API endpoints to create calls
- How to track live calls
- How to update agent information
- Complete code examples

### Quick Example - Record a Call:
```bash
curl -X POST https://your-site.vercel.app/api/calls/create \
  -H "Content-Type: application/json" \
  -d '{
    "call_id": "unique_call_id",
    "caller_number": "+1234567890",
    "agent_id": "agent_001",
    "status": "completed",
    "duration": 120,
    "start_time": "2025-11-09T10:30:00Z"
  }'
```

---

## 🆘 Troubleshooting

### Error: "Cannot find module '@google-cloud/bigquery'"
**Solution:**
```bash
npm install @google-cloud/bigquery --legacy-peer-deps
```

### Error: "Missing BigQuery configuration"
**Solution:** Verify environment variables are set in Vercel:
- Go to Settings > Environment Variables
- Check all three variables exist
- Redeploy

### Error: "Invalid credentials"
**Solution:**
- Ensure BIGQUERY_CREDENTIALS is the full JSON content
- Make sure it's minified to one line
- No quotes around the JSON value
- Redeploy after fixing

### Dashboard Shows 0 Data
**Solution:**
1. Check if tables have data:
```sql
SELECT COUNT(*) FROM `your-project-id.agent_data.calls`
```
2. If empty, run the sample inserts from `bigquery_schema.sql`
3. Refresh your dashboard

### "Permission denied" Errors
**Solution:**
- Verify service account has both roles:
  - BigQuery Data Editor
  - BigQuery Job User
- May need to wait 1-2 minutes for permissions to propagate

---

## 📚 Next Steps

1. **Implement data collection**: See `BIGQUERY_IMPLEMENTATION_GUIDE.md`
2. **Add authentication**: Protect your admin routes
3. **Customize dashboard**: Add charts, filters, search
4. **Set up webhooks**: Integrate with your voice provider (Twilio, Vapi, etc.)
5. **Monitor costs**: Set up billing alerts in GCP Console

---

## 📂 Files Reference

- `bigquery_schema.sql` - All table creation SQL
- `BIGQUERY_IMPLEMENTATION_GUIDE.md` - API endpoints and code examples
- `.env.bigquery.example` - Environment variables template
- `BIGQUERY_SETUP.md` - Detailed setup instructions (this file)

---

## ✨ You're Done!

Your BigQuery database is now connected to your admin dashboard. Every time you create a call record through the API, it will appear in your dashboard in real-time.

Questions? Check the implementation guide or GCP BigQuery documentation.
