import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 69.11px);
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: white;
  text-align: center;
  overflow: hidden;
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
  justify-content: space-around;
`;

export const ActionButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;
