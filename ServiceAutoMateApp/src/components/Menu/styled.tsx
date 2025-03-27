import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const MenuContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 12px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.img`
  height: 45px;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;