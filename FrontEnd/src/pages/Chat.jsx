import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Usando axios para requisições
import { useCookies } from "react-cookie";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userId, likedUserId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedUser, setLikedUser] = useState(null); // Estado para armazenar informações do usuário "liked"
  const [user, setUser] = useState(null); // Estado para armazenar informações do usuário logado
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagem de erro
  const [cookies] = useCookies(["userId"]);
  let navigate = useNavigate();

  // Função para buscar as mensagens
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/messages/${userId}/${likedUserId}`,
      );
      setMessages(response.data); // Atualiza o estado com as mensagens recebidas
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar as informações do usuário logado
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setUser(response.data); // Atualiza o estado com as informações do usuário logado
    } catch (error) {
      console.error("Erro ao buscar informações do usuário logado:", error);
      setErrorMessage(
        "Erro ao carregar o usuário logado. Tente novamente mais tarde.",
      );
    }
  };

  // Função para buscar as informações do usuário "liked"
  const fetchLikedUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${likedUserId}`,
      );
      setLikedUser(response.data); // Atualiza o estado com as informações do usuário "liked"
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      setErrorMessage(
        "Erro ao carregar o usuário. Tente novamente mais tarde.",
      );
    }
  };

  // Função para lidar com a digitação da mensagem
  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Atualiza o estado da mensagem conforme o usuário digita
  };

  // Função para enviar uma nova mensagem
  const handleSendMessage = async () => {
    if (message.trim() === "") {
      alert("Por favor, digite uma mensagem");
      return;
    }

    console.log(`Enviando mensagem para: /messages/${userId}/${likedUserId}`);

    try {
      const response = await axios.post(
        `http://localhost:5000/messages/${userId}/${likedUserId}`,
        {
          content: message,
        },
      );
      console.log("Mensagem enviada:", response.data);
      setMessages([...messages, response.data.data]);
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

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

  // UseEffect para carregar dados sempre que userId ou likedUserId mudarem
  useEffect(() => {
    fetchMessages(); // Carregar as mensagens
    fetchUser(); // Carregar as informações do usuário logado
    fetchLikedUser(); // Carregar as informações do usuário "liked"
  }, [userId, likedUserId]); // Recarrega sempre que userId ou likedUserId mudarem

  return (
    <div className="back-chat">
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
              {/* Verificação para garantir que 'user' não seja null */}
              <h1>{user ? user.nome : "Carregando..."}</h1>
            </div>
            <div className="info-menu">
              {/* Verificação para garantir que 'user' não seja null */}
              <p>
                {user ? `${user.action}: ${user.interesse}` : "Carregando..."}
              </p>
            </div>
          </div>
          <img
            src={user?.imagem || "https://placehold.co/45"} // Verificação para garantir que 'user' não seja null
            className="img-perfil"
            alt="Perfil"
          />
        </div>
      </div>

      <div className="chat-container">
        {likedUser && (
          <div className="liked-user-info">
            <img
              src={user?.imagem || "https://placehold.co/45"} // Verificação para garantir que 'user' não seja null
              className="img-perfil-chat"
              alt="Perfil"
            />
            <h1>{likedUser ? likedUser.nome : "Carregando..."}</h1>
            <p>
              <strong>Cidade:</strong> {likedUser.cidade}, {likedUser.estado}
            </p>
            <p>
              <strong>Interesse</strong> {likedUser.action} -{" "}
              {likedUser.interesse}
            </p>
          </div>
        )}

        {/* Exibindo a mensagem de erro, se existir */}
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Exibindo as informações do usuário "liked" */}

        {/* Exibindo mensagens */}
        {loading ? (
          <div>Carregando mensagens...</div>
        ) : (
          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`message ${
                  msg.senderId === userId ? "sent" : "received"
                }`}
              >
                <strong>
                  {msg.senderId === userId
                    ? `${user?.nome} (Você):`
                    : `${likedUser?.nome}:`}{" "}
                </strong>{" "}
                {msg.content}
              </div>
            ))}
          </div>
        )}

        <div className="input-container">
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Digite sua mensagem..."
            className="input-text-chat"
          />
          <button className="btn-input" onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
