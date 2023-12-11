const userInput = document.getElementById("input").value;
const command = `ls ${userInput}`;
const result = executeCommand(command);
document.getElementById("output").innerText = result;

function executeCommand(cmd) {
  const exec = require("child_process").exec;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return;
    }
    console.log(`Resultado del comando: ${stdout}`);
    return stdout;
  });
}