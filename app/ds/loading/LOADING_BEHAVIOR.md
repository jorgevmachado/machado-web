# Loading Behavior Documentation

## Overview

The `LoadingProvider` manages two types of loading states globally:
- **Page Loading**: Full-screen progress bar during navigation
- **Content Loading**: Centered Pokéball spinner during in-page operations

## Minimum Display Duration

To ensure users always see the loading indicator (even with very fast APIs), a **minimum display duration of 300ms** is enforced.

### Why This Matters

Without a minimum duration:
- Very fast API responses (< 100ms) would show and hide loading so quickly it would be imperceptible
- Users might not realize a request was made
- The UX feels broken or unresponsive

### How It Works

```
User submits form (startPageLoading() called)
    ↓
Loading bar appears immediately
    ↓
Server action completes (stopPageLoading() called)
    ↓
Timer starts (300ms minimum)
    ↓
After 300ms, loading bar disappears (or sooner if another startPageLoading() is called)
```

## Implementation Details

### Timer Management

The provider uses `useRef` to store timeouts:
- `pageLoadingTimerRef`: Ensures page loading stays visible for minimum duration
- `contentLoadingTimerRef`: Ensures content loading stays visible for minimum duration

### Multiple Calls Handling

If `startPageLoading()` is called again while already loading:
- Any pending stop timer is cleared
- Loading continues without interruption
- User will see a continuous loading state

Example flow:
```
startPageLoading()          → Shows loading
stopPageLoading() called    → Schedules hide after 300ms
startPageLoading() called   → Clears scheduled hide, keeps showing
stopPageLoading() called    → Schedules hide again
```

## Usage in Forms

In `LoginForm.tsx` and `RegisterForm.tsx`:

```tsx
// Start loading on submit
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  // ... validation ...
  startPageLoading(); // Starts immediately, min 300ms display
};

// Stop loading when action completes
useEffect(() => {
  if (!state.message || state.message === lastServerMessageRef.current) {
    return;
  }
  
  stopPageLoading(); // Stops after 300ms (or earlier if superseded)
  // ... show alert ...
}, [state.message, state.status]);
```

## Customizing the Minimum Duration

To change the minimum display duration, edit `LoadingProvider.tsx`:

```tsx
const MIN_LOADING_DURATION_MS = 300; // Change this value
```

Common values:
- **100ms**: Barely perceptible (not recommended)
- **200ms**: Very subtle visual feedback
- **300ms**: Sweet spot for perceived responsiveness
- **500ms**: Longer, more obvious feedback
- **1000ms**: Very prominent (useful for network-heavy operations)

## Cleanup on Unmount

Timers are properly cleaned up when the provider unmounts (application closes). This prevents memory leaks and stale callbacks.

## Testing Loading Behavior

To test with a simulated slow API:

1. Open your browser's DevTools
2. Go to Network tab
3. Set throttling to slow (e.g., "Slow 3G")
4. Submit the login form
5. Watch the loading bar appear and stay visible for the minimum duration

The loading should remain visible even if your actual server responds instantly.

