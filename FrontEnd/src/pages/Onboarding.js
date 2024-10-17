import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-image: url("https://i.pinimg.com/originals/b2/65/75/b26575672c7512d8b33885e997a644e2.jpg");
  font-family: 'Arial', sans-serif;
  color: #2e8b57;
  position: absolute;
  top: 0;
  left: 0;
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
  align-items:center;
`;

const Title = styled.h1`
  color: #2e8b57;
  margin-bottom: 25px;
  font-size: 2em;
`;

const Input = styled.input`
  width: 100%;
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

const Onboarding = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('Individual');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        nome: name,           // Frontend: "name" -> Backend: "nome"
        email: email,
        senha: password,      // Frontend: "password" -> Backend: "senha"
        area: accountType,    // Use accountType ou crie um campo "área" no frontend
        interesse: companyName, // Ou adapte para interesse real
        descricao: description,
      });
      
      alert('Cadastro realizado com sucesso!');
      navigate('/');  // Redireciona após o cadastro
    } catch (error) {
      alert('Erro ao cadastrar. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Criar Conta</Title>

        {/* Nome completo ou Nome da Empresa */}
        <Input
          type="text"
          placeholder={accountType === 'Individual' ? 'Nome Completo' : 'Razão Social'}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Nome da Empresa, se for o caso */}
        {accountType === 'Company' && (
          <Input
            type="text"
            placeholder="Nome Fantasia"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        )}

        {/* Email */}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Senha */}
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Tipo de conta */}
        <select
          style={{ padding: '12px', borderRadius: '8px', marginBottom: '18px', width: '100%' }}
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="Individual">Pessoa Física</option>
          <option value="Company">Pessoa Jurídica</option>
        </select>

        {/* Descrição breve */}
        <Input
          type="text"
          placeholder='Descreva brevemente sua área de atuação'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Localização */}
        <Input
          type="text"
          placeholder="Localização (Cidade, Estado)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Botão de cadastro */}
        <Button onClick={handleSignup}>Cadastrar-se</Button>
      </Card>
    </Container>
  );
};

export default Onboarding;
