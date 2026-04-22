import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";

const { PORT = 3000 } = process.env;

const DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/product", productRouter);

app.use("/order", orderRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Server is running" });
});

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
