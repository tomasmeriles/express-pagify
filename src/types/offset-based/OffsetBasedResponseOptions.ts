/**
 * Options for formatting and sending a paginated response.
 *
 * @template T - The type of the elements contained in the `data` array.
 */
export type OffsetBasedResponseOptions<T> = {
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
};
