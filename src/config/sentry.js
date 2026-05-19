import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Configuration for ArhanOS Portfolio error tracking
 */
export const initSentry = () => {
  Sentry.init({
    // Replace with your actual Sentry DSN from https://sentry.io
    dsn: import.meta.env.VITE_SENTRY_DSN || "https://examplePublicKey@o0.ingest.sentry.io/0",
    
    environment: import.meta.env.MODE || "development",
    
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // Capture 10% of transactions in production, 100% in development
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    
    // Ignore certain errors
    ignoreErrors: [
      // Random plugins/extensions
      "top.GLOBALS",
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      "originalCreateNotification",
      "canvas.contentDocument",
      "MyApp_RemoveAllHighlights",
      // Network errors
      "NetworkError",
      "Network request failed",
      // Browser extensions
      /^chrome:\/\//,
    ],
    
    // Regex patterns for URLs to exclude from error reporting
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Random plugins
      /127\.0\.0\.1:4001\/isrunning/i,
      // Facebook errors
      /graph\.facebook\.com/i,
    ],
  });
};

/**
 * Manually capture an exception to Sentry
 */
export const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    Object.keys(context).forEach(key => {
      scope.setContext(key, context[key]);
    });
    Sentry.captureException(error);
  });
};

/**
 * Manually capture a message to Sentry
 */
export const captureMessage = (message, level = "info") => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 */
export const setSentryUser = (userId, email, username) => {
  Sentry.setUser({
    id: userId,
    email: email,
    username: username,
  });
};

/**
 * Clear user context
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

export default Sentry;
