import OpenAI from "openai";

const openaiClient = new OpenAI({
  apiKey: process.env['OPENAI_KEY'],
});

export default openaiClient;
