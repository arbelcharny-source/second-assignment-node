import dotenv from "dotenv";
import express, { Express } from "express";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.use(errorHandler);

export default app;