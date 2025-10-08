# Navigation Black Screen Fix Tasks

| Task | Goal | Key Files / Areas | Expected Outcome |
| --- | --- | --- | --- |
| 1. Capture failing chunk requests | Verify the production server is returning HTML for on-demand route bundles, explaining the blank screen | Deployment CDN routes, `curl` requests to `/assets/*.js` | Network inspection shows HTML responses for JS chunks, confirming lazy-loaded routes cannot execute |
| 2. Remove lazy route splitting | Bundle every route with the main application to avoid external chunk requests that the CDN misserves | `src/App.tsx` routing setup | Navigation no longer triggers additional chunk downloads, so the app keeps rendering even on misconfigured CDNs |
| 3. Regression-test navigation & translation | Ensure direct imports keep navigation responsive and the Google Translate hooks still initialise | Local dev server navigation flow, language switcher | Switching pages and languages works repeatedly without black screens or console errors |

All tasks were executed in sequence to restore stable navigation on the deployed site.
