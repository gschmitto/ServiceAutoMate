import styled from "styled-components";

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;  // Espaçamento entre os ícones e a informação da página
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
  color: #007bff;
  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
  &:hover {
    color: #0056b3;
  }
`;

export const PageInfo = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;
