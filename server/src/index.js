import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";  // //Bridge between Express and Better Auth
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();

app.use(cors());

//better auth 
app.use("/api/auth", toNodeHandler(auth)); //All auth routes (login, logout, callback) are now handled by better auth at /api/auth
app.use(express.json());

app.use(cors({
  origin: "https://localhost:3005",
methods: ["GET", "POST", "PUT", "DELETE"],
original: true,}));

app.get("/api/me",async(req,res)=>{  //Get current user session info (if logged in, get user data)
  const session=await auth.api.getSession({
    headers:fromNodeHeaders(req.headers),
  });
  return res.json(session);
})

app.get('/health',(req,res)=>{
  res.send("ok");
})

app.listen(process.env.PORT || 3001, (req,res)=>{
console.log(`Server is running on http://localhost:${process.env.PORT || 3001}`);
})

