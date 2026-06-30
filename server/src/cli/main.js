#!/usr/bin/env node

import dotenv from "dotenv";

import chalk from "chalk";
import figlet from "figlet";

import { Command } from "commander";
import { login, logout, whoami } from "./commands/auth/login.js";
import { wakeup } from "./commands/ai/wakeup.js";


dotenv.config();

async function main() {
  // banner ke liye
  console.log(
    chalk.cyan(
      figlet.textSync("Orbit Agent", {
        font: "Standard",
        horizontalLayout: "default",
      })
    )
  );
  console.log(chalk.green("A Cli based AI Agent \n"));

   const program = new Command("orbit");

  program
    .version("0.0.1")
    .description("Orbit CLI - Device Flow Authentication")
    .addCommand(login)
    .addCommand(logout)
    .addCommand(whoami)
    .addCommand(wakeup)

    
  // Default action shows help
  program.action(() => {
    program.help();
  });



  program.parse();
 
}

main().catch((error) => {
  console.error(chalk.red("Error running Orbit CLI:"), error);
  process.exit(1);
});