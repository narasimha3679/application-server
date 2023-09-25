import express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource, redisClient } from "./data-source";
import { Routes } from "./routes";
import { errorHandler } from "../utils/errorHandler";
import { verifyToken } from "../utils/verifyJWT";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json({ limit: "20mb" }));

    // register express routes from defined application routes
    Routes.forEach((route) => {
      if (route.requiresAuth) {
        app[route.method](route.route, verifyToken, async (req, res, next) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );

            res.status(result.status).send(result.message);
          } catch (error) {
            next(error);
          }
        });
      } else {
        // Routes that do not require authentication
        app[route.method](route.route, async (req, res, next) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            res.status(result.status).send(result.message);
          } catch (error) {
            next(error);
          }
        });
      }
    });

    // setup express app here
    // ...
    app.use(errorHandler);

    // start express server
    app.listen(3000);
    console.log("Express server has started on port 3000. ");
  })
  .catch((error) => console.log(error));
