import { useState } from 'react';
import React from 'react';
import styled from 'styled-components';

// Estilos
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  height:100%;
  width:100%;
  background-size: cover;
  background-image: url("https://i.pinimg.com/originals/b2/65/75/b26575672c7512d8b33885e997a644e2.jpg");
  font-family: 'Arial', sans-serif;
  color: #2e8b57;
  position:absolute;
  top:0;
  left:0;
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.82);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  color: #2e8b57;
  margin-bottom: 25px;
  font-size: 2em;
`;

const Input = styled.input`
  width: 375px;
  padding: 12px;
  margin-bottom: 18px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const Divider = styled.p`
  margin: 20px 0;
  color: #6c757d;
  font-size: 14px;
`;

const ImageGallery = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Image = styled.img`
  width: 30%;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }), // Envia os dados de login
      });

      const data = await response.json(); // Processa a resposta JSON

      if (response.ok) {
        // Salva o token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        // Redirecionar após o login bem-sucedido
        window.location.href = '/home'; // Exemplo: redirecionar para a página inicial
      } else {
        // Exibe mensagem de erro
        setErrorMessage(data.error);
      }
    } catch (error) {
      setErrorMessage('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <Container>
      <Card>
        <Title>ReMatch ♻️</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Digite seu Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Digite sua Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Entrar</Button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Exibir erro, se houver */}

        <Divider>ou</Divider>

        <Button onClick={() => window.location.href = '/cadastro'}>Criar Conta</Button>

        <ImageGallery>
          <Image src="https://www.fiepr.org.br/nospodemosparana/uploadAddress/E_SDG_Icons_NoText-11[70248].png" />
          <Image src="https://www.fiepr.org.br/nospodemosparana/uploadAddress/E_SDG_Icons_NoText-12[70249].png" />
          <Image src="https://www.fiepr.org.br/nospodemosparana/uploadAddress/E_SDG_Icons_NoText-17[70254].png" />
        </ImageGallery>
      </Card>
    </Container>
  );
};

export default HomePage;
