import { OpenAI } from "openai";
import { TavilySearchAPIRetriever } from "langchain/retrievers/tavily_search_api";


const openai = new OpenAI();
const retriever = new TavilySearchAPIRetriever({
	k: 3,
  });

global.tavily_search=tavily_search;

export default async function (req, res) {
	try {
		const assistant_prompt_instruction = "You are a engineer cibersecurity expert. Your goal is to provide answers based on information from the internet. You must use the provided Tavily search API function to find relevant online information. You should never use your own knowledge to answer questions. Please include relevant url sources at the end of your answers.";

		const assistant = await openai.beta.assistants.create({
			instructions: assistant_prompt_instruction,
			model: "gpt-3.5-turbo",
			tools: [{
				type: "function",
				function: {
					name: "tavily_search",
					description: "Get information on recent events from the web related with the code.",
					parameters: {
						type: "object",
						properties: {
							query: { type: "string", description: "'Latest news on vulnerabilities'" },
						},
						required: ["query"]
					}
				}
			}]
		});
		console.log("creando Thread")
		const thread = await openai.beta.threads.create();
		console.log(thread.id)

		
		console.log("creando Mensaje")
		const message = await openai.beta.threads.messages.create(thread.id, {
			role: "user",
			content: "Del siguiente texto busca en internet articulos relacionados " + req.body.issue
		});

		console.log(message);

		console.log("creando Run")
		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: assistant.id,
		});

		console.log(run)

		let runStatus;
		do {
			await sleep(1000);
			runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		} while (!['completed', 'failed', 'requires_action'].includes(runStatus.status));

		if (runStatus.status === 'failed') {
			console.error(runStatus.error);
			return res.status(500).json({ error: 'Error en la ejecución' });
		}

		if (runStatus.status === "requires_action") {
			const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
			const toolOutputs = [];
		  
			for (const toolCall of toolCalls) {
			  const functionName = toolCall.function.name;
		  
			  console.log(`This question requires us to call a function: ${functionName}`);
		  
			  const args = JSON.parse(toolCall.function.arguments);
		  
			  const argsArray = Object.keys(args).map((key) => args[key]);
		  
			  // Dynamically call the function with arguments
			  const output = await global[functionName].apply(null, argsArray);
		  
			  toolOutputs.push({
				tool_call_id: toolCall.id,
				output: output,
			  });
			}
		  
			// Submit tool outputs
			await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
			  tool_outputs: toolOutputs,
			});
		  

			do {
				await sleep(1000);
				runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
			} while (!['completed', 'failed'].includes(runStatus.status));
		}

		// Obtener mensajes del hilo
		const messages =  await openai.beta.threads.messages.list( thread.id );
		console.log(messages);

		const response = await openai.beta.threads.messages.retrieve(
			thread.id,
			messages.body.first_id
		);

		console.log(response);
		const aux = await response.content[0].text.value;
		console.log(aux);
		// Mostrar la respuesta en un alert
		res.json({ result: aux });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
}

// Función para esperar un cierto tiempo en milisegundos
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para realizar una búsqueda con Tavily
async function tavily_search(query) {
	const retriever = new TavilySearchAPIRetriever({
	  k: 3,
	});
  
	const searchResult = await retriever.getRelevantDocuments(query);
	console.log({ searchResult });
  
	return JSON.stringify(searchResult);
  }

// Función para obtener el estado de ejecución de un hilo y ejecución específicos
async function getStatus(threadId, runId) {
	const run = await openai.beta.threads.runs.retrieve({ threadId, runId });
	console.log(`Estado actual de la ejecución: ${run.status}`);
	return run;
}

// Función para obtener los mensajes de un hilo específico
async function getMessages(threadId) {
	console.log("Listado de Mensajes: ")
	const messages = await openai.beta.threads.messages.list({ threadId });
	return messages;
}