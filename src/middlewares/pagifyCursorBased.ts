import type { PagifyCursorBasedConfig } from '../types/PagifyCursorBasedConfig.js';
import type { Request, Response, NextFunction } from 'express';
import { isString } from '../utils/typeguards/isString.js';
import { InvalidPaginationValuesError } from '../errors/InvalidPaginationValuesError.js';
import { DEFAULTS } from '../constants/defaults.js';

/**
 * Creates an Express middleware for handling **cursor-based pagination**.
 *
 * This middleware:
 * - Reads a Base64-encoded cursor from the request query.
 * - Decodes and parses it into a JavaScript object.
 * - Validates the decoded cursor using a custom validator function.
 * - Optionally applies fallback values if the cursor is missing or invalid.
 * - Attaches the cursor to `req.pagination` for downstream handlers.
 *
 * @template T - Shape of the cursor object (must be a record with string keys).
 *
 * @param {Partial<PagifyCursorBasedConfig<T>>} config
 * Configuration object to customize pagination behavior.
 *
 * @returns An Express middleware function that attaches `req.pagination.cursor`
 * when pagination is successfully processed.
 *
 * @throws {InvalidPaginationValuesError}
 * Thrown if:
 * - The cursor is invalid,
 * - No fallback values are configured, and
 * - `fallBackValues` is `false`.
 *
 * @example
 * ```ts
 * app.get('/items', pagifyCursorBased({
 *   cursorParamName: 'cursor',
 *   validatorFunction: (cursor) => !!cursor?.last && cursor.limit > 0,
 *   fallBackValues: { defaultLast: null, defaultLimit: 20 }
 * }), (req, res) => {
 *   // Access parsed cursor:
 *   // req.pagination.cursor = { last: "abc123", limit: 20 }
 * });
 * ```
 */
export function pagifyCursorBased<T extends Record<string, any>>(
  config: Partial<PagifyCursorBasedConfig<T>>
) {
  // Merge provided config with defaults, ensuring all fields are present
  const fullConfig: Required<PagifyCursorBasedConfig<T>> = {
    disablePagination: false,
    supportedHttpMethods: ['GET'],
    cursorParamName: DEFAULTS.CURSOR_PARAM_NAME,
    lastPropertyName: 'last' as keyof T,
    limitPropertyName: 'limit' as keyof T,
    fallBackValues: false,
    validatorFunction: () => true,
    invalidValuesMessage: DEFAULTS.INVALID_VALUES_MESSAGE,
    ...config,
  };

  // If pagination is disabled, return a middleware that just calls next().
  if (fullConfig.disablePagination) {
    //TODO: Set req.pagination.cursor = undefined when releasing 1.0
    return function (_req: Request, _res: Response, next: NextFunction) {
      return next();
    };
  }

  // Actual middleware function to handle pagination.
  return function (req: Request, res: Response, next: NextFunction) {
    // Only process pagination if the HTTP method is in the supported list.
    if (!fullConfig.supportedHttpMethods.includes(req.method)) {
      return next();
    }

    // Retrieve the cursor from the query string
    const cursorB64 = req.query[fullConfig.cursorParamName];
    let decodedCursor: T | undefined = undefined;

    // Decode Base64 and parse JSON if cursor is a string
    if (isString(cursorB64)) {
      decodedCursor = JSON.parse(atob(cursorB64));
    }

    // Validate the parsed values with the provided validator function.
    const isValid = fullConfig.validatorFunction(decodedCursor);

    // If cursor is invalid, check for fallback values
    let fallbackValues = false;
    if (!isValid) {
      if (
        !fullConfig.fallBackValues ||
        !('defaultLast' in fullConfig.fallBackValues) ||
        !fullConfig.fallBackValues.defaultLimit
      ) {
        throw new InvalidPaginationValuesError(fullConfig.invalidValuesMessage);
      }

      // Apply fallback values when cursor is invalid
      decodedCursor = {
        [fullConfig.lastPropertyName]: fullConfig.fallBackValues.defaultLast,
        [fullConfig.limitPropertyName]: fullConfig.fallBackValues.defaultLimit,
      } as T;
      fallbackValues = true;
    }

    // Attach the parsed or fallback cursor to the request
    req.pagination = {
      ...req.pagination,
      cursor: decodedCursor,
      fallbackValues,
    };

    // Continue to next middleware/handler
    return next();
  };
}
