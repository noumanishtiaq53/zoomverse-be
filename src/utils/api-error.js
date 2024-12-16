import { HTTP_CODES } from "../constants/http-codes.constant.js";

class ApiError extends Error {
  constructor(
    statusCode = HTTP_CODES?.INTERNAL_SERVER_ERROR,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class BadRequestError extends ApiError {
  constructor(message, errors = [], stack = "") {
    super(HTTP_CODES?.BAD_REQUEST, message, errors, stack);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Something went wrong", errors = [], stack = "") {
    super(HTTP_CODES?.NOT_FOUND, message, errors, stack);
  }
}

class ConflictError extends ApiError {
  constructor(message, errors = [], stack = "") {
    super(HTTP_CODES?.CONFLICTS, message, errors, stack);
  }
}

class UnAuthorizedError extends ApiError {
  constructor(message, errors = [], stack = "") {
    super(HTTP_CODES?.UNAUTHORIZED, message, errors, stack);
  }
}

export {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnAuthorizedError,
  ConflictError,
};
