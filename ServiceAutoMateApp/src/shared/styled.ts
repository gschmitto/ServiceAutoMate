import styled, { keyframes } from "styled-components";

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

interface PopupContentProps {
  width?: string;
}

export const PopupContent = styled.div<PopupContentProps>`
  background: white;
  padding: 15px 30px 30px;
  border-radius: 10px;
  width: ${({ width }) => width ?? "450px"};
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.3s ease-out;
  color: ${({ theme }) => theme.colors.black};
`;

export const Container = styled.div`
  padding: 30px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 89vh;
  font-family: "Roboto", sans-serif;
  color: ${({ theme }) => theme.colors.black};
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.delete};
  &:hover {
    background-color: ${({ theme }) => theme.colors.deleteSeconday};
  }
`;

export const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.save};
  &:hover {
    background-color: ${({ theme }) => theme.colors.saveSecondary};
  }
`;

export const AcaoAddContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 4px 0 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: "Roboto", sans-serif;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &:hover {
    border-color: #0056b3;
  }
`;

export const FiltroBtn = styled.button`
  position: absolute;
  right: 1px;
  background: initial;
  bottom: 7px;
  border: none;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
`;

export const FiltroIcon = styled.i`
  font-size: 16px;
  margin-left: 10px;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-bottom: 5px;
  position: relative;
  top: -5px;
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 12px;
  padding-left: 2px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const PrefixSymbol = styled.span`
  margin-left: 4px;
  margin-right: 4px;
`;

export const SufixSymbol = styled.span`
  margin-left: 4px;
`;

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

interface FlexContainerProps {
  marginright?: number;
  display?: string;
  iscolumn?: boolean;
}

export const FlexContainer = styled.div<FlexContainerProps>`
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.marginright}px;
  display: ${(props) => props.display};
  flex-direction: ${(props) => (props.iscolumn ? "column" : "row")};
  align-items: baseline;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

export const Th = styled.th`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
`;

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

interface FiltroContentProps {
  width?: number;
}

export const FiltroContent = styled.div<FiltroContentProps>`
  display: flex;
  width: ${({ width }) => width}px;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;
