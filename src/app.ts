import cors from "cors";
import express, { json, urlencoded } from "express";
import addApiRoute from "./api/routes";
import helmet from "helmet";
import errorHandlingMiddleware from "./api/middlewares/error";

function buildapp(): express.Application {
  const app = express();

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cors());
  app.use(helmet());

  addApiRoute(app);

  app.use(errorHandlingMiddleware);

  return app;
}

export default buildapp();
