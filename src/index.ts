// Import global Express type augmentations or extensions
import './types/express.js';

// Export custom error class for invalid pagination values
export { InvalidPaginationValuesError } from './errors/InvalidPaginationValuesError.js';

// Export middleware function for offset-based pagination, aliased as pagify
export { pagifyOffsetBased as pagify } from './middlewares/pagifyOffsetBased.js';
// Export related types for configuring the pagify middleware
export type {
  PagifyOffsetBasedConfig,
  FallBackValuesConfig,
} from './types/PagifyOffsetBasedConfig.js';

// Export utility function to format and send paginated API responses
export { formatAndSendPaginated } from './responses/formatAndSendPaginated.js';
// Export the type for the options object accepted by formatAndSendPaginated
export type { FormatAndSendOptions } from './types/FormatAndSendOptions.js';
