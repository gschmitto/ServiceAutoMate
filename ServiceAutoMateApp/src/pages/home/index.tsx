import React from "react";
import { ActionButton, Container, Content, Subtitle, Title } from "./styled";

interface HomeProps {
  title: string;
}

const Home: React.FC<HomeProps> = ({ title }) => {
  return (
    <Container>
      <Content>
        <Title>{title}</Title>
        <Subtitle>Automatize processos e ganhe eficiência!</Subtitle>
        <ActionButton>Saiba mais</ActionButton>
      </Content>
    </Container>
  );
};

export default Home;