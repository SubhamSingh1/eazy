const EventEmitter = require("events");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

class CustomMessage {
  constructor(res) {
    this.response = res;
    this.events = new EventEmitter();
  }

  success(statusCode, message) {
    const { response, events } = this;
    events.once("success", () =>
      response.status(statusCode).json({ ...message })
    );
    return events.emit("success");
  }

  created(statusCode, message) {
    const { response, events } = this;
    events.once("created", () =>
      response.status(statusCode).json({ ...message })
    );
    return events.emit("created");
  }

  error(statusCode, message) {
    const { response, events } = this;
    events.once("error", () =>
      response.status(statusCode).json({ ...message })
    );
    return events.emit("error");
  }
}

const okResponse = (req, res, okMessage) => {
  return new CustomMessage(res).error(StatusCodes.OK, {
    response: {
      status: ReasonPhrases.OK,
      code: StatusCodes.OK,
      method: req.method,
      message: okMessage,
    },
  });
};

const unauthorizedResponse = (req, res, errMessage) => {
  return new CustomMessage(res).error(StatusCodes.UNAUTHORIZED, {
    response: {
      status: ReasonPhrases.UNAUTHORIZED,
      code: StatusCodes.UNAUTHORIZED,
      method: req.method,
      message: errMessage,
    },
  });
};

const badRequestResponse = (req, res, errMessage) => {
  return new CustomMessage(res).error(StatusCodes.BAD_REQUEST, {
    response: {
      status: ReasonPhrases.BAD_REQUEST,
      code: StatusCodes.BAD_REQUEST,
      method: req.method,
      message: errMessage,
    },
  });
};

module.exports = {
  unauthorizedResponse,
  badRequestResponse,
  okResponse,
};
