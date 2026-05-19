# Sentry Error Tracking Setup Guide

Sentry has been integrated into ArhanOS for comprehensive error tracking and performance monitoring. Follow these steps to complete the setup.

## Installation

### Step 1: Install Dependencies

```bash
npm install @sentry/react @sentry/tracing
```

If you encounter PowerShell execution policy issues, use Command Prompt (cmd.exe) instead:

```cmd
npm install @sentry/react @sentry/tracing
```

### Step 2: Configure Your Sentry DSN

1. **Create a Sentry Account** (if you don't have one):
   - Visit [https://sentry.io](https://sentry.io)
   - Sign up for a free account

2. **Create a Project**:
   - Click "Projects" → "Create Project"
   - Select "React" as the platform
   - Select "Alert me on every new issue" for development

3. **Copy Your DSN**:
   - Go to Settings → Projects → Select Your Project
   - Click "Client Keys (DSN)"
   - Copy the DSN

4. **Add to .env.local**:
   ```
   VITE_SENTRY_DSN=https://YOUR_KEY@o0.ingest.sentry.io/YOUR_PROJECT_ID
   ```

### Step 3: Verify Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Check browser console for any Sentry initialization messages

3. Test error tracking by intentionally triggering an error in the app

## Features Enabled

### ✅ Error Tracking

- Automatic error capture with stack traces
- Error context and breadcrumbs
- Session replay for debugging

### ✅ Performance Monitoring

- Browser Performance API integration
- Track transactions and operations
- Analyze slow interactions

### ✅ Session Replay

- Recordings of user sessions where errors occur
- Privacy-friendly (masks sensitive data)
- Full interaction replay

## Usage in Code

### Manually Capture Exceptions

```javascript
import { captureException } from "./config/sentry";

try {
  // Your code
} catch (error) {
  captureException(error, {
    component: "YourComponent",
    action: "specific_action",
  });
}
```

### Capture Messages

```javascript
import { captureMessage } from "./config/sentry";

captureMessage("User performed action X", "info");
```

### Set User Context

```javascript
import { setSentryUser, clearSentryUser } from "./config/sentry";

// When user logs in
setSentryUser("user-id-123", "user@example.com", "username");

// When user logs out
clearSentryUser();
```

## Configuration Files

- **src/config/sentry.js** - Main Sentry initialization and utilities
- **src/main.jsx** - Sentry initialization before React render
- **.env.example** - Environment variable template

## Troubleshooting

### Sentry Not Capturing Errors

1. Verify your DSN is correctly set in `.env.local`
2. Check browser console for initialization errors
3. Ensure you're running in production mode: `npm run build && npm run preview`
4. Check Sentry dashboard for any project configuration issues

### Too Many Error Reports

Adjust sample rates in `src/config/sentry.js`:

```javascript
tracesSampleRate: 0.1,        // Capture 10% of transactions in production
replaysSessionSampleRate: 0.1, // Capture 10% of sessions
```

### Privacy Concerns

Session Replay is configured to:

- Mask all text content (replaces with \*'s)
- Block all media content
- Only capture on errors (not all sessions)

You can adjust these settings in `src/config/sentry.js`

## Environment-Specific Configuration

The Sentry setup automatically handles different environments:

- **Development**: Captures 100% of transactions for debugging
- **Production**: Captures 10% of transactions to reduce noise

This is configured via `import.meta.env.MODE` in `src/config/sentry.js`

## Additional Resources

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring Guide](https://docs.sentry.io/platforms/javascript/tracing/)
- [Session Replay Guide](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Sentry Dashboard](https://sentry.io)
