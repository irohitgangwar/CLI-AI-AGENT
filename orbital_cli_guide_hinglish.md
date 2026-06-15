# 🛠️ Orbital CLI: Full-Stack AI Agent Companion Guide (Hinglish Version)

Hey! Agar aap video tutorial ko follow karte hue **Orbital CLI** (ek full-stack CLI AI Agent) bana rahe hain, toh yeh guide aapke liye perfect companion hai. 

Is guide me humne complex "tech-bro" english language ko super simple **Hinglish** (Hindi words in English script) comments me convert kiya hai taaki aap har code block ke piche ka logic aasani se samajh sakein. Saath hi, video me editing mistake ki wajah se **Chapter 4 ke Part 1 aur Part 2 ka order swapped tha**, jise humne yahan chronological order me correct kar diya hai.

---

## 📂 Project Architecture Overview

Yeh project ek **Microservices-style Architecture** par chalta hai:
1. **Frontend (`client/`)**: Next.js App Router jo authentication UI aur user session status display karega.
2. **Backend (`server/`)**: Express.js server jo Prisma ORM ke through PostgreSQL (Neon DB) se connect hoga aur Gemini AI SDK tools ko handle karega.
3. **CLI Agent (`cli/` ya executable script)**: Command line tool jo user credentials collect karega, AI model se chat karega, local scripts execute karega, aur directory structures automatic generate karega.

```mermaid
graph TD
    A[Terminal CLI / Orbital Client] <-->|Device Flow Authentication| B[Express Backend Server]
    B <-->|Prisma ORM| C[(Neon PostgreSQL Database)]
    A <-->|Chat & Agentic Mode APIs| B
    B <-->|Vercel AI SDK| D[Gemini AI Engine]
    E[Web Browser] <-->|GitHub OAuth Approval| B
```

---

## 🛠️ Chapter 1: Project Initialization (Foundation Setup)

Is chapter me hum **Client** (Next.js) aur **Server** (Express) ka primary structure config karenge.

### 1. Folder Setup
Sabse pehle main workspace directory me `client` aur `server` folders banayein:
```bash
# Main workspace folder ke andar
mkdir client server
```

### 2. Client Side Setup (Next.js)
```bash
# Client folder me jao
cd client

# Next.js initialize karo (React 19, TypeScript, Tailwind CSS)
npx create-next-app@latest . --typescript
```

### 3. Server Side Setup (Express)
```bash
# Server folder me jao
cd ../server

# Node project initialize karo
npm init -y

# Express aur requirements install karo
npm install express@5.2.1 better-auth@1.6.5 @prisma/client@5.22.0 cors@2.8.6 dotenv@17.4.2
npm install --save-dev prisma@5.22.0 nodemon
```

---

## 🗄️ Chapter 2: Database Setup (PostgreSQL & Prisma)

Yahan hum database design tayyar karenge jo user sessions aur message histories ko store karega.

### 1. Database URL configuration
Ek Neon DB (PostgreSQL) instance banayein aur uski URL server ke `.env` file me add karein:

```env
# server/.env
DATABASE_URL="postgresql://neondb_owner:password@ep-cool-cloud.aws.neon.tech/orbitals?sslmode=require"
PORT=3001
```

### 2. Define Prisma Schema
Prisma models user aur authentication ke liye design kiye gaye hain. Is file ko check karein: `server/prisma/schema.prisma`.

```prisma
// server/prisma/schema.prisma

// Database connection parameters setup
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider   = "prisma-client-js"
  engineType = "binary"
}

// User Model - Jo registered user ka basic profile store karega
model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

// Session Model - Active logins track karne ke liye
model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

// Account Model - Social Login (GitHub/Google) link karne ke liye
model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

// Verification Model - OTP aur Email Link validation ke liye
model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
```

### 3. Prisma Initialization Code
Database setup complete hone par, Prisma client initialize karein:

