# Render Backend Deploy Instructions

## Your Backend Service: srv-d37v2qemcj7s73fub8vg

### Current Settings to Check/Fix:

1. **Go to:** https://dashboard.render.com/web/srv-d37v2qemcj7s73fub8vg

2. **Check Settings Tab:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Environment:** Node.js

3. **Environment Variables (Add these):**
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **If still failing, try these build commands:**
   ```
   npm install && npx prisma generate && npm run build
   ```

### Manual Deploy Steps:
1. Go to Deploys tab
2. Click "Manual Deploy"
3. Select "Deploy latest commit"

### Check Logs For These Errors:
- ❌ `prisma generate` errors
- ❌ TypeScript compilation errors  
- ❌ Missing dependencies
- ❌ Port binding issues
- ❌ Database connection errors
