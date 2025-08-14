import { type Response } from 'express';

export type BasicResponseOptions<T> = {
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
   * Additional arbitrary properties to include in the response.
   */
  extra?: Record<string, any>;
};
