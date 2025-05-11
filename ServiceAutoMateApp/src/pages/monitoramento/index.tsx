import React, { useState } from "react";
import { AcaoAddContainer, Button, Container } from "../../shared/styled";
import { MonitoramentoService } from "../../services/MonitoramentoService";
import { toast } from "react-toastify";

interface MonitoramentoProps {
  title: string;
}

const Monitoramento: React.FC<MonitoramentoProps> = ({ title }) => {
  const [iframeKey, setIframeKey] = useState(1);
  
  const handleClick = async () => {
    try {
      await MonitoramentoService.getMonitoramento();
      setIframeKey(iframeKey + 1);
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

  return (
    <Container>
      <AcaoAddContainer style={{ marginBottom: "10px" }}>
        <h2>{title}</h2>
        <Button onClick={() => handleClick()}>Previsão do próximo mês</Button>
      </AcaoAddContainer>
      <iframe
        title="Service Automate Dashboard"
        src="http://localhost:4000/public-dashboards/3494cc8859e1483db5e24bdd37f84be4?theme=light"
        width="100%"
        height="100%"
        style={{ border: "none", height: "75vh" }}
        key={iframeKey}
      ></iframe>
    </Container>
  );
};

export default Monitoramento;
