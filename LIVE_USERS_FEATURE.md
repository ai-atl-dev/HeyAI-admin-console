# Live Users Feature

## Overview

Added real-time live user tracking to show how many users are currently on calls with the AI agents.

## Backend Changes (HeyAI-backend)

### main.go

1. **Added active calls tracking**:
   - New global variable `activeCalls map[string]bool` to track active phone numbers
   
2. **Updated `voiceHandler`**:
   - Tracks new calls when they start
   - Adds phone number to `activeCalls` map
   - Logs active call count

3. **Updated `speechResultHandler`**:
   - Removes phone number from `activeCalls` when user says "hang up" or "goodbye"
   - Logs when calls end

4. **New endpoint `/api/live-users`**:
   - Returns current count of active calls
   - Includes CORS headers for frontend access
   - Response format: `{"liveUsers": 0}`

## Frontend Changes (HeyAI-admin-console)

### New API Route: `/api/live-users/route.ts`

- Proxies requests to the Go backend
- Handles errors gracefully
- Returns consistent response format

### Updated: `/admin/existing-agents/page.tsx`

1. **Added live users state**:
   - `liveUsers` state to track current count
   - Fetches live users on component mount
   - Polls every 5 seconds for updates

2. **UI Updates**:
   - Added live users indicator in header
   - Shows green pulsing dot with count
   - Format: "X users live" or "1 user live"
   - Styled with green theme to indicate active status

## Environment Variables

### Backend (optional)

Add to `.env` or Cloud Run environment:
```
BACKEND_URL=https://your-backend-url.run.app
```

### Frontend

Add to Vercel environment variables:
```
BACKEND_URL=https://heyai-backend-127756525541.us-central1.run.app
```

## How It Works

1. **Call Start**: When a user calls the Twilio number, `voiceHandler` adds their phone number to `activeCalls`
2. **Call Active**: The phone number remains in `activeCalls` during the conversation
3. **Call End**: When user says "goodbye" or "hang up", phone number is removed from `activeCalls`
4. **Frontend Polling**: Admin console polls `/api/live-users` every 5 seconds
5. **Display**: Live count is shown in the Existing Agents page header

## API Endpoints

### GET /api/live-users (Backend)

**Response**:
```json
{
  "liveUsers": 3
}
```

### GET /api/live-users (Frontend Proxy)

**Response**:
```json
{
  "success": true,
  "liveUsers": 3
}
```

**Error Response**:
```json
{
  "success": false,
  "liveUsers": 0,
  "error": "Error message"
}
```

## Deployment

### Backend

1. Deploy updated `main.go` to Cloud Run
2. Ensure `/api/live-users` endpoint is accessible
3. No additional configuration needed

### Frontend

1. Set `BACKEND_URL` environment variable in Vercel
2. Deploy updated code
3. Live users will appear in Existing Agents page

## Future Enhancements

- Show live users per agent (not just total)
- Add call duration tracking
- Show caller location/region
- Add real-time call activity feed
- WebSocket for instant updates (instead of polling)
- Historical live users chart
