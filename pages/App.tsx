import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInSide from './SignInSide';
import GitHubIssue from './GitHubIssue';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = () => {
    // Lógica para iniciar sesión

    // Si el inicio de sesión es exitoso, establece isLoggedIn en true
    setIsLoggedIn(true);
  };

  return (
    <div>
  
        <Router>


          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <Navigate to="/issues" /> : <SignInSide onSignIn={handleSignIn} />}
            />
            <Route path="/issues" element={<GitHubIssue />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;