import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../LoginForm.css';

function LoginForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification des informations d'identification
    if (username === "admin" && password === "IAZOURENE") {
      setIsLoggedIn(true);
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />; // Redirige vers /dashboard
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Veuillez vous connecter</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginForm;
