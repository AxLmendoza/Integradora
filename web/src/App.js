import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Importa Routes en lugar de Switch
import './App.css'; // Asegúrate de tener estilos minimalistas en tu archivo CSS
import StudyGroups from './StudyGroups'; // Asegúrate de que las mayúsculas y minúsculas coincidan

const App = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">Chipmunks Network</div>
        <nav className="nav">
          <Link to="/grupos">Grupos de estudio</Link>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={
            <>
              <div className="main-content">
                <h1>¡REALIZA UNA PREGUNTA!</h1>
                <input type="text" placeholder="Busca o pregunta lo que quieras..." className="search-bar"/>
                <button className="button">Enviar</button>
              </div>
              <div className="illustration">
                {/* Aquí podrías incluir tu ícono o imagen minimalista */}
              </div>
              <section className="search-results">
                <h2>Resultados de Búsqueda</h2>
                {/* Aquí puedes mapear y mostrar resultados de búsqueda */}
              </section>
              <aside className="trending-questions">
                <h2>Preguntas Tendencias</h2>
                <ul>
                  <li>Pregunta 1</li>
                  <li>Pregunta 2</li>
                  <li>Pregunta 3</li>
                  {/* Añade más preguntas aquí */}
                </ul>
              </aside>
              <aside className="user-interaction">
                <h2>Interacción del Usuario</h2>
                <ul>
                  <li>Usuario A respondió a tu pregunta</li>
                  <li>Usuario B comentó tu respuesta</li>
                  <li>Usuario C te siguió</li>
                  {/* Añade más interacciones aquí */}
                </ul>
              </aside>
            </>
          } />
          <Route path="/grupos" element={<StudyGroups />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <Link to="/about">Sobre Nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/privacy">Política de Privacidad</Link>
          <Link to="/terms">Términos del Servicio</Link>
        </div>
      </footer>
    </div>
  );
}

export default App;
