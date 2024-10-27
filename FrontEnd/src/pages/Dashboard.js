import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card"; // Supondo que você está usando a biblioteca react-tinder-card

const UsersDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5000/users"); // Altere a porta se necessário
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const swiped = (direction, userId) => {
    console.log(`Você deslizou para ${direction}: ${userId}`);
    // Aqui você pode adicionar lógica para tratar o swipe, como adicionar o usuário a uma lista de matches
  };

  const outOfFrame = (name) => {
    console.log(`${name} saiu da tela!`);
    // Aqui você pode adicionar lógica para remover o usuário da visualização ou atualizar o estado
  };

  return (
    <div className="dashboard">
      <div className="swipe-container">
        <div className="card-container">
          {users.map((user) => (
            <TinderCard
              className="swipe"
              key={user._id} // Usando diretamente o _id do MongoDB como chave
              onSwipe={(dir) => swiped(dir, user._id)}
              onCardLeftScreen={() => outOfFrame(user.nome)} // Usando o nome do usuário
            >
              <div
                style={{
                  backgroundImage: `url(https://placehold.co/600x400)`, // URL da imagem, ajuste conforme necessário
                  backgroundSize: "cover",
                  height: "300px", // Ajuste conforme necessário
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "10px",
                  color: "black",
                }}
                className="card"
              >
                <h3>{user.nome}</h3>{" "}
                {/* Corrigido para usar 'nome' em vez de 'name' */}
                <p>{user.descricao}</p>{" "}
                {/* Corrigido para usar 'descricao' em vez de 'description' */}
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;
