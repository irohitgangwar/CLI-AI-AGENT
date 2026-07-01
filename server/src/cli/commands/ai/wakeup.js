import chalk from "chalk";
import { Command } from "commander";
import { getStoredToken } from "../auth/login.js";
import prisma from "../../../lib/db.js";
import { select } from "@clack/prompts";
import yoctoSpinner from "yocto-spinner";
import { startChat } from "../../chat/chat-with-ai.js";
import { startToolChat } from "../../chat/chat-with-ai-tool.js";
import { startToolChat } from "../../chat/chat-with-ai-tool.js";

const wakeUpAction = async()=>{
  const token=await getStoredToken();
  if(!token?.access_token){
    console.log(chalk.red("not authenticated please login"));
    return;
  }

  const spinner=yoctoSpinner({text:"Fetching user Information....."}).start();
  const user=await prisma.user.findFirst({
    where:{
      sessions:{
        some:{
          token:token.access_token
        }
      }
    },
    select:{
      id:true,
      name:true,
      email:true,
      image:true,
    }
  })
  spinner.stop();

  if(!user){
    console.log("User not found");
    return;
  }

  console.log(chalk.green(`Welcome Back, ${user.name}!\n`));

const choice=await select({
  message:"Select an option",
  options:[
    {
      value:"chat",
      label:"Chat",
      hint:"Engage in a conversation"
    },
    {
      value:"tool",
      label:"Tool Calling",
      hint:"Chat with tools"
    },
    {
      value:"agent",
      label:"Agentic Mode",
      hint:"Advanced AI Agent"
    },
  ],
})

switch(choice){
  case "chat":
    startChat("chat");
    break;
  case "tool":
    await startToolChat()
    break;
  case "agent":
    await startAgentChat()
    break;
}


}
export const wakeup=new Command("wakeup")
.description("Wake up the AI agent")
.action(wakeUpAction);