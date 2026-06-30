import {google} from "@ai-sdk/google"
import { config } from "../../config/google.config.js"
import {streamText} from "ai"
import chalk from "chalk"





export class AIService{
constructor(){
  if(!config.googleApiKey){
    throw new Error("GOOGLE API KEY is missing") 
  }
  this.model=google(config.model,{
    apiKey:config.googleApiKey,
  })
}
//sends a message and get streaming responder

/**
 * 
 * @param {Array} messages 
 * @param {function} onChunk
 * @param {Object} tools
 * @param {Function} onToolCall
 * @returns {Promise<Object>}
 */


async sendMessage(messages,onChunk,tools=undefined,onToolCall=null){

  try{
    const streamconfig={
      model:this.model,
      messages:messages,
    }
    const result=streamText(streamconfig);
    let fullResponse=""

    for await(const chunk of result.textStream){
      fullResponse+=chunk;
      if(onChunk){
        onChunk(chunk);
      }
    }

    const fullResult=result;
    return{
      content:fullResponse,
      finishResponse:fullResult.finishReason,
      usage:fullResult.usage
    }

  } catch(error){
    console.error(chalk.red("AI Service Error:"),error.message);
    throw error

  }
}
/**
 * @param {Array} messages
 * @param {Object} tools
 * @returns {Promise<string>}
 */
async getMessage(messages,tools=undefined){
  let fullResponse="";
  await this.sendMessage(messages,(chunk)=>{
    fullResponse+=chunk;
  })
  return fullResponse;
}


}