import { useState } from "react";
const Dashboard = () =>{
    // Lista de perfis com nome, item para doar, interesse e foto
  const profiles = [
    {
      id: 1,
      name: 'Ana Silva',
      item: 'Bicicleta',
      interest: 'Livros',
      photo: 'https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQzNzQ3NC5qcGVn',
    },
    {
      id: 2,
      name: 'Carlos Santos',
      item: 'Roupas',
      interest: 'Plantas',
      photo: 'https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMzQzOTEuanBlZw==',
    },
    {
      id: 3,
      name: 'Mariana Lima',
      item: 'Mesa de escritório',
      interest: 'Eletrônicos',
      photo: 'https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQxOTc0OS5qcGVn',
    },
    {
      id: 4,
      name: 'João Pereira',
      item: 'Cadeira gamer',
      interest: 'Videogames',
      photo: 'https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkNTQwMzkuanBlZw==',
    },
  ];

  // Estado para armazenar o índice do perfil atual
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  // Função para alternar para o próximo perfil
  const handleNextProfile = () => {
    // Se o índice atual for o último, volte ao início, caso contrário, vá para o próximo
    setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };

  // Perfil atual exibido com base no índice
  const currentProfile = profiles[currentProfileIndex];


    return(
        <div className="home-container">
        {/* Header */}
        <header className="header">
          <h1>ReMatch</h1>
        </header>
  
        {/* Container do perfil e match */}
        <div className="card-container">
    <div className="profile-content">
      {/* Foto do perfil */}
      <img 
        src={currentProfile.photo} 
        alt="Foto de Perfil" 
        className="profile-picture"
      />
      
      {/* Descrição do perfil */}
      <div className="profile-description">
        <h2>{currentProfile.name}</h2>
        <p>{currentProfile.item}</p>
      </div>
    </div>
    
    {/* Botões de match e pass */}
    <div className="button-container">
      <button className="match-button" onClick={handleNextProfile}>
        👍
      </button>
      <button className="pass-button" onClick={handleNextProfile}>
        👎
      </button>
      </div>
      </div>
      </div>
  
    )

}

export default Dashboard