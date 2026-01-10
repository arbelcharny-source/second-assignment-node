import dotenv from "dotenv";
import express, { Express } from "express";
import router from "./routes/index.js"; 

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

export default app;