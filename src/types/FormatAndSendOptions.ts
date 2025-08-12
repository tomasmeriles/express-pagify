import { type Response } from 'express';

/**
 * Options for formatting and sending a paginated response.
 *
 * @template T - The type of the elements contained in the `data` array.
 */
export type FormatAndSendOptions<T> = {
  /**
   * Express response object used to send the HTTP response.
   */
  res: Response;

  /**
   * Array of items for the current page.
   */
  data: T[];

  /**
   * Number of items skipped from the beginning (offset).
   * Can be obtained from `req.pagination.skip` if the pagination middleware is active.
   */
  skip: number;

  /**
   * Number of items taken per page (limit).
   *
   * Can be obtained from `req.pagination.take` if the pagination middleware is active.
   */
  take: number;

  /**
   * Total number of items available across all pages.
   */
  total: number;

  /**
   * HTTP status code to send with the response.
   * @default 200
   */
  status?: number;

  /**
   * Additional arbitrary properties to include in the response.
   */
  extra?: Record<string, any>;
};
