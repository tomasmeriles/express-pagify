import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    pagination?: {
      page: number;
      pageSize: number;
      skip: number;
      take: number;
    };
  }
}
