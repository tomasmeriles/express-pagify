import type { OffsetBasedResponseOptions } from '../types/offset-based/OffsetBasedResponseOptions.js';

/**
 * Formats and sends a standardized paginated response for REST APIs using Express.
 *
 * Constructs a response object containing the paginated data and useful pagination metadata
 * such as current page, total pages, and flags indicating presence of next/previous pages.
 * It also allows additional properties to be merged into the response.
 *
 * @template T - The type of the elements inside the `data` array.
 *
 * @returns The Express response after sending the paginated data.
 */
export function offsetBasedResponse<T>({
  res,
  data,
  skip,
  take,
  total,
  status = 200,
  extra = {},
}: OffsetBasedResponseOptions<T>) {
  const page = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(total / take);

  const response = {
    data,
    pagination: {
      page,
      pageSize: take,
      skip,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
    ...extra,
  };

  res.status(status).send(response);

  return response;
}
