/**
 * Configuration for fallback pagination values.
 * These values are used when the provided pagination parameters
 * are invalid or missing, to ensure the middleware can still function.
 */
export type FallBackValuesConfig = {
  defaultPageValue: number;
  defaultPageSizeValue: number;
};

/**
 * Configuration object for the offset-based pagination middleware.
 */
export type PagifyOffsetBasedConfig = {
  /**
   * Flag to completely disable pagination middleware functionality.
   * When `true`, the middleware will do nothing and pass control immediately.
   */
  disablePagination: boolean;

  /**
   * List of HTTP methods for which pagination should be processed.
   * For example: ['GET', 'POST']. Pagination is skipped on other methods.
   */
  supportedHttpMethods: string[];

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
   * Fallback values for pagination to be used if the provided values
   * are missing or invalid. If set to `false`, no fallback is used
   * and invalid pagination will cause an error.
   */
  fallBackValues: FallBackValuesConfig | false;

  /**
   * Error message string to be used when invalid pagination
   * parameters are encountered and no valid fallback is available.
   */
  invalidValuesMessage: string;

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
