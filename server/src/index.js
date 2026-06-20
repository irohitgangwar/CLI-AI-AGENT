import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";  // //Bridge between Express and Better Auth
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

//better auth 
app.use("/api/auth", toNodeHandler(auth)); //All auth routes (login, logout, callback) are now handled by better auth at /api/auth
app.use(express.json());

app.get("/api/me",async(req,res)=>{  //Get current user session info (if logged in, get user data)
  const session=await auth.api.getSession({
    headers:fromNodeHeaders(req.headers),
  });
  return res.json(session);
})

app.get("/device", async(req,res)=>{
  const {user_code}=req.query
  res.redirect(`http://localhost:3000/device?user_code=${user_code}`)
})


app.get('/health',(req,res)=>{
  res.send("ok");
})

app.listen(process.env.PORT || 3005, (req,res)=>{
console.log(`Server is running on http://localhost:${process.env.PORT || 3005}`);
})

