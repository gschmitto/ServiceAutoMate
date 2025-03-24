import styled from "styled-components";

// Estilo para a tabela com bordas arredondadas e sombras sutis
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

// Cabeçalhos da tabela com fundo escuro e texto claro
export const Th = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
`;

// Células da tabela com estilo limpo e bordas suaves
export const Td = styled.td`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #555;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const AcaoConteiner = styled.div`
  display: flex;
  justify-content: space-evenly;
`;