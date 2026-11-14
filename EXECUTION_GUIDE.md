# VS Code Execution Guide - Step by Step

## Step 1: Open VS Code Terminal
1. Open VS Code
2. Press `Ctrl + `` (backtick) or go to Terminal → New Terminal
3. You should see the project folder path at the bottom

## Step 2: Install Dependencies
```bash
npm install
```
Wait for it to complete (2-3 minutes first time)

## Step 3: Create Environment File
Create a file named `.env.local` in the root folder with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Step 4: Start the Development Server
```bash
npm run dev
```

You'll see:
```
> next dev
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
  ✓ Ready in 2.1s
```

## Step 5: Open in Browser
Click the link or paste: **http://localhost:3000**

## Step 6: Login
- Click "Sign Up" to create account
- Fill in: First Name, Last Name, Email, Phone
- Click "Create Account"
- Go back and login with same email/password

## Step 7: View Dashboard
After login, you'll see:
- Stock dropdown (top)
- Interactive price chart (middle)
- Stock statistics (bottom)
- Settings in sidebar

## Keyboard Shortcuts
- `Ctrl + C` - Stop the server
- `Ctrl + Shift + P` - VS Code command palette
- `Alt + Z` - Toggle word wrap in editor

## If You Get Errors

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**Module not found:**
```bash
npm install
npm run dev
```

**Hydration error:** Refresh browser (F5)

**Database connection error:** Check `.env.local` file

## Tips
- Don't close the terminal running `npm run dev`
- Open a NEW terminal tab for other commands
- Press `F5` in browser to refresh
- Check browser console for errors: F12 → Console tab

## Next: Enable Live Data from Upstox

After getting the basic dashboard working:

1. Get Upstox API credentials from https://upstox.com/developer
2. Create `.env.local` entry:
   ```
   UPSTOX_API_KEY=your_api_key
   UPSTOX_API_SECRET=your_api_secret
   ```
3. Restart server: `Ctrl + C` then `npm run dev`

Live stock prices will now update in real-time during market hours (9:15 AM - 3:30 PM IST, Monday-Friday).
