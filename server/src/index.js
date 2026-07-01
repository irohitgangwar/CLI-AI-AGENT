import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";  // //Bridge between Express and Better Auth
import { auth } from "./lib/auth.js";
import { Chatservice } from "./services/chat.service.js";

dotenv.config();

const app = express();
const chatService = new Chatservice();

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

// Middleware to verify session tokens for CLI API endpoints
async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = session.user;
  next();
}

// Conversation and message APIs for the CLI
app.post("/api/chat/conversations", requireAuth, async (req, res) => {
  const { conversationId, mode } = req.body;
  try {
    const conversation = await chatService.getOrCreateConversation(
      req.user.id,
      conversationId,
      mode
    );
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/chat/messages", requireAuth, async (req, res) => {
  const { conversationId, role, content } = req.body;
  try {
    const message = await chatService.addMessage(conversationId, role, content);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const messages = await chatService.getMessages(req.params.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/chat/conversations/:id", requireAuth, async (req, res) => {
  const { title } = req.body;
  try {
    const conversation = await chatService.updateTitle(req.params.id, req.user.id, title);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/device", async(req,res)=>{
  const {user_code}=req.query
  res.redirect(`http://localhost:3000/device?user_code=${user_code}`)
})


app.get('/health',(req,res)=>{
  res.send("ok");
})

app.listen(process.env.PORT || 3005, ()=>{
console.log(`Server is running on http://localhost:${process.env.PORT || 3005}`);
})