```javascript
// server/src/lib/db.js
// -------------------------------------------------------------
// Hum database connection reuse karenge taaki hot-reload se crashes na ho.
// -------------------------------------------------------------

import { PrismaClient } from "@prisma/client";

// Global object me database instance check karo, nahi toh naya banao
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ["query"], // Query logs print karne ke liye taaki debug aasan ho
  });

// Production environment nahi hai toh connection variable global save karlo
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

Database schema sync karne ke liye run karein:
```bash
npx prisma db push
```

---

## 🔐 Chapter 3: Better-Auth Integration (Web Authentication)

Hum backend aur frontend dono me authentication enable karenge taaki user GitHub details se secure login kar sakein.

### 1. Backend Authentication Configuration
Create `server/src/lib/auth.js`:

```javascript
// server/src/lib/auth.js
// -------------------------------------------------------------
// Better-Auth configuration with Prisma Database Adapter
// -------------------------------------------------------------

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db.js";

export const auth = betterAuth({
  // Backend server URL batayein
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  
  // Custom secret code jo session security handle karega
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-12345",
  
  // Database store setup using Prisma translation adapter
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // Social GitHub OAuth login setup
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

### 2. Connect Auth to Express Server
Mount Better-Auth handler inside `server/src/index.js`. 

> [!WARNING]
> **Middleware Order Warning (Very Important)**:
> `toNodeHandler(auth)` stream consume karta hai. Isliye is middleware routing ko **`express.json()` se pehle** setup karna zaroori hai. Agar aapne `express.json()` upar rakha toh API requests hang ho jayengi!

```javascript
// server/src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();

// Enable CORS client requests handle karne ke liye
app.use(cors({
  origin: "http://localhost:3000", // Frontend Client URL
  credentials: true,               // Cookies pass karne ke liye enabled
}));

// ⭐ RIGHT ORDER: Pehle Authentication middleware registers hoga
app.use("/api/auth", toNodeHandler(auth));

// Uske baad JSON requests parse karne wala middleware set karein
app.use(express.json());

// API route user details profile check karne ke liye
app.get("/api/me", async (req, res) => {
  // Direct incoming request headers auth server parser ko pass karein
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 3. Frontend Auth Connection
Create `client/lib/auth-client.js`:

```javascript
// client/lib/auth-client.js
// -------------------------------------------------------------
// Better-Auth client library definition for Next.js app
// -------------------------------------------------------------

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // React app ko batayein ki backend auth portal kahan chal raha hai
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001",
});
```

---

## 📲 Chapter 4: Device Flow Authentication (CLI Login)

*Note: Video timelines standard sequence me swapped thi. Yahan logical order correctly implemented hai.*

CLI applications me users browser window redirect setup nahi kar sakte. Isliye hum **Device Flow Code Auth** process build karenge (jaise smart TVs ya GitHub CLI logins me hota hai).

### Sequence Flow of Device Flow:
```mermaid
sequenceDiagram
    participant CLI as Terminal CLI (Orbital)
    participant Backend as Express Server (Better-Auth)
    participant DB as Neon PostgreSQL
    participant Browser as Web Browser (GitHub Auth)
    
    CLI->>Backend: 1. Request Authorization (Create Device Code)
    Backend->>DB: Save Device Request (expires in 15m)
    Backend-->>CLI: Return user_code ("G7W"), device_code & verification_url
    CLI->>Browser: 2. Open browser URL & show user_code to user
    CLI->>Backend: 3. Start polling every 3 seconds for access_token
    Browser->>Backend: 4. User inputs code & approves GitHub redirect
    Backend->>DB: Mark status as 'AUTHORIZED' and link with user session
    Backend-->>CLI: 5. Polling succeeds! Return access_token
    CLI->>CLI: Save token locally in ~/.orbital-config.json
```

### 1. Server Endpoints for Device Auth
Server me hume 2 naye endpoints banane honge:
- `/api/auth/device/code`: Jo device verification details generate karega.
- `/api/auth/device/token`: Jo polling request check karke user token return karega.

```javascript
// server/src/index.js (Add inside server code)

