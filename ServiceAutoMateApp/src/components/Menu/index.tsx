import { Logo, MenuContainer, NavLinks, StyledLink } from "./styled";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { AiOutlineHome } from "react-icons/ai";

const Menu: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <MenuContainer>
      <Logo src={logo} alt="Logo" />
      <NavLinks>
        <StyledLink to="/" className={isActive("/") ? "active" : ""}>
          <AiOutlineHome size={24} />
        </StyledLink>
        <StyledLink to="/clientes" className={isActive("/clientes") ? 'active' : ''}>
          Clientes
        </StyledLink>
        <StyledLink to="/solicitacoes" className={isActive("/solicitacoes") ? 'active' : ''}>
          Solicitação de Serviços
        </StyledLink>
      </NavLinks>
    </MenuContainer>
  );
};

export default Menu;