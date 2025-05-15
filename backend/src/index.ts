import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const app = express();

app.use(cors());

app.use(express.json());

app.listen(7000, () => {
  console.log("server started on localhost:7000");
});