// Memory storage for demo purpose (In production use database table model)
const deviceStore = new Map();

// Endpoint 1: Device code registration initiate karna
app.post("/api/auth/device/code", async (req, res) => {
  // Naye unique codes banayein verification ke liye
  const deviceCode = Math.random().toString(36).substring(2, 15);
  const userCode = Math.random().toString(36).substring(2, 6).toUpperCase(); // e.g. "G7W"

  const details = {
    deviceCode,
    userCode,
    status: "PENDING",
    userId: null,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins validity
  };

  deviceStore.set(deviceCode, details);

  // Client command ko target details return karein
  return res.json({
    deviceCode,
    userCode,
    verificationUrl: "http://localhost:3000/auth/device",
  });
});

// Endpoint 2: Polling validation to check approval status
app.post("/api/auth/device/token", async (req, res) => {
  const { deviceCode } = req.body;
  const details = deviceStore.get(deviceCode);

  if (!details) {
    return res.status(400).json({ error: "Invalid device code, boss!" });
  }

  if (Date.now() > details.expiresAt) {
    return res.status(400).json({ error: "Oops, code expired. Fir se start karo." });
  }

  // Agar user ne web panel se authorization click kar diya hai
  if (details.status === "AUTHORIZED") {
    // Database check karke actual user session details return karein
    return res.json({
      accessToken: `token_${details.userId}_${Math.random().toString(36).substring(2, 10)}`,
      user: details.userId
    });
  }

  // Agar abhi tak approve nahi kiya hai toh check status continuous loop control
  return res.status(202).json({ status: "PENDING" });
});

// Endpoint 3: Web-portal logic code validation logic
app.post("/api/auth/device/approve", async (req, res) => {
  const { userCode, userId } = req.body;
  
  // Store matching device search control
  let targetEntry = null;
  let targetKey = null;
  
  for (const [key, value] of deviceStore.entries()) {
    if (value.userCode === userCode && value.status === "PENDING") {
      targetEntry = value;
      targetKey = key;
      break;
    }
  }

  if (!targetEntry) {
    return res.status(400).json({ error: "Galat code ya already approved hai!" });
  }

  // Status ko AUTHORIZED mark karo aur user configuration connect karo
  targetEntry.status = "AUTHORIZED";
  targetEntry.userId = userId;
  deviceStore.set(targetKey, targetEntry);

  return res.json({ success: true, message: "Device successfully authorized!" });
});
```

### 2. Terminal CLI Node CLI Script logic
Ye CLI program hum `cli/bin.js` folder me compile kar sakte hain.

```javascript
// cli/bin.js
// -------------------------------------------------------------
// Interactive CLI device login client handler
// -------------------------------------------------------------

import fetch from "node-fetch";
import open from "open";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function startLogin() {
  console.log("🔑 Initializing Device Flow Login for Orbital...");
  
  // Backend se device codes mangaayein
  const response = await fetch("http://localhost:3001/api/auth/device/code", { method: "POST" });
  const data = await response.json();

  console.log(`\n👉 Please open your browser: ${data.verificationUrl}`);
  console.log(`📋 Enter verification code: ${data.userCode}`);

  // Browser auto open control
  await open(data.verificationUrl);

  console.log("\n⏳ Waiting for authorization... (Press Ctrl+C to cancel)");
  
  // Polling control mechanism
  while (true) {
    await delay(3000); // Har 3 second baad backend check karo

    const tokenResponse = await fetch("http://localhost:3001/api/auth/device/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceCode: data.deviceCode }),
    });

    if (tokenResponse.status === 200) {
      const tokenData = await tokenResponse.json();
      console.log("\n🎉 Login Success! Token saved locally.");
      console.log(`🔑 Access Token: ${tokenData.accessToken}`);
      break;
    } else if (tokenResponse.status === 400) {
      console.log("\n❌ Request failed/expired. Please restart login process.");
      break;
    }
    // Agar status 202 hai toh console refresh karega bina output break ke
  }
}

