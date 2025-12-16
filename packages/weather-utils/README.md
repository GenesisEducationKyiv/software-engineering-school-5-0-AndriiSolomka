# @weather-utils/core

A TypeScript utility library extracted from the weather application monorepo. This library provides reusable utilities for logging, random generation, notifications, and Prometheus metrics.

## 🚀 Features

- **Random Generation**: Cryptographically secure random token and hex string generation
- **Logger Utilities**: File logging, Pino logger factory, HTTP request logging
- **Notification Builder**: Weather notification template builder
- **Prometheus Helpers**: Histogram timer and duration measurement utilities

## 📦 Installation

```bash
npm install @weather-utils/core
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install pino prom-client
npm install --save-dev pino-pretty  # optional, for pretty console output
```

## 📚 Usage

### Random Generator

```typescript
import { generateRandomHex, generateToken } from '@weather-utils/core';

const hex = generateRandomHex(16); // 32-character hex string
const token = generateToken(); // 64-character token
```

### File Logger

```typescript
import { FileLogger } from '@weather-utils/core';

const logger = new FileLogger({
  logDir: './logs',
  defaultFileName: 'app.log'
});

logger.appendToLogFile('Application started\n');
```

### Pino Logger Factory

```typescript
import { createPinoLogger } from '@weather-utils/core';

const logger = createPinoLogger({
  filePath: './logs/app.log',
  pretty: true,
  level: 'info'
});

logger.info('Server started');
```

### HTTP Logger

```typescript
import { logHttpRequest } from '@weather-utils/core';

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logHttpRequest(req, res, start, logger);
  });
  next();
});
```

### Notification Builder

```typescript
import { buildWeatherNotification } from '@weather-utils/core';

const notification = buildWeatherNotification(
  subscription,
  weatherData,
  'https://example.com/unsubscribe/'
);

console.log(notification.subject);
console.log(notification.text);
```

### Prometheus Utilities

```typescript
import { createHistogramTimer, measureDuration } from '@weather-utils/core';
import { Histogram } from 'prom-client';

const histogram = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status']
});

// Manual timer
const timer = createHistogramTimer(histogram, { method: 'GET', route: '/api' });
// ... do work
timer.stop({ status: 'success' });

// Automatic measurement
const result = await measureDuration(
  histogram,
  { method: 'POST', route: '/api/data' },
  async () => {
    return await fetchData();
  }
);
```

## 🏗️ Architecture

This library was extracted from a monorepo to:
- Improve reusability across multiple services
- Reduce coupling between utilities and business logic
- Enable independent versioning and testing
- Follow single responsibility principle

### Refactoring Highlights

- **Dependency Injection**: All external dependencies (filesystem, logger instances) are injected
- **Type Safety**: Full TypeScript support with exported interfaces
- **Backward Compatibility**: Legacy exports maintained with deprecation notices
- **Clean Abstractions**: Business logic separated from infrastructure concerns

## 🧪 Testing

```typescript
import { createMockLogger } from '@weather-utils/core';

const mockLogger = createMockLogger();
// Use in tests
```

## 📄 License

MIT

## 🤝 Contributing

This library is part of the Genesis Education Software Engineering School project.
