import { styled } from "styled-components";

export const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoaderSpinner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const LoaderDot = styled.div`
  width: 20px;
  height: 20px;
  background-color: #333;
  border-radius: 50%;
  animation: loader-spinner-dot 1.2s infinite;

  @keyframes loader-spinner-dot {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
`;