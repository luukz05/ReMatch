// src/components/PH1.js
import React from 'react';
import { useNavigate } from "react-router-dom";



const PH1 = () => {
  let navigate = useNavigate();
function teste(){
    navigate("/dashboard");
    window.location.reload();
}

    
  return (
    <div style={styles.container}>
      <h1>Página de Placeholder 1 (PH1)</h1>
      <p>Esta é a primeira página de placeholder. Aqui você pode adicionar informações fictícias.</p>
      <button onClick={teste()}>dasdasdads</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
};

export default PH1;
