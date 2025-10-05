import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ToggleButton = styled(motion.button)`
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: ${({ theme, isDark }) => 
    isDark ? theme.colors.accent : theme.colors.border};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.125rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ theme, isDark }) => 
      isDark ? theme.colors.accentHover : theme.colors.textMuted};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const ToggleHandle = styled(motion.div)`
  width: 1.25rem;
  height: 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const IconWrapper = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      isDark={isDarkMode}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <ToggleHandle
        animate={{
          x: isDarkMode ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      >
        <IconWrapper>
          {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
        </IconWrapper>
      </ToggleHandle>
    </ToggleButton>
  );
};

export default ThemeToggle;