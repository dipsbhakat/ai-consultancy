# Render Environment Variables Setup

## Critical Environment Variables for Production

Set these environment variables in your Render service dashboard:

### JWT Configuration (CRITICAL - Must be consistent)
```
JWT_SECRET=19323c2498d59585d86d918d71a5bba3a5403bab21c801c899b2ce01f03266758f76ead5b080ccc46a128d103ede4c5666b8526ef2d5966b6077280238013a29
JWT_EXPIRES_IN=7d
```

### Database
```
DATABASE_URL=file:./prod.db
```

### Application
```
NODE_ENV=production
PORT=3001
```

### CORS (Update with your actual frontend URL)
```
ALLOWED_ORIGINS=https://ai-consultancy-frontend.onrender.com
```

### Security
```
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
```

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Logging
```
LOG_LEVEL=info
LOG_FORMAT=json
```

## How to Set Environment Variables on Render:

1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Add each variable above as Key-Value pairs
5. **IMPORTANT**: Make sure JWT_SECRET exactly matches the value above
6. Save and redeploy

## Why This Fixes the Issue:

- **Consistent JWT Secret**: All app restarts will use the same secret
- **Valid Tokens**: Existing JWT tokens won't become invalid on restart
- **No More Account Lockouts**: Admin won't get locked out due to token verification failures
- **Stable Authentication**: Login will work consistently across deployments

## Testing After Setup:

1. Deploy the changes
2. Wait for deployment to complete
3. Test admin login - should work without password reset
4. Restart the service (to simulate app restart)
5. Test admin login again - should still work with same credentials

⚠️ **CRITICAL**: Never change the JWT_SECRET in production unless you want to invalidate all existing user sessions.
