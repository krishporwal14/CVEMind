import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, Database, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Nav = styled(motion.nav)`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  text-decoration: none;
  
  img {
    height: 3.5rem;
    width: auto;
    transition: all ${({ theme }) => theme.transitions.normal};
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.accent : theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    width: ${({ $isActive }) => $isActive ? '100%' : '0'};
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
    transform: translateX(-50%);
    transition: width ${({ theme }) => theme.transitions.normal};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    
    &::after {
      display: none;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/all', label: 'All CVEs', icon: Database },
    { path: '/results', label: 'Search', icon: Search },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Logo
        as={Link}
        to="/"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={closeMobileMenu}
      >
        <img src="/logo.png" alt="CVEMind" />
      </Logo>

      <NavLinks isOpen={isMobileMenuOpen}>
        {navItems.map(({ path, label, icon }) => {
          const IconComponent = icon;
          return (
            <NavLink
              key={path}
              to={path}
              $isActive={location.pathname === path}
              onClick={closeMobileMenu}
            >
              <IconComponent size={16} />
              {label}
            </NavLink>
          );
        })}
      </NavLinks>

      <Controls>
        <ThemeToggle />
        
        <MobileMenuButton
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </MobileMenuButton>
      </Controls>
    </Nav>
  );
}
