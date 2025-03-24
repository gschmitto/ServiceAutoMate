import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  color: white;
  text-align: center;
`;

export const Content = styled.div`
  max-width: 600px;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const ActionButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: #e67e22;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #d35400;
  }
`;