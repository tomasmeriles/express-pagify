import type { BasicResponseOptions } from '../common/BasicResponseOptions.js';

/**
 * Options for sending a cursor-based paginated response.
 *
 * @template T - Type of each item in the `data` array.
 */
export type CursorBasedResponseOptions<T> = BasicResponseOptions<T> & {
  /**
   * Cursor object for the next cursor. Can be any serializable object.
   * If there is no next cursor, this can be `null` or `undefined`.
   */
  nextCursor?: Record<string, any> | null;

  /**
   * Cursor object for the previous cursor. Can be any serializable object.
   * If there is no previous cursor, this can be `null` or `undefined`.
   */
  prevCursor?: Record<string, any> | null;

  /**
   * Maximum number of items requested per page.
   */
  limit: number;

  /**
   * Number of items returned in this page.
   * Can be derived from `data.length` if not explicitly provided.
   */
  count: number;
};
