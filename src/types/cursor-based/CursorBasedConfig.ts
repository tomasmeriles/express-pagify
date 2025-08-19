import type { BasicMiddlewareConfig } from '../common/BasicMiddlewareConfig.js';

/**
 * Configuration for fallback values in cursor-based pagination.
 * These values are used when the provided cursor is invalid or missing,
 * allowing the middleware to still function with default parameters.
 */
export type FallBackCursorBased = {
  /**
   * Default value for the "last seen" item in the pagination sequence.
   * This can be a string, number, date, or `null` to indicate no starting point.
   */
  defaultLast: string | number | Date | null;

  /**
   * Default number of items to return per page when the limit is missing or invalid.
   */
  defaultLimit: number;
};

/**
 * Configuration object for the cursor-based pagination middleware.
 */
export type CursorBasedConfig<T extends Record<string, any>> =
  BasicMiddlewareConfig<FallBackCursorBased> & {
    /**
     * Name of the query parameter to read the Base64-encoded cursor from.
     * Defaults to something like 'c'.
     */
    cursorParamName: string;

    /**
     * Name of the property inside the decoded cursor object that stores
     * the "last seen" value in the pagination sequence.
     */
    lastPropertyName: keyof T;

    /**
     * Name of the property inside the decoded cursor object that stores
     * the maximum number of items to return per page.
     */
    limitPropertyName: keyof T;

    /**
     * Validator function to verify that the decoded cursor object
     * contains valid pagination parameters according to custom rules.
     * Should return `true` if values are valid, or `false` otherwise.
     *
     * @param cursor The decoded cursor object, or `undefined` if missing.
     */
    validatorFunction: (cursor: T | undefined) => boolean;
  };
