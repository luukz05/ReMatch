// src/components/PH2.js
import React from 'react';

const PH2 = () => {
  return (
    <div style={styles.container}>
      <h1>Página de Placeholder 2 (PH2)</h1>
      <p>Esta é a segunda página de placeholder. Aqui você pode adicionar mais informações fictícias.</p>
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
    backgroundColor: '#e0e0e0',
    textAlign: 'center',
  },
};

export default PH2;
