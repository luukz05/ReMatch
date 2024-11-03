import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { useCookies } from "react-cookie";
import Logo from "../public/logo.png";

const Dar = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null); // Define the current user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["userId"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const filteredUsers = data.filter(
          (user) => user._id !== cookies.userId,
        );
        setUsers(filteredUsers);

        // Fetch the current user’s data
        const userResponse = await fetch(
          `http://localhost:5000/users/${cookies.userId}`,
        );
        if (!userResponse.ok) throw new Error("Could not fetch user data");

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Erro ao carregar usuários. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [cookies.userId]);

  const swiped = (direction, userId) => {
    console.log(`Você deslizou para ${direction}: ${userId}`);
    // Implement backend status update here if needed
  };

  const outOfFrame = (name) => {
    console.log(`${name} saiu da tela!`);
  };

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard">
      <div
        className="container-profile"
        style={{
          backgroundImage:
            "https://cdn.discordapp.com/attachments/968229431988604940/1302372600965763153/image.psd.png?ex=6727e080&is=67268f00&hm=1f5c1f0f2364e5bbb470736f98daab687154f34ba46bd2ada2af47d8566fa059&",
        }}
      >
        <div className="nav-menu">
          <img src={Logo} alt="Logo" />
          <div className="perfil">
            <div className="div-name">
              <div className="name-container">
                <h1>{user.nome}</h1>
              </div>
              <div className="info-menu">
                <p>
                  {user.action}: {user.interesse}
                </p>
              </div>
            </div>
            <img
              src={user.imagem || "https://placehold.co/45"} // Use a imagem do usuário, ou uma padrão
              className="img-perfil"
              alt="Perfil"
            />
          </div>
        </div>
      </div>
      <div className="swipe-container">
        <div className="card-container">
          {users
            .filter((user) => user.action === "Dar")
            .map((user) => (
              <TinderCard
                className="swipe"
                key={user._id}
                onSwipe={(dir) => swiped(dir, user._id)}
                onCardLeftScreen={() => outOfFrame(user.nome)}
              >
                <div className="card">
                  <img
                    src={user.profileImageUrl || "https://placehold.co/600x400"}
                    alt="Perfil"
                    onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                    onError={(e) =>
                      (e.currentTarget.src = "https://placehold.co/600x400")
                    }
                    style={{
                      borderRadius: 10,
                      opacity: 0,
                      transition: "opacity 0.5s ease",
                    }}
                  />
                  <h3>{user.nome}</h3>
                  <h3>
                    Quer {user.action}: {user.interesse}
                  </h3>
                  <p style={{ textWrap: "wrap", wordBreak: "break-all" }}>
                    {user.descricao}
                  </p>
                  <h3>
                    Localização: {user.cidade}, {user.estado}
                  </h3>
                </div>
              </TinderCard>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dar;
