import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { useCookies } from "react-cookie";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Receber = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null); // Define the current user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagem de erro
  const [cookies] = useCookies(["userId"]);
  let navigate = useNavigate();

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
        const currentUser = await userResponse.json();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Falha ao buscar usuários.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [cookies.userId]);

  const swiped = (direction, likedUserId) => {
    if (direction === "right") {
      addMatch(likedUserId); // chama addMatch diretamente se for um swipe para direita
    }
  };

  const addMatch = async (likedUserId) => {
    try {
      const response = await fetch("http://localhost:5000/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: cookies.userId, likedUserId }),
      });

      const result = await response.json();

      if (result.match) {
        alert("É um match!");
        console.log("match!");
      }
    } catch (error) {
      console.error("Erro ao processar swipe:", error);
    }
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

  const backHome = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/users/${cookies.userId}`,
        {
          method: "GET",
          credentials: "include", // Inclui cookies na requisição
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const userData = await response.json();

      if (!userData) {
        setError("Usuário não encontrado."); // Mensagem de erro caso o usuário não seja encontrado
      } else {
        setUser(userData); // Define o usuário encontrado
        navigate(`/users/${cookies.userId}`);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setError("Erro ao carregar o usuário. Tente novamente mais tarde."); // Mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container-profile">
        <div className="nav-menu">
          <img
            src={Logo}
            onClick={backHome}
            alt="Logo"
            style={{ cursor: "pointer" }}
          />
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
            .filter((user) => user.action === "Receber")
            .map((user) => (
              <TinderCard
                className="swipe"
                key={user._id}
                onSwipe={(dir) => swiped(dir, user._id)}
                preventSwipe={["up", "down"]}
                onCardLeftScreen={() => outOfFrame(user.nome)}
              >
                <div className="card" style={{ zIndex: 3 }}>
                  <img
                    src={
                      user.profileImageUrl ||
                      "https://thispersondoesnotexist.com/"
                    }
                    alt="Perfil"
                    onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://thispersondoesnotexist.com/")
                    }
                    style={{
                      borderRadius: 10,
                      opacity: 0,
                      transition: "opacity 0.5s ease",
                      zIndex: 5,
                      height: 450,
                      width: 450,
                    }}
                    draggable="false"
                  />
                  <h3>{user.nome}</h3>
                  {/* <p>{user._id}</p> */}
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
          <div className="ohno-container">
            <p>Oh não! Parece que os perfis acabaram...</p>
            <button
              className="btn-opcao-profile"
              onClick={backHome}
              style={{ backgroundImage: "url(../assets/home.svg)" }}
            >
              Voltar para a Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receber;
