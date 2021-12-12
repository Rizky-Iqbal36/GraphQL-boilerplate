import BaseException, { ContextCreationError } from "@app/exceptions";
import { FormatError } from "@app/apollo";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

export const formatError: FormatError = (err, ctx) => {
  if (err instanceof ContextCreationError)
    err.message = err.message.split("Context creation failed: ")[1];

  const { originalError } = err;
  if (
    originalError instanceof BaseException ||
    err instanceof ContextCreationError
  ) {
    const request = ctx.req;
    const error = _.omit(err, ["locations"]);
    error.extensions["x-trace-id"] = request?.headers["x-trace-id"] || uuidv4();
    delete error.extensions.exception;
    return error;
  }
  return err;
};
