import "dotenv/config";
import app from "./app";
import Logger from "./utils/logger";
// Boot server and initalize all services and crash if a service is failed to initialize
async function bootServer(PORT_NUMBER) {
  try {
    Logger.info(`Server started`);
    Logger.info(`Starting server in ${process.env.APP_ENV} environment`);
    //TODO: make this a dynamic version
    Logger.info("Version: 1.0.0");

    Logger.info("Initializing firebase...");
  } catch (error) {
    Logger.error(`Failed to start the server`);
    Logger.error(error.message);
    return process.exit(1);
  }

  return app.listen(PORT_NUMBER, () => {
    Logger.info(`API server listening on PORT:${PORT_NUMBER}`);
  });
}

const PORT_NUMBER = parseInt(process.env.PORT_NUMBER ?? "6565");

bootServer(PORT_NUMBER);
