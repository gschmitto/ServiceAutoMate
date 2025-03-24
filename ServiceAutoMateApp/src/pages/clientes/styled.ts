import styled, { keyframes } from "styled-components";

// Animações do popup
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Container principal com espaçamento e estilo mais clean
export const Container = styled.div`
  padding: 30px;
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  color: #333;
`;

// Botão moderno com cor de fundo atraente e transições suaves
export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #4CAF50;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

// Estilo para o popup, com animação de entrada suave
export const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;
`;

// Conteúdo do popup com bordas arredondadas e sombra suave
export const PopupContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

// Estilo para o título do popup, com um tom mais suave e moderno
export const PopupTitle = styled.h3`
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
`;

export const AcaoAddContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:hover {
    border-color: #0056b3;
  }
`;