import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';


export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const issue = req.body.issue || '';
  if (issue.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Issue",
      }
    });
    return;
  }

  try {
    // Create a file
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const client = new OpenAIApi(configuration);
    
    console.log(client)
    async function carga() {
      const file = await client.files.create({
        file: fs.createReadStream("catalog.pdf"),
        purpose: "fine-tune",
      });
    
      console.log(file);
    }
    carga();
    // Create an assistant
    const assistantOpts = {
      name: 'LaPlace',
      instructions: 'You are an engineer who detects UX/UI BadSmells in the provided Issue. Use your knowledge base to respond to related queries in the best way possible. Please be precise and give me the results of the detected BadSmells separated by comma.',
      model: 'gpt-3.5-turbo-1106',
      tools: [{ type: 'retrieval' }],
      file_ids: [file.id]
    };
    const assistant = await client.assistants.create(assistantOpts);

    // Create a thread
    const thread = await client.threads.create();

    // Add a message to the thread (user)
    const messageOpts = {
      thread_id: thread.id,
      role: 'user',
      content: req.body.issue,
      file_ids: [file.id]
    };
    const message = await client.threads.messages.create(messageOpts);

    // Execute the assistant (thread)
    const runOpts = {
      thread_id: thread.id,
      assistant_id: assistant.id,
      instructions: 'From the text I provided, tell me which BadSmells appear in your knowledge base. Be precise and give me the results separated by comma.'
    };
    const run = await client.threads.runs.create(runOpts);

    // If the execution is 'completed', retrieve the messages and display them
    const interval = setInterval(async () => {
      const runStatus = await client.threads.runs.retrieve(thread.id, run.id);
      if (runStatus.status === 'completed') {
        const messages = await client.threads.messages.list(thread.id);
        console.log('Thread Messages:');
        console.log(messages);
        clearInterval(interval);
      }
    }, 10000);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: {
        message: 'An error occurred',
      }
    });
  }
}