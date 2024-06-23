// app.js

import express from "express";
import cors from "cors";
import { json } from "express";
import dotenv from "dotenv";
import "./db/conn.js"; // Import the database connection setup
import router from "./routes/router.js";
const path = require('path')

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 6002;

app.use(cors());
app.use(json());

app.use(express.static(path.join(__dirname, './client/build')))

app.get("/", (req, res) => {
  res.status(200).json("Server starts");
});

app.use("/api", router); // Use the router for handling requests

app.get("*",function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
