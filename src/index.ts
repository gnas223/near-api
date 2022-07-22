import express, { Application } from "express";
import http from "http";
import compression from "compression";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import config from "./config/config";
import router from "./routes/index";
import logging from "./config/logging";
import mongoose from "mongoose";
import "./controllers/liquidityVolume/liquidityVolumeFor15m.controller";
// import "./controllers/liquidityVolume/liquidityVolumeFor5m.controller";
// import "./schedules/volumeStat";
// import "./schedules/liquidityStat";
// import "./schedules/updateTokenPrice";

const NAMESPACE: string = "Server";

const app: Application = express();

/** mongoose connection */

mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, "Mongo Connected");
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

app.use(compression());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** import router */
app.use("/", router);

/** Error handling */
app.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(app);

httpServer.listen(config.server.port, () => {
  logging.info(
    NAMESPACE,
    `Server is running ${config.server.hostname}:${config.server.port}`
  );
});
