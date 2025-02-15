import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// connect to MongoDb
connectToDB();

const app = express();
app.use(express.json());
app.use(cors());

// Default Route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
