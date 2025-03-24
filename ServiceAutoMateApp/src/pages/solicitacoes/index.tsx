import React from "react";

interface SolicitacoesProps {
  title: string;
}

const Solicitacoes: React.FC<SolicitacoesProps> = ({title}) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Esta é a página de Solicitações de Serviço.</p>
    </div>
  );
};

export default Solicitacoes;
