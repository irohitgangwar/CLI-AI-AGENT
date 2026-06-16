#!/usr/bin/env node

import dotenv from "dotenv";

import chalk from "chalk";
import figlet from "figlet";

import { Command } from "commander";


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
    .description("Orbit CLI - Device Flow Authentication");


    
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