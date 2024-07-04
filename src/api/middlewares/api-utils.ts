import { NextFunction, RequestHandler, Response } from "express";
import { RAResponse, handleLNResponse } from "../../utils/RAresponse";

type AsyncHandler = (
  req: RATypes.Request,
  res?: Response
) => Promise<RAResponse>;

/**
 * This utility serves as an alternative to wrapping express handlers with try/catch statements.
 * Any routes that use an async handler function should wrap the handler with this function.
 * Without this, any errors thrown will not be caught by the error handling middleware, and
 * the app will hang!
 */
function asyncHandler(handler: AsyncHandler): RequestHandler {
  return async (req: RATypes.Request, res: Response, next: NextFunction) => {
    try {
      const handlerData = await handler(req, res);
      return handleLNResponse(handlerData, res);
    } catch (error) {
      next(error);
    }
  };
}

export default asyncHandler;