startLogin();
```

---

## 🤖 Chapter 5: Google AI Integration (Vercel AI SDK)

Ab backend server ko Gemini AI processing engine se configure karenge:

### 1. Backend Server Setup (`server/.env` update)
```env
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

### 2. Vercel AI SDK Core API Code
Backend module initialize karein:
```javascript
// server/src/lib/gemini.js
// -------------------------------------------------------------
// AI Engine Initialization using Vercel AI SDK & Google Gemini provider
// -------------------------------------------------------------

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import dotenv from "dotenv";

dotenv.config();

// Google provider setup config parameters
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Default AI Model selection
export const defaultModel = google("gemini-1.5-flash");
```

---

## 💬 Chapter 6: Chat Feature (Conversation State Management)

Hum backend Database model me conversation records generate karenge. Jab user terminal me chat karega, purane messages read karke AI ko historical context pass kiya jayega.

### 1. Extend Prisma Schema
Create DB models for conversations inside `server/prisma/schema.prisma`:
```prisma
// Conversation Model
model Conversation {
  id        String    @id @default(cuid())
  userId    String
  title     String?
  createdAt DateTime  @default(now())
  messages  Message[]
}

// Message Model
model Message {
  id             String       @id @default(cuid())
  conversationId String
  role           String       // "user" ya "assistant"
  content        String
  createdAt      DateTime     @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}
```

Database dynamic changes update karne ke liye:
```bash
npx prisma db push
```

### 2. Backend Server Chat API
Create endpoint for processing message logs:
```javascript
// server/src/index.js
import { generateText } from "ai";
import { defaultModel } from "./lib/gemini.js";
import prisma from "./lib/db.js";

app.post("/api/chat", async (req, res) => {
  const { message, conversationId, userId } = req.body;

  // 1. Ek ongoing conversation select ya create karein
  let conversation = null;
  if (conversationId) {
    conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true },
    });
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        title: message.substring(0, 30), // First 30 characters as title
      },
      include: { messages: true },
    });
  }

  // 2. Database me user message save karo
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message,
    },
  });

  // 3. Purane message records database se load karke history array taiyyar karo
  const previousMessages = conversation.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // 4. Gemini SDK call execute karein message logs context ke sath
  const aiResponse = await generateText({
    model: defaultModel,
    system: "You are Orbital AI - a helpful developer CLI companion.",
    messages: [
      ...previousMessages,
      { role: "user", content: message },
    ],
  });

  // 5. Assistant response database history logs me save karo
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: aiResponse.text,
    },
  });

  return res.json({
    reply: aiResponse.text,
    conversationId: conversation.id,
  });
});
```

---

## 🛠️ Chapter 7: Tool Calling Implementation (Reactions to System commands)

Vercel AI SDK dynamic operations execute karne ke liye special tools functionality support karta hai:

```javascript
// server/src/index.js (Tool handler routing)
import { tool } from "ai";
import { z } from "zod";

const googleSearchTool = tool({
  description: "Search anything on the internet live for user inputs.",
  parameters: z.object({
    query: z.string().describe("Search query to submit to internet search indexes."),
  }),
  execute: async ({ query }) => {
    // Live execution setup mockup
    console.log(`🔍 Tool trigger: Internet Search query -> ${query}`);
    return `Results for: ${query} (Status: Simulated search response, current date is June 2026)`;
  },
});

const codeExecutionTool = tool({
  description: "Executes JavaScript code snippets locally on machine.",
  parameters: z.object({
    code: z.string().describe("Executable JavaScript block code."),
  }),
  execute: async ({ code }) => {
    try {
      console.log(`💻 Executing code locally:\n${code}`);
      const output = eval(code); // Alert: Dev purpose simulator code only
      return `Code Execution Output: ${output}`;
    } catch (e) {
      return `Error in script execution: ${e.message}`;
    }
  },
});

app.post("/api/tools-chat", async (req, res) => {
  const { message } = req.body;

  const result = await generateText({
    model: defaultModel,
    tools: {
      search: googleSearchTool,
      execute: codeExecutionTool,
    },
    prompt: message,
  });

  return res.json({
    text: result.text,
    toolCalls: result.toolCalls,
  });
});
```

