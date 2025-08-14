import type { BasicMiddlewareConfig } from '../common/BasicMiddlewareConfig.js';

/**
 * Configuration for fallback pagination values.
 * These values are used when the provided pagination parameters
 * are invalid or missing, to ensure the middleware can still function.
 */
export type FallBackOffsetValues = {
  defaultPageValue: number;
  defaultPageSizeValue: number;
};

/**
 * Configuration object for the offset-based pagination middleware.
 */
export type OffsetBasedConfig = BasicMiddlewareConfig<FallBackOffsetValues> & {
  /**
   * Name of the query parameter to read the page number from.
   * Defaults to something like 'page'.
   */
  pagePropertyName: string;

  /**
   * Name of the query parameter to read the page size (items per page) from.
   * Defaults to something like 'pageSize'.
   */
  pageSizePropertyName: string;

  /**
   * Validator function to verify that parsed page and page size values
   * are valid according to custom rules.
   * Should return `true` if values are valid, or `false` otherwise.
   *
   * @param page Parsed page number.
   * @param pageSize Parsed page size (items per page).
   */
  validatorFunction: (page: number, pageSize: number) => boolean;
};
