import type { PagifyOffsetBasedConfig } from '../types/PagifyOffsetBasedConfig.js';
import type { Request, Response, NextFunction } from 'express';
import { defaultValidatorFunction } from '../utils/defaultValidatorFunction.js';
import { InvalidPaginationValuesError } from '../errors/InvalidPaginationValuesError.js';
import { isString } from '../utils/typeguards/isString.js';
import { DEFAULTS } from '../constants/defaults.js';

/**
 * Middleware for handling offset-based pagination in Express.
 *
 * This middleware reads pagination parameters from the query string,
 * validates them, and attaches a standardized `pagination` object to
 * the `req` object for downstream handlers to use.
 *
 * - Supports default values through `fallBackValues` if invalid/missing.
 * - Can be disabled entirely via `disablePagination`.
 *
 * @param config - Optional configuration object to customize pagination behavior.
 *                 Any missing fields will be filled with default values.
 *
 * @returns Express middleware function.
 *
 * @throws {InvalidPaginationValuesError}
 * Thrown if:
 * - Validator function returns false,
 * - No fallback values are configured, and
 * - `fallBackValues` is `false`.
 * @example
 * // Basic usage
 * app.use(pagify());
 *
 * @example
 * // Custom configuration
 * app.use(pagify({
 *   pagePropertyName: 'p',
 *   pageSizePropertyName: 'limit',
 *   validatorFunction: (page, size) => page > 0 && size <= 50,
 *   fallBackValues: { defaultPageValue: 1, defaultPageSizeValue: 20 }
 * }));
 */
export function pagifyOffsetBased(config?: Partial<PagifyOffsetBasedConfig>) {
  // Merge user config with defaults to ensure all required fields are set.
  const fullConfig: Required<PagifyOffsetBasedConfig> = {
    disablePagination: false,
    supportedHttpMethods: ['GET'],
    pagePropertyName: DEFAULTS.PAGE_PROPERTY_NAME,
    pageSizePropertyName: DEFAULTS.PAGE_SIZE_PROPERTY_NAME,
    invalidValuesMessage: DEFAULTS.INVALID_VALUES_MESSAGE,
    validatorFunction: defaultValidatorFunction,
    // TODO: Change this values to false when releasing 1.0
    fallBackValues: {
      defaultPageValue: 1,
      defaultPageSizeValue: 10,
    },
    ...config,
  };

  // If pagination is disabled, return a middleware that just calls next().
  if (fullConfig.disablePagination) {
    // TODO: Make this a utils function
    return function (_req: Request, _res: Response, next: NextFunction) {
      //TODO: Set req.pagination.page and pagesize = undefined when releasing 1.0
      // TODO: Return this value when releasing 1.0
      next();
    };
  }

  // Actual middleware function to handle pagination.
  return function (req: Request, res: Response, next: NextFunction) {
    // Only process pagination if the HTTP method is in the supported list.
    if (!fullConfig.supportedHttpMethods.includes(req.method)) {
      return next();
    }

    // Extract raw page and pageSize values from query string.
    const pageRaw = req.query[fullConfig.pagePropertyName];
    const pageSizeRaw = req.query[fullConfig.pageSizePropertyName];

    let parsedPage: number | undefined = undefined;
    let parsedPageSize: number | undefined = undefined;

    // Parse page and pageSize strings to numbers if possible.
    if (isString(pageRaw) && isString(pageSizeRaw)) {
      const p = parseInt(pageRaw, 10);
      const ps = parseInt(pageSizeRaw, 10);

      // Only assign if both are valid numbers.
      if (!isNaN(p) && !isNaN(ps)) {
        parsedPage = p;
        parsedPageSize = ps;
      }
    }

    // Validate the parsed values with the provided validator function.
    const validValues =
      parsedPage !== undefined && parsedPageSize !== undefined
        ? fullConfig.validatorFunction(parsedPage, parsedPageSize)
        : false;

    // If invalid values and no fallbacks configured, throw an error.
    let fallbackValues = false;
    if (!validValues) {
      if (
        !fullConfig.fallBackValues ||
        !fullConfig.fallBackValues.defaultPageValue ||
        !fullConfig.fallBackValues.defaultPageSizeValue
      ) {
        throw new InvalidPaginationValuesError(fullConfig.invalidValuesMessage);
      }

      // Use fallback pagination values if available.
      parsedPage = fullConfig.fallBackValues.defaultPageValue;
      parsedPageSize = fullConfig.fallBackValues.defaultPageSizeValue;
      fallbackValues = true;
    }

    // Sanity check: pagination values should be defined here.
    if (parsedPage === undefined || parsedPageSize === undefined) {
      throw new Error('Unexpected undefined pagination values');
    }

    // Attach the pagination info to the request object for downstream use.
    req.pagination = {
      page: parsedPage,
      pageSize: parsedPageSize,
      skip: (parsedPage - 1) * parsedPageSize, // Calculate offset for DB queries.
      take: parsedPageSize, // Number of items to fetch.
      fallbackValues,
    };

    // Continue to the next middleware or route handler.
    // TODO: Return this value when releasing 1.0
    next();
  };
}
