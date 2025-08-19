# express-pagify

A simple and flexible Express middleware for API pagination

[![npm version](https://img.shields.io/npm/v/express-pagify.svg)](https://www.npmjs.com/package/express-pagify)

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [Offset-Based (pagify)](#offset-based-middleware-pagify)
  - [Cursor-Based (pagifyCursorBased)](#cursor-based-middleware-pagifycursorbased)
- [Usage](#usage)
  - [Offset-Based (pagify)](#offset-based-pagify)
  - [Cursor-Based (pagifyCursorBased)](#cursor-based-pagifycursorbased)
- [Response Helpers](#response-helpers)
  - [Offset-based pagination response](#offset-based-pagination-response)
  - [Cursor-based pagination response](#cursor-based-pagination-response)

## Installation

This package is distributed via the npm registry.

Make sure you have [Node.js](https://nodejs.org/) 18 or higher installed.

If this is a new project, initialize it with:

```bash
npm init -y
```

Then run:

```bash
npm install express-pagify
```

## Configuration

### Offset-based middleware (pagify)

| Option                   | Type                                          | Default                                               | Description                                                                                                                                                                       |
| ------------------------ | --------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **fallBackValues**       | `object \| false`                             | `false`                                               | Defines default pagination values. If set to `false`, fallbacks are disabled, and an error is thrown when any value is invalid.                                                   |
| **invalidValuesMessage** | `string`                                      | `"One or more required paginated values are missing"` | Error message to be used when invalid pagination parameters are encountered                                                                                                       |
| **supportedHttpMethods** | `string[]`                                    | `["GET"]`                                             | Restrict pagination middleware to specific HTTP methods.                                                                                                                          |
| **pageParamName**        | `string`                                      | `"page"`                                              | Name of the query parameter that defines the current page.                                                                                                                        |
| **pageSizeParamName**    | `string`                                      | `"pageSize"`                                          | Name of the query parameter that defines the number of items per page.                                                                                                            |
| **validatorFunction**    | `(page: number, pageSize: number) => boolean` | `(page, pageSize) => true`                            | A custom validation function for pagination parameters. If provided, it will be called with the raw query param value. Must return `true` for valid values and `false` otherwise. |

#### Fallback Values

The `fallBackValues` object allows you to define defaults for each pagination property.

| Key                  | Type     | Description                                             |
| -------------------- | -------- | ------------------------------------------------------- |
| defaultPageValue     | `number` | Used when `page` query param is missing or invalid.     |
| defaultPageSizeValue | `number` | Used when `pageSize` query param is missing or invalid. |

### Cursor-based middleware (pagifyCursorBased)

The configuration object used by the cursor-based pagination middleware.  
`T` represents the decoded cursor object, e.g. `{ last: string; limit: number }`.

| Option                   | Type                                  | Default                                               | Description                                                                              |
| ------------------------ | ------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **fallBackValues**       | `object \| false`                     | `false`                                               | Defines default pagination values. If `false`, fallback is disabled and throws an error. |
| **invalidValuesMessage** | `string`                              | `"One or more required paginated values are missing"` | Error message to be used when invalid pagination parameters are encountered              |
| **supportedHttpMethods** | `string[]`                            | `["GET"]`                                             | Restrict pagination middleware to specific HTTP methods.                                 |
| **cursorParamName**      | `string`                              | `"c"`                                                 | Name of the query parameter that contains the Base64 cursor.                             |
| **lastPropertyName**     | `keyof T`                             | `"last"`                                              | Property in the cursor that represents the "last seen" item.                             |
| **limitPropertyName**    | `keyof T`                             | `"limit"`                                             | Property in the cursor that represents the page size.                                    |
| **validatorFunction**    | `(cursor: T \| undefined) => boolean` | `(cursor) => true`                                    | A custom validation function that validates cursor values.                               |

#### Fallback Values

The `fallBackValues` object allows you to define defaults for each pagination property.

| Key          | Type                               | Description                                                      |
| ------------ | ---------------------------------- | ---------------------------------------------------------------- |
| defaultLast  | `string \| number \| Date \| null` | Used when the `last` value in the cursor is missing or invalid.  |
| defaultLimit | `number`                           | Used when the `limit` value in the cursor is missing or invalid. |

## Usage

### Offset-based (pagify)

This middleware reads selected pagination parameters from the query string, validates them, and attaches a standardized `pagination` object to
the `req` object for downstream handlers to use.

```js
import express from 'express';
import { pagify } from 'express-pagify';

const app = express();

app.use(
  pagify({
    pageParamName: 'page', // query param for current page
    pageSizeParamName: 'pageSize', // query param for page size
  })
);

app.get('/items', (req, res) => {
  // req.pagination will always be normalized and validated
  const { page, pageSize, skip, take } = req.pagination;

  // Example: fetch items with your DB client
  // const items = await db.getItems({ skip, take });

  res.json({ page, pageSize, skip, take, data: [] });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Cursor-based (pagifyCursorBased)

This middleware handles cursor-based pagination.
It reads a Base64-encoded cursor from the query string, decodes it, validates it, and attaches it to `req.pagination.cursor` for downstream handlers.

```ts
import express from 'express';
import { pagifyCursorBased } from 'express-pagify';
import { type MyCursorType } from './types/MyCursorType.ts';

const app = express();

app.get(
  '/items',
  pagifyCursorBased<MyCursorType>({
    cursorParamName: 'cursor',
    validatorFunction: (cursor) => !!cursor?.last && cursor.limit > 0,
    fallBackValues: { defaultLast: null, defaultLimit: 20 },
  }),
  (req, res) => {
    // Access parsed cursor
    const { cursor } = req.pagination;
    const { last, limit } = cursor;

    // Example: fetch items with your DB client
    // const items = await db.getItems({ last, limit });

    res.json({ cursor, data: [] });
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Response Helpers

In addition to the pagination middlewares, the package provides helper functions to send standardized paginated responses.

### Offset-based pagination response

Sends a response using offset-based pagination.

```ts
offsetBasedResponse<T>({
  res,
  data,
  skip,
  take,
  total,
  status = 200,
  extra = {},
});
```

| Key      | Type                              | Description                                                                                                        |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `res`    | `Response`                        | Express response object where the paginated result will be sent.                                                   |
| `data`   | `T[]`                             | Array of paginated items (the current page of results).                                                            |
| `skip`   | `number`                          | Number of items skipped before this page (can be obtained from `req.pagination.skip` if the middleware is active). |
| `take`   | `number`                          | Number of items requested for this page (can be obtained from `req.pagination.take` if the middleware is active).  |
| `total`  | `number`                          | Total number of items available in the collection.                                                                 |
| `status` | `number` (optional, default: 200) | HTTP status code for the response.                                                                                 |
| `extra`  | `object` (optional)               | Additional fields to merge into the response object.                                                               |

Example:

```ts
import { type Items } from './types/Items';

const items = await prisma.user.findMany({ skip, take });
const total = await prisma.user.count();

offsetBasedResponse<Items[]>({
  res,
  data: items,
  skip,
  take,
  total,
  status: 200,
  extra: {
    cool: true,
  },
});
```

Response Shape:

```ts
  {
    data: T[];
    pagination: {
      page: number;
      pageSize: number;
      skip: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    // Extra fields merged into the response
    [key: string]: any;
  }
```

### Cursor-based pagination response

Sends a response using cursor-based pagination.

```ts
cursorBasedResponse<T>({
  res,
  data,
  nextCursor,
  prevCursor,
  limit,
  count,
  status = 200,
  extra = {},
});
```

| Key          | Type                              | Description                                                                                                                                                   |
| ------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `res`        | `Response`                        | Express response object where the paginated result will be sent.                                                                                              |
| `data`       | `T[]`                             | Array of paginated items (the current page of results).                                                                                                       |
| `nextCursor` | `object \| null`                  | Cursor object for the next page (Base64 encoded internally), or `null` if none.                                                                               |
| `prevCursor` | `object \| null`                  | Cursor object for the previous page (Base64 encoded internally), or `null` if none.                                                                           |
| `limit`      | `number`                          | Maximum number of items per page (can be obtained from the property defined in the cursor, e.g., `req.pagination.cursor.limit`, if the middleware is active). |
| `count`      | `number`                          | Number of items returned in the current response.                                                                                                             |
| `status`     | `number` (optional, default: 200) | HTTP status code for the response.                                                                                                                            |
| `extra`      | `object` (optional)               | Additional fields to merge into the response object.                                                                                                          |

Example:

```ts
import { type Items } from './types/Items';

const items = await prisma.user.findMany({ take: 20 });
const count = items.length;

cursorBasedResponse<Items[]>({
  res,
  data: items,
  nextCursor: null,
  prevCursor: { id: 10 }, // internally encoded as Base64 string
  limit: 20,
  count,
  status: 200,
  extra: {
    cool: true,
  },
});
```

Response Shape:

```ts
{
  data: T[];
  pagination: {
  nextCursor: string | null;
  prevCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
  limit: number;
  count: number;
  };
  // Extra fields merged into the response
  [key: string]: any;
}
```
