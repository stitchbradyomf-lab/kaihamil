# Time & Focus - PocketBase Setup

## The Problem
The app was defaulting to `localhost:8090` for PocketBase, which doesn't work on Netlify.

## The Fix
Updated `src/utils/constants.js` to use your live PocketBase instance:
```javascript
export const PB_URL = 'http://192.241.180.69:8090';
```

## Required Collections

The Time & Focus app needs these PocketBase collections:

### 1. `users` (built-in auth collection)
- Standard PocketBase user authentication
- Email/password login

### 2. `time_focus_entries`
Daily time & focus ratings for each user.

**Fields:**
- `user_id` (relation → users)
- `entry_date` (date)
- `ratings` (json) - Object with category scores
- `aggregate` (json) - Computed totals
- `reflection` (text) - Daily notes
- `metadata` (json) - Additional data like rating_notes

### 3. `intentions`
Period intentions/targets (weekly, monthly, quarterly).

**Fields:**
- `user` (relation → users)
- `period` (select: week/month/quarter)
- `period_start` (date)
- `period_end` (date)
- `target_kids` (number)
- `target_partner` (number)
- `target_work` (number)
- `target_business` (number)
- `target_sleep` (number)
- `focus_areas` (json)

## Setup Instructions

### Option 1: Automated Setup (Recommended)

Run the setup script with your admin credentials:

```bash
cd apps/time-focus-app
npm install  # if not already done
PB_ADMIN_PASSWORD=Scobey1022 node setup-pocketbase.js
```

### Option 2: Manual Setup in PocketBase Admin

1. Go to `http://192.241.180.69:8090/_/` (PocketBase admin)
2. Login with your admin credentials
3. Create collection `time_focus_entries` with fields listed above
4. Create collection `intentions` with fields listed above

## After Setup

1. Redeploy the Time & Focus app to Netlify:
   ```bash
   cd apps/time-focus-app
   npm run build
   # Or trigger rebuild via Git push
   ```

2. Test the app at `https://kh-timefocus.netlify.app`

3. Create an account and verify data saves to PocketBase

## Troubleshooting

### "Failed to connect"
- Check PocketBase is running: `http://192.241.180.69:8090`
- Verify URL in `src/utils/constants.js`
- Check browser console for CORS errors

### "Collection not found"
- Run setup script or manually create collections
- Verify collection names match exactly

### "Authentication failed"
- Users collection must exist (built-in)
- Check email/password are correct
- Verify user is created in PocketBase admin

## Data Flow

1. User logs in → PocketBase auth
2. Daily entry → Saved to `time_focus_entries`
3. View reports → Query `time_focus_entries` by date range
4. Set intentions → Saved to `intentions` collection

## Local Development

For local development with local PocketBase:
```bash
# In one terminal
pocketbase serve

# In another terminal
cd apps/time-focus-app
npm run dev
```

The app will use `http://127.0.0.1:8090` when running locally.
