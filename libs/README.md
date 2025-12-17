# @weather-api/shared

Shared libraries package for Weather API microservices monorepo.

## Contents

This package contains:

- **Common**: Shared utilities, filters, pipes, middlewares
- **Config**: Configuration files and schemas
- **Core**: Core interfaces and abstractions
- **Infrastructure**: Infrastructure implementations (cache, geocoding, HTTP, logger)
- **Proto**: Generated gRPC protocol buffer definitions
- **Types**: TypeScript type definitions
- **Utils**: Utility functions and helpers

## Usage

This package is used internally within the Weather API monorepo and is installed via local file reference:

```json
{
  "dependencies": {
    "@weather-api/shared": "file:./libs"
  }
}
```

## Development

To build the package:

```bash
cd libs
npm run build
```

To rebuild (clean + build):

```bash
npm run rebuild
```

## Import Examples

```typescript
// Import from the main package
import { LoggerInterface } from '@weather-api/shared';

// Or import directly from submodules
import { CacheModule } from '@weather-api/shared';
import { GeocodingService } from '@weather-api/shared';
```

## Notes

- This package uses peer dependencies to avoid duplication with the main monorepo
- TypeScript source files are included for development
- Built JavaScript files are in the `dist/` directory
