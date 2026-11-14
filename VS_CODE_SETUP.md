# Complete Implementation Guide: VS Code Setup

## System Requirements
- Node.js 18+ 
- pnpm or npm
- VS Code (recommended)
- 2+ terminals

## Step 1: Repository Structure

Verify your folder structure:
```
project-root/
├── backend/                    (NEW - Node.js server)
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   (existing Next.js app)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── lib/
│   ├── socket-client.ts       (NEW - Socket hooks)
│   └── ... (existing files)
│
├── components/
│   ├── market-status-badge.tsx  (NEW)
│   ├── live-price-card.tsx      (NEW)
│   └── ... (existing components)
│
└── .env.example
```

## Step 2: Terminal Setup in VS Code

### Open VS Code Terminal Panel
1. Press `Ctrl+J` (or `Cmd+J` on Mac)
2. Click the "+" icon to create new terminal
3. Repeat to create 3 terminals

### Terminal Layout
```
┌─────────────────────────────────────────┐
│  EDITOR: VS Code main editing area      │
├─────────────────────────────────────────┤
│ Term 1   │ Term 2         │ Term 3      │
│Backend   │ Frontend       │ Optional    │
│dev:5000  │ dev:3000       │ Logs       │
└─────────────────────────────────────────┘
```

## Step 3: Backend Setup (Terminal 1)

### 3.1 Navigate to Backend
```bash
cd backend
```

### 3.2 Install Dependencies
```bash
npm install
# or
pnpm install
```

Watch for output:
```
added 145 packages
```

### 3.3 Create Environment File
```bash
cp .env.example .env
```

### 3.4 Start Backend Server
```bash
npm run dev
```

Expected output:
```
[2024-01-15T09:15:00.000Z] StockAI Realtime Backend listening on port 5000
Frontend URL: http://localhost:3000
```

**Keep this terminal running!**

## Step 4: Frontend Setup (Terminal 2)

### 4.1 Navigate to Frontend Root
```bash
# Assuming you're in /backend, go back to root
cd ..
```

Or open a new terminal in the project root.

### 4.2 Create Environment File
```bash
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" > .env.local
```

### 4.3 Install Dependencies (if needed)
```bash
npm install
# Dependencies should already be installed from before
```

### 4.4 Start Frontend Server
```bash
npm run dev
```

Expected output:
```
> next dev
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Keep this terminal running!**

## Step 5: Test the System

### 5.1 Open Dashboard
1. In VS Code or browser, go to: `http://localhost:3000/dashboard`
2. You should see the dashboard load

### 5.2 Check Market Status Badge
1. Look for the badge in the top-right area (sidebar)
2. Should show one of:
   - "Market Open" (green, with pulse) - if 9:15 AM - 3:30 PM IST
   - "Market Closed" (red) - if market is closed
   - "Pre-open" (yellow, with pulse) - if before 9:15 AM on trading day
3. Time should show in IST format

### 5.3 Select a Stock
1. Find the stock dropdown selector
2. Click to open dropdown
3. Select "Reliance Industries" or any stock
4. A live price card should appear with:
   - Stock name
   - Live price (LTP)
   - Change and % change
   - Bid and Ask prices
   - Volume
   - Current time

### 5.4 Watch Live Updates
1. Price, bid, ask should update every second
2. Changes should be visible in real-time
3. Volume should change frequently

## VS Code Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+J` | Toggle terminal panel |
| `Ctrl+`` | Create new terminal |
| `Ctrl+Shift+L` | Split terminal left/right |
| `Ctrl+K Ctrl+0` | Close terminal group |
| `Ctrl+F` | Find in current file |
| `Ctrl+H` | Find and replace |
| `F5` | Debug (if configured) |

## Debugging in VS Code

### 1. View Console Logs
In Terminal 2 (Frontend), you'll see:
```
- event compiled client and server successfully
[v0] Socket connected
```

### 2. Debug Frontend in Browser
1. Press F12 in browser to open DevTools
2. Go to "Console" tab
3. Look for Socket.IO logs
4. Check Network tab for WebSocket connection

### 3. Debug Backend
1. Look at Terminal 1 logs
2. You'll see:
```
[2024-01-15T09:15:00.000Z] Client connected: abc123xyz
[2024-01-15T09:15:00.000Z] Client abc123xyz subscribed to RELIANCE
```

### 4. VS Code Debug Console
For advanced debugging:
1. Press `Ctrl+Shift+D` to open Debug panel
2. Click "Run and Debug"
3. Select "Node.js" to debug backend
4. Set breakpoints by clicking line numbers

## Troubleshooting Common Issues

### Issue: Port 5000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (Mac/Linux)
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Then restart backend.

### Issue: Socket Connection Failed

**Symptom**: Badge shows "Connecting..." and never connects

**Solution**:
1. Verify backend is running (check Terminal 1)
2. Check `.env.local` has correct URL:
   ```
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```
3. Restart frontend (Terminal 2)
4. Clear browser cache: `Ctrl+Shift+Del`

### Issue: No Stock Price Updates

**Symptom**: Price card shows but doesn't update

**Solution**:
1. Check browser console for errors
2. Verify market status isn't "Market Closed"
3. Try selecting different stock
4. Refresh page and try again

### Issue: Module Not Found

**Error**: `Cannot find module 'socket.io-client'`

**Solution**:
```bash
# Reinstall frontend dependencies
npm install

# Or if using pnpm
pnpm install
```

Then refresh browser.

### Issue: Backend Crashes Immediately

**Error**: `TypeError: Cannot read property 'use' of undefined`

**Solution**:
```bash
# In backend folder, reinstall and rebuild
rm -rf node_modules dist
npm install
npm run build
npm run dev
```

## Monitoring Your System

### Check Backend Health
```bash
# In Terminal 3 or a browser tab
curl http://localhost:5000/health
```

Response:
```json
{"status":"ok","timestamp":"2024-01-15T09:15:00.000Z"}
```

### Check Market Status
```bash
curl http://localhost:5000/api/market-status
```

### Check Available Stocks
```bash
curl http://localhost:5000/api/stocks
```

## Performance Tips

1. **Keep Terminals Clean**: Don't run unnecessary processes
2. **Monitor Memory**: Watch for memory leaks
3. **CPU Usage**: Should stay <10% when idle
4. **Network**: Monitor WebSocket data in DevTools

## File Watch Settings (VS Code)

VS Code automatically watches files. If you see lag:

Add to `.vscode/settings.json`:
```json
{
  "files.watcherExclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  }
}
```

## Next: Deploy or Continue Development

### Continue to Phase 2
See `PHASE_2_SETUP.md` for Zerodha integration

### Quick Deploy to Vercel (Frontend Only)
```bash
# Frontend on Vercel
vercel --cwd frontend

# Update env var
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

Note: Backend needs to run on your own server or service

## Summary

You now have:
- ✓ Node.js backend running on http://localhost:5000
- ✓ Next.js frontend running on http://localhost:3000
- ✓ Real-time market status detection
- ✓ Live stock price updates (mock data)
- ✓ 3 terminals for monitoring

Ready to test or move to Phase 2?
