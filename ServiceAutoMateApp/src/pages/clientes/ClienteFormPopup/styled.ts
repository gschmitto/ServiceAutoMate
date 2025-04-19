import styled from "styled-components";

export const ContainerFretesAdd = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

export const FreteListContainer = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  padding-right: 10px;
  margin-bottom: 10px;
`;

export const FreteContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
`;
