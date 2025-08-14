// Import global Express type extensions
// This ensures that any `req.pagination` or other extended types
// are available across the application.
import './types/common/express.js';

// ----------------------
// Error Classes
// ----------------------

export { InvalidPaginationValuesError } from './errors/InvalidPaginationValuesError.js';

// ----------------------
// Offset-Based Pagination
// ----------------------

export { pagifyOffsetBased as pagify } from './middlewares/pagifyOffsetBased.js';
export type {
  OffsetBasedConfig,
  FallBackOffsetValues,
} from './types/offset-based/OffsetBasedConfig.js';

// ----------------------
// Cursor-Based Pagination
// ----------------------

export { pagifyCursorBased } from './middlewares/pagifyCursorBased.js';

export type {
  CursorBasedConfig,
  FallBackCursorBased,
} from './types/cursor-based/CursorBasedConfig.js';

// ----------------------
// Pagination Response Utilities
// ----------------------

export { offsetBasedResponse } from './responses/offsetBasedResponse.js';
export type { OffsetBasedResponseOptions } from './types/offset-based/OffsetBasedResponseOptions.js';
export type { OffsetBasedResponse } from './types/offset-based/OffsetBasedResponse.js';

export { cursorBasedResponse } from './responses/cursorBasedResponse.js';
export type { CursorBasedResponseOptions } from './types/cursor-based/CursorBasedResponseOptions.js';
export type { CursorBasedResponse } from './types/cursor-based/CursorBasedResponse.js';
