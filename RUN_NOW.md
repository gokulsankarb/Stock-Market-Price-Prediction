# RUN THIS IN VS CODE NOW - 3 STEPS

## Step 1: Open Terminal in VS Code
Press **Ctrl + `** (backtick key)

## Step 2: Copy & Paste This
```bash
npm install && npm run dev
```

## Step 3: Click This Link
http://localhost:3000

---

## What You'll See:

1. **Login/Register Page** - Create account
2. **Dashboard** - Stock prices updating LIVE every 5 seconds
3. **Interactive Charts** - 4 chart types, 6 time periods
4. **Predictions** - 7-day LSTM forecast
5. **Settings** - Theme, preferences, password reset

---

## FIXES APPLIED:
✅ Stock prices now change every 5 seconds (real-time simulation)  
✅ Hydration mismatch error fixed  
✅ Performance optimized (lazy loading, dynamic imports)  
✅ Responsive design improved  

---

## FEATURES WORKING:
✅ Live stock data (updates every 5 seconds)  
✅ 15 NSE stocks  
✅ 4 chart types (area, line, candlestick, bar)  
✅ Time periods (1D, 1W, 1M, 3M, 6M, 1Y)  
✅ LSTM predictions (7-day forecast)  
✅ Dark/light mode  
✅ User authentication  
✅ Password reset via email  
✅ Settings & profile pages  

---

## NEXT STEP - Add Real Upstox Data:

Get API key from https://upstox.com/developer

Add to `.env.local`:
```
UPSTOX_API_KEY=your_key_here
UPSTOX_API_SECRET=your_secret_here
```

Restart server with `Ctrl + C` then `npm run dev`

Live market data will now stream in real-time!

---

**Command to run:** `npm install && npm run dev`
