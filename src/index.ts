// Import global Express type augmentations or extensions
// This ensures that any `req.pagination` or other extended types
// are available across the application.
import './types/express.js';

// ----------------------
// Error Classes
// ----------------------

// Export custom error class for invalid pagination values
export { InvalidPaginationValuesError } from './errors/InvalidPaginationValuesError.js';

// ----------------------
// Offset-Based Pagination
// ----------------------

// Export middleware function for offset-based pagination, aliased as pagify
export { pagifyOffsetBased as pagify } from './middlewares/pagifyOffsetBased.js';
// Export related types for configuring the pagify middleware
export type {
  PagifyOffsetBasedConfig,
  FallBackValuesConfig,
} from './types/PagifyOffsetBasedConfig.js';

// ----------------------
// Pagination Response Utilities
// ----------------------

// Export utility function to format and send paginated API responses
export { formatAndSendPaginated } from './responses/formatAndSendPaginated.js';
// Export the type for the options object accepted by formatAndSendPaginated
export type { FormatAndSendOptions } from './types/FormatAndSendOptions.js';

// ----------------------
// Cursor-Based Pagination
// ----------------------

/**
 * Middleware for handling cursor-based pagination.
 */
export { pagifyCursorBased } from './middlewares/pagifyCursorBased.js';

/**
 * Types for configuring the cursor-based pagination middleware.
 */
export type {
  PagifyCursorBasedConfig,
  FallBackCursorBased,
} from './types/PagifyCursorBasedConfig.js';
