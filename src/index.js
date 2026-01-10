import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { connectToDB } from "./config/mongo-db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

