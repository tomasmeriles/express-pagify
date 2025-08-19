declare global {
  namespace Express {
    interface Request {
      pagination?: {
        page?: number | undefined;
        pageSize?: number | undefined;
        skip?: number | undefined;
        take?: number | undefined;
        cursor?: unknown;
        fallbackValues: boolean;
      };
    }
  }
}

export {};
