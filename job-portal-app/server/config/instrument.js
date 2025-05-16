// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Import with `import * as Sentry from "@sentry/node"` if you are using ESM


Sentry.init({
  dsn: "https://b856f441239bff5cfd00a4ffa1b39d4c@o4509324971212800.ingest.us.sentry.io/4509324979732480",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});