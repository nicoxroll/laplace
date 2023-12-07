import {  OpenAI } from "openai";

const openai = new OpenAI();

export default async function (req, res) {
 

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
		const assistant = await client.beta.assistants.create({
			instructions: assistant_prompt_instruction,
			model: "gpt-3-1106-preview",
			tools: [{
					type: "function",
					function: {
							name: "tavily_search",
							description: "Obtener información sobre eventos recientes en la web.",
							parameters: {
									type: "object",
									properties: {
											query: { type: "string", description: "'Últimas noticias sobre vulnerabilidades relacionadas'" },
									},
									required: ["query"]
							}
					}
			}]
	});
	
	const thread = await openai.beta.threads.create();
    
	const message = await openai.beta.threads.messages.create(thread.id, {
		role: "user",
		content: "Del siguiente codigo en especifico decime que vulnerabilidades se podria explotar, clasificalas en severidad Low, Medium, High y ademas con su CVE o CWE correspondiente: "+req.body.issue
	});

	console.log(message)
	
	const run = await openai.beta.threads.runs.create(thread.id, {
	assistant_id: assistant.id,
	})
	
		 let runStatus;
		 do {
			 await sleep(1000);
			 runStatus=await getStatus(threadId,runResponse.id)
			 
		 } while (!['completed', 'failed', 'requires_action'].includes(runStatus.status));
	
		
		 if(runStatus.status ==='failed'){
				 console.error(runStatus.error);
				 return res.status(500).json({ error:'Error en la ejecucion'});
		 
		 }
		
		
		if (runStatus.status==='requires_action') {
	
					const toolOutputArray=[];
					
					for(const tool of run.required_action.submit_tool_outputs.tool_calls){
							
							let output=null;
							const toolCallId=tool.id;
							const functionName=tool.function.name;
							const functionArgs=tool.function.arguments;
	
							 if (functionName === 'tavily_search') {
									output = await tavilySearch(JSON.parse(functionArgs).query);
							 }
	
								if(output){
									 toolOutputArray.push({ tool_call_id: toolCallId, output });
								}
					}
	
				 runStatus=await client.beta.threads.runs.submitToolOutputs({
						 thread_id:'thread.id',
						 run_id:runResponse.id,
						 tool_outputs:[
								 ...toolOutputArray
						 ]
				 });
				 
				do {
					 await sleep(1000);
					 runStatus=await getStatus(threadId,runResponse.id)
					 
					} while (!['completed', 'failed'].includes(runStatus.status));
	
		 
		 }
		
		// Obtener mensajes del hilo
		 const messages = await getMessages(thread.id);
		

 

		 const response = await openai.beta.threads.messages.retrieve(
			thread.id,
			messages.body.first_id
		);
		console.log(response)
		const aux = await response.content[0].text.value
		console.log(aux)
		// Mostrar la respuesta en un alert
		res.json({ result: aux });
		
		
		 // Función para esperar un cierto tiempo en milisegundos
		 function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		
		// Función para realizar una búsqueda con Tavily
		async function tavilySearch(query) {
			const searchResult = await tavily_client.get_search_context(query, { search_depth:"advanced", max_tokens:8000});
			return searchResult;
		}
		
		// Función para obtener el estado de ejecución de un hilo y ejecución específicos
		
		async function getStatus(threadId,runId){
				
				 const run = await client.beta.threads.runs.retrieve({ thread_id:threadId , run_id:runId});
				 console.log(`Estado actual de la ejecucion:${run.status}`);
				 return run;
		
		}
		
		// Función para obtener los mensajes de un hilo específico
		
		async function getMessages(threadId){
		
		const messages=await client.beta.threads.messages.list({
						thread_id: thread.id,
						
		})
		return messages;
		
		}
		







			} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error interno del servidor' });
		}
	};
	


	

