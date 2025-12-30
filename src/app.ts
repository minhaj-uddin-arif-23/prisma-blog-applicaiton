import express, { type Application } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello, World! Hi there this is a good day.");
});

export default app;
