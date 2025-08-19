import type { CursorBasedResponseOptions } from '../types/cursor-based/CursorBasedResponseOptions.js';

/**
 * Sends an HTTP response with paginated data using cursor-based pagination.
 *
 * @template T - Type of each item in the `data` array.
 *
 * @param {CursorBasedResponseOptions<T>} options - Configuration and data for the response.
 *
 * @returns The response sended in `res.send`.
 */
export function cursorBasedResponse<T>({
  res,
  data,
  status = 200,
  nextCursor,
  prevCursor,
  limit,
  count,
  extra = {},
}: CursorBasedResponseOptions<T>) {
  // Encode the next cursor as a base64 string
  let encodedNextCursor: string | null = null;
  if (nextCursor) {
    encodedNextCursor = btoa(JSON.stringify(nextCursor));
  }

  // Encode the previous cursor as a base64 string
  let encodedPrevCursor: string | null = null;
  if (prevCursor) {
    encodedPrevCursor = btoa(JSON.stringify(prevCursor));
  }

  // Build the response object with the standard cursor-based pagination structure
  const response = {
    data,
    pagination: {
      nextCursor: encodedNextCursor,
      prevCursor: encodedPrevCursor,
      hasNext: !!nextCursor,
      hasPrevious: !!prevCursor,
      limit,
      count,
    },
    ...extra,
  };

  // Send the HTTP response with the specified status
  res.status(status).send(response);

  return response;
}
