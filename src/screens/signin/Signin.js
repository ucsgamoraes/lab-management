import React, { useState } from 'react';
import './Signin.css';

export default function Signin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch('https://laboratorio-5vcf.onrender.com/user/login',
        {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((r) => {
        return r.text()
      }
      ).then((r) => {
        localStorage.setItem("token", r);
        window.location = "/home";
      });
    } catch (error) {
      alert(1);
    }
  };

  return (
    <div className="signin-container">

      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Entrar</h2>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}