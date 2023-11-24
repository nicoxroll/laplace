import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
        message: "Please enter a valid Code",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(issue),
      temperature: 0,
      max_tokens:300,
    });
    
    const response = completion.data.choices[0].text;
    // Mostrar la respuesta en un alert
    res.json({ result: response });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(issue) {
  const capitalizedIssue =
    issue[0].toUpperCase() + issue.slice(1).toLowerCase();
  return `Decime que vulnerabilidades encuentras de las CVE o CWE en el mismo:
  
  ${capitalizedIssue}
`;
}