---

## 🤖 Chapter 8: Agentic AI Mode (Auto File-Folder Builder)

Is feature ke through AI agent humare files and directory structures auto-create karega. Iske liye hum output structure validation ke liye **Zod Schema** aur `generateObject` ka use karenge.

### 1. API implementation using `generateObject`
```javascript
// server/src/index.js
import { generateObject } from "ai";
import { defaultModel } from "./lib/gemini.js";
import { z } from "zod";

app.post("/api/agentic-mode", async (req, res) => {
  const { prompt } = req.body;

  // AI response validation structure check using Zod
  const responseSchema = z.object({
    projectTitle: z.string().describe("Name of the project application"),
    description: z.string().describe("Detailed description of generated source code"),
    files: z.array(
      z.object({
        path: z.string().describe("Absolute file name path e.g. index.html or css/style.css"),
        content: z.string().describe("Full production-ready source code content for files"),
      })
    ),
  });

  const response = await generateObject({
    model: defaultModel,
    schema: responseSchema,
    system: "You are a senior full stack developer. Write premium UI templates containing production code.",
    prompt: prompt,
  });

  return res.json(response.object);
});
```

### 2. Client-side File Writing execution
Client-side loop JSON details read karke local disk par physical output files write karega:

```javascript
// cli/agentic-client.js
// -------------------------------------------------------------
// Write generated files to the target workspace disk paths
// -------------------------------------------------------------

import fs from "fs-extra";
import path from "path";
import fetch from "node-fetch";

async function runAgent(promptText) {
  console.log(`🤖 Agent thinking to generate: "${promptText}"...`);

  const res = await fetch("http://localhost:3001/api/agentic-mode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: promptText }),
  });

  const appData = await res.json();
  console.log(`\n🎉 Project Plan Loaded: ${appData.projectTitle}`);
  console.log(`💡 Description: ${appData.description}`);

  // Har ek generated file ko physical disk memory layout me save karo
  for (const file of appData.files) {
    const localPath = path.join(process.cwd(), file.path);
    
    // Ensure nested folder structure exists
    await fs.ensureDir(path.dirname(localPath));
    
    // Physical file create aur write karo
    await fs.writeFile(localPath, file.content, "utf8");
    console.log(`💾 File created: ${file.path}`);
  }

  console.log("\n🚀 All files written successfully to workspace!");
}

runAgent("Create me a premium interactive Todo application using HTML, CSS, JS");
```

---

## 🧪 Verification & Execution Steps

Aap apne application ko test karne ke liye ye steps follow kar sakte hain:

### 1. Database syncing:
```bash
cd server
npx prisma db push
```

### 2. Backend server start karein:
```bash
# In Server directory
npm run dev
```

### 3. Frontend Next.js Client start karein:
```bash
cd ../client
npm run dev
```

### 4. CLI Execution
CLI tool ko global level link or setup logic me run karke terminal client test karein:
```bash
# In target cli folder path runs node execution directly
node bin.js
```

---

### 💡 Quick Summary Checklist (Hinglish Tips)

- **Express Middleware order bhulna mat!** Pehle `app.use("/api/auth", toNodeHandler(auth))` aayega, uske baad hi `app.use(express.json())` code aana chahiye.
- **Neon DB link schema push:** `npx prisma db push` har database update ke baad run karna mat bhulna.
- **GitHub Redirect configuration:** GitHub developer panel me OAuth Redirect URL update karke `http://localhost:3001/api/auth/callback/github` set hona chahiye.

Is complete setup guide ke help se aapka code solid aur fully functional chalega. Happy coding! 🚀
