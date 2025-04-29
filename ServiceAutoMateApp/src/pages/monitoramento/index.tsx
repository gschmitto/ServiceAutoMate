import React from "react";
import { Container } from "../../shared/styled";

interface MonitoramentoProps {
  title: string;
}

const Monitoramento: React.FC<MonitoramentoProps> = ({ title }) => {
  return (
    <Container>
      <h2 style={{ marginBottom: "10px" }}>{title}</h2>
      <iframe
        title="Service Automate Dashboard"
        src="http://localhost:4000/public-dashboards/3494cc8859e1483db5e24bdd37f84be4"
        width="100%"
        height="100%"
        style={{ border: "none", height: "73vh" }}
      ></iframe>
    </Container>
  );
};

export default Monitoramento;
