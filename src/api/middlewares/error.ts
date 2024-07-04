import crypto from "crypto";
import RAError from "../../utils/RAerror";
import { NextFunction, Response } from "express";
import { RAResponse, handleLNResponse } from "../../utils/RAresponse";

import Logger from "../../utils/logger";

async function errorHandlingMiddleware(
  error: Error,
  req: RATypes.Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const raError = error as RAError;

    const raResponse = new RAResponse();
    raResponse.status = 500;
    raResponse.data = {
      errorId: raError.errorId ?? crypto.randomUUID(),
      uid: raError.uid ?? req.ctx?.decodedToken?.uid,
    };

    if (/ECONNREFUSED.*27017/i.test(error.message)) {
      raResponse.message = "Could not connect to the database. It may be down.";
    } else if (error instanceof URIError || error instanceof SyntaxError) {
      raResponse.status = 400;
      raResponse.message = "Unprocessable request";
    } else if (error instanceof RAError) {
      raResponse.message = error.message;
      raResponse.status = error.status;
    } else {
      raResponse.message = `Oops! Our backend messed up. Please try again later. - ${raResponse.data.errorId}`;
    }

    if (raResponse.status < 500) {
      delete raResponse.data.errorId;
    }

    return handleLNResponse(raResponse, res);
  } catch (e) {
    Logger.error("Error handling middleware failed.");

    Logger.error(e);
  }

  return handleLNResponse(
    new RAResponse(
      "Something went really wrong, please contact support.",
      undefined,
      500
    ),
    res
  );
}

export default errorHandlingMiddleware;
