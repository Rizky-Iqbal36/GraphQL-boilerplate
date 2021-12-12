import { ILocalizeMessage } from "@root/interfaces";
import { getLocalizedMsg } from "@util/i18n";
import { ApolloError } from "apollo-server-fastify";

interface IMessageOption {
  message?: string;
  localeMessage?: ILocalizeMessage;
}
interface IExtension {
  detail?: any;
  [key: string]: any;
}

class BaseException extends ApolloError {
  constructor(
    code: string,
    private readonly messageOption: IMessageOption,
    extension?: IExtension
  ) {
    super("INTERNAL_SERVER_ERROR", code, { ...extension });
    this.getMessage();
  }

  private async getMessage() {
    if (this.messageOption.message) {
      super.message = this.messageOption.message;
    } else if (this.messageOption.localeMessage) {
      super.message = getLocalizedMsg(this.messageOption.localeMessage);
    }
  }
}

export class ContextCreationError extends BaseException {
  constructor(messageOption: IMessageOption, details?: IExtension) {
    super("CONTEXT_CREATION_ERROR", messageOption, details);
  }
}

export class BadRequest extends BaseException {
  constructor(messageOption: IMessageOption, details?: IExtension) {
    super("BAD_REQUEST", messageOption, details);
  }
}

export class TooManyRequest extends BaseException {
  constructor(messageOption: IMessageOption, details?: IExtension) {
    super("TOO_MANY_REQUEST", messageOption, details);
  }
}

export class Unauthorized extends BaseException {
  constructor(details?: IExtension) {
    super("UNAUTHORIZED", { localeMessage: { key: "UNAUTHORIZED" } }, details);
  }
}

export class InternalServerError extends BaseException {
  constructor(details?: IExtension) {
    super(
      "INTERNAL_SERVER_ERROR",
      { localeMessage: { key: "INTERNAL_SERVER_ERROR" } },
      details
    );
  }
}

export default BaseException;
