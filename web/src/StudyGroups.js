import React from 'react';
import './App.css';
 // Importa el mismo archivo CSS

const StudyGroups = () => {
  return (
    <div className="study-groups">
      <h1>Grupos de estudio</h1>
      <p>Bienvenido a la sección de grupos de estudio. Aquí puedes unirte a diferentes grupos y colaborar con otros estudiantes.</p>
      <div className="group-list">
        <div className="group-item">Grupo de Ciberseguridad</div>
        <div className="group-item">Grupo de Software</div>
        <div className="group-item">Grupo de Contaduría</div>
        <div className="group-item">Grupo de Agricultura</div>
        <div className="group-item">Grupo Industrial</div>
      </div>
    </div>
  );
}

export default StudyGroups;
