/** Typed HTTP errors that the error plugin turns into RFC 9457 problem details. */

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    readonly detail?: string,
  ) {
    super(detail ?? title);
  }
}

export const notFound = (resource: string) =>
  new HttpError(404, "Not Found", `${resource} not found`);
export const forbidden = () => new HttpError(403, "Forbidden", "You cannot access this resource");
export const unauthorized = () => new HttpError(401, "Unauthorized", "Sign in to continue");
export const tooManyRequests = () =>
  new HttpError(429, "Too Many Requests", "Slow down and retry later");
