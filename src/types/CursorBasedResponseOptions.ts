import { type Response } from 'express';

/**
 * Options for sending a cursor-based paginated response.
 *
 * @template T - Type of each item in the `data` array.
 */
export type CursorBasedResponseOptions<T> = {
  /**
   * Express response object used to send the HTTP response.
   */
  res: Response;

  /**
   * Array of items for the current page.
   */
  data: T[];

  /**
   * HTTP status code to send with the response.
   * @default 200
   */
  status?: number;

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

  /**
   * Additional arbitrary properties to include in the response.
   */
  extra?: Record<string, any>;
};
