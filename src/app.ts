import express, { type Application } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'
const app: Application = express();
// browser decide, which origin or url to access to data or request 
// need cors? -> if url doesn't match
app.use(cors({
  origin:process.env.APP_URL || "http://localhost:4000", // client site request 
  credentials:true // better auth by default set token in cookies, that's way need to access token that's way need to true 
   
})) 
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello, World! Hi there this is a good day.");
});

export default app;
