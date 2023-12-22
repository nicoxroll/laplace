import {  OpenAI } from "openai";

const openai = new OpenAI();


export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export default async function (req, res) {
 

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
    //invoco a mi agente
    const assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_API);
    //creo el hilo
    const thread = await openai.beta.threads.create();
    //creo mi mensaje como usuario que solicita que analice el texto que le proporcionare
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "No hagas preguntas, tampoco digas que no tenes acceso al archivo y Resume el siguiente contenido del texto y determina que BadSmell de UX/UI que hace referencia a alguno de tu base de conocimiento, dame una lista de los que hacen referencia. Si no estan dime a que otro se podria referir para agregar: "+req.body.issue
    });

    console.log(message)
    //creo un run, invoco al thread y al asistente
    const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    })


    console.log(run.status);
    await openai.beta.threads.runs.retrieve(thread.id, run.id);

    let ok = true;

    while (ok) {
      
      const retry = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log(retry.status);
      
      if (retry.status !== "in_progress") {
        ok = false; // Cambiar el valor de ok si el estado no es "in_progress"
      }
      await sleep(3000); // Esperar 3 segundos
}
    console.log("mensajes:")
    const messages = await openai.beta.threads.messages.list(
      thread.id
    )

messages.body.data.forEach((message) => {
  console.log(message.content);

});
console.log(messages)


const response = await openai.beta.threads.messages.retrieve(
  thread.id,
  messages.body.first_id
);
console.log(response)
const aux = await response.content[0].text.value
console.log(aux)
// Mostrar la respuesta en un alert
res.json({ result: aux });
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


