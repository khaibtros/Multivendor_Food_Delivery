import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Database connected!"));

const app = express();

app.use(cors());

app.use(express.json());

app.listen(7000, () => {
  console.log("Server running on localhost:7000");
});
