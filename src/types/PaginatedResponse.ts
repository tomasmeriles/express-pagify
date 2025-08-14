import type { formatAndSendPaginated } from '../responses/formatAndSendPaginated.js';

// TODO: Change this to OffsetPaginatedResponse when releasing 1.0
export type PaginatedResponse = ReturnType<typeof formatAndSendPaginated>;
