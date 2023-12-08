const express = require('express');
const app = express();
const os = require('os');
const { OpenAI } = require('openai-api');
const { TavilyClient } = require('tavily');

// Inicializar clientes con claves de API
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const tavily_client = new TavilyClient({ apiKey: process.env.TAVILY_API_KEY });

app.use(express.json());

// Ruta POST para manejar las solicitudes del usuario
app.post('/assistant', async (req, res) => {
    try {
        // Crear un asistente

        const assistant2 = await openai.beta.assistants.create({
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
        console.log(assistant2)
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
                    query: { type: "string", description: "La consulta de búsqueda a utilizar. Por ejemplo: 'Últimas noticias sobre el rendimiento de las acciones de Nvidia'" },
                },
                required: ["query"]
            }
        }
    }]
});

const assistant_id = assistant.id;
console.log(`Assistant ID: ${assistant_id}`);
        const thread = await openai.beta.threads.create();
        
        const message = await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: "Del siguiente codigo en especifico decime que vulnerabilidades se podria explotar, clasificalas en severidad Low, Medium, High y ademas con su CVE o CWE correspondiente: "+req.body.issue
        });
    
        console.log(message)
        
        const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        })
    
        console.log(run.status);
    
   

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
   const messages = await getMessages('YOUR_THREAD_ID');
  
   res.status(200).json(messages);

    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

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
        thread_id:threadID,
        
})
return messages;

}


app.listen(3000, () => {
console.log('Servidor iniciado en el puerto 3000');
});