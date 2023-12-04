// pages/api/chat.js

import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

export const runtime = 'edge';

export default async function (req) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.body;



    console.log(messages)
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k-0613',
      stream: true,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } 