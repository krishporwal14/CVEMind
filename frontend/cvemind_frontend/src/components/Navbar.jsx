import styled from "styled-components";
import { Link } from "react-router-dom";

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.accent};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

export default function Navbar() {
  return (
    <Nav>
      <Logo>CVEMind</Logo>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/results">Results</Link>
        <Link to="/analysis">AI Analysis</Link>
      </NavLinks>
    </Nav>
  );
}
