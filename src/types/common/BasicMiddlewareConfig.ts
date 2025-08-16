export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

export type BasicMiddlewareConfig<T> = {
  /**
   * List of HTTP methods for which pagination should be processed.
   * For example: ['GET', 'POST']. Pagination is skipped on other methods.
   */
  supportedHttpMethods: HttpMethod[];

  /**
   * Fallback values to be used if the cursor is missing or invalid.
   * If set to `false`, no fallback is used and invalid pagination
   * will cause an error.
   */
  fallBackValues: T | false;

  /**
   * Error message to be used when invalid pagination parameters
   * are encountered and no valid fallback is available.
   */
  invalidValuesMessage: string;
};
