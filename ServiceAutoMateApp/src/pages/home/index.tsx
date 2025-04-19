import React from "react";
import {
  ActionButton,
  Container,
  Content,
  Subtitle,
  Title,
  ButtonContainer,
} from "./styled";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  title: string;
}

const Home: React.FC<HomeProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title>{title}</Title>
        <Subtitle>Automatize processos e ganhe eficiência!</Subtitle>
        <ButtonContainer>
          <ActionButton onClick={() => navigate("/clientes")}>
            Clientes
          </ActionButton>
          <ActionButton onClick={() => navigate("/solicitacoes")}>
            Solicitações de Serviço
          </ActionButton>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Home;
