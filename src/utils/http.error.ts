export class HttpError extends Error {
  constructor(public statusCode: number, message: string, public emptyData: any = null) {
    super(message);
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found", emptyData: any = []) {
    super(404, message, emptyData);
  }
}

//For duplicate, missing, or malformed)
export class BadRequestError extends HttpError {
  constructor(message: string = "Request invalid") {
    super(400, message);
  }
}

// For "resource conflict" like duplicates
export class ConflictError extends HttpError {
  constructor(message: string = "Resource conflict") {
    super(409, message);
  }
}

// For server errors that are not handled)
export class ServerError extends HttpError {
  constructor(message: string = "Server error") {
    super(500, message);
  }
}

export class ExceptionProcessor {
  static handle(err: any): never {
    // Check HttpError instances FIRST before other checks
    if (err instanceof HttpError) {
      throw err;
    }

    if (err?.response) {
      this.handleResponseError(err.response, err.message);
    }

    if (err?.statusCode && typeof err.statusCode === "number") {
      this.handleStatusCodeError(err.statusCode, err.message);
    }

    throw new ServerError(err?.message || "Internal server error");
  }

  private static handleResponseError(response: any, fallbackMessage: string = "Unexpected error"): never {
    const { status, data } = response;
    const message = data?.resp_msg || fallbackMessage;
    const payload = data ?? null;

    if (status >= 500) {
      throw new ServerError(message);
    }

    if (status >= 400 && status < 500) {
      this.throwClientError(status, message, payload);
    }

    throw new ServerError(message);
  }

  private static handleStatusCodeError(
    statusCode: number,
    fallbackMessage: string = "Unexpected error",
  ): never {
    if (statusCode >= 500) {
      throw new ServerError(fallbackMessage);
    }

    if (statusCode >= 400 && statusCode < 500) {
      this.throwClientError(statusCode, fallbackMessage);
    }

    throw new ServerError(fallbackMessage);
  }

  private static throwClientError(status: number, message: string, payload?: any): never {
    switch (status) {
      case 400:
        throw new BadRequestError(message);
      case 401:
        throw new HttpError(401, message, null);
      case 404:
        throw new NotFoundError(message, payload?.data ?? []);
      case 409:
        throw new ConflictError(message);
      default:
        throw new HttpError(status, message, payload ?? null);
    }
  }
}
