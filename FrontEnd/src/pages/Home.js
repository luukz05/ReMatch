import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-image: url("https://i.pinimg.com/originals/b2/65/75/b26575672c7512d8b33885e997a644e2.jpg");
  background-size: cover;
  font-family: 'Arial', sans-serif;
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.82);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #2e8b57;
  margin-bottom: 25px;
  font-size: 2em;
`;

const ProfilePicture = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const ProfileDescription = styled.div`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Button = styled.button`
  background-color: ${(props) => (props.isLike ? '#4caf50' : '#f44336')};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const NoProfilesMessage = styled.p`
  color: #2e8b57;
  font-size: 1.2em;
  margin-top: 20px;
`;

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [error, setError] = useState('');
  const [noMoreProfiles, setNoMoreProfiles] = useState(false); // Estado para verificar se não há mais perfis

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        setError('Erro ao carregar perfis. Tente novamente.');
      }
    };

    fetchProfiles();
  }, []);

  const handleNextProfile = () => {
    if (currentProfileIndex + 1 < profiles.length) {
      setCurrentProfileIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreProfiles(true); // Define que não há mais perfis
    }
  };

  const handleMatch = async (isLike) => {
    const currentProfile = profiles[currentProfileIndex];
    const loggedInUserId = localStorage.getItem('userId'); // Pega o ID do usuário logado

    try {
      await axios.post('http://localhost:5000/match', {
        userId: loggedInUserId,
        matchId: currentProfile._id,
        isLike: isLike // Indica se é um like ou dislike
      });
      handleNextProfile();
    } catch (error) {
      console.error('Erro ao dar match:', error);
      setError('Erro ao dar match. Tente novamente.');
    }
  };

  const currentProfile = profiles[currentProfileIndex];

  return (
    <Container>
      <Card>
        <Title>ReMatch</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {noMoreProfiles ? (
          <NoProfilesMessage>Não existem mais perfis disponíveis.</NoProfilesMessage>
        ) : (
          currentProfile && (
            <ProfileDescription>
              <ProfilePicture src={currentProfile.imagem || 'https://placehold.co/400x300'} alt="Foto de Perfil" />
              <h2>{currentProfile.nome}</h2>
              <p>{currentProfile.descricao}</p>
            </ProfileDescription>
          )
        )}
        {!noMoreProfiles && (
          <ButtonContainer>
            <Button onClick={() => handleMatch(false)}>👎</Button>
            <Button isLike onClick={() => handleMatch(true)}>👍</Button>
          </ButtonContainer>
        )}
      </Card>
    </Container>
  );
};

export default Dashboard;
