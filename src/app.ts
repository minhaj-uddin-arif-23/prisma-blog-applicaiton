import express, { type Application } from "express";
import { postRouter } from "./modules/post/post.route";

const app: Application = express();

app.use(express.json());

app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello, World! Hi there.");
});

export default app;
