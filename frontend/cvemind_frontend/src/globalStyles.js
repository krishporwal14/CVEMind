import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.6;
    font-size: 16px;
    transition: background-color ${({ theme }) => theme.transitions.normal}, 
                color ${({ theme }) => theme.transitions.normal};
    
    /* Better font rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Link styles */
  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.accentHover};
    }
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
  }
  
  /* Button reset */
  button {
    font-family: inherit;
    border: none;
    outline: none;
    cursor: pointer;
    
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
    }
  }
  
  /* Input styles */
  input, textarea, select {
    font-family: inherit;
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
    }
  }
  
  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.textMuted};
    }
  }
  
  /* Selection styles */
  ::selection {
    background: ${({ theme }) => theme.colors.accentLight};
    color: ${({ theme }) => theme.colors.text};
  }
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }
  
  /* Paragraphs */
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  /* Lists */
  ul, ol {
    margin: 0;
    padding: 0;
  }
  
  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Loading animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  /* Focus ring for accessibility */
  .focus-ring {
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
    }
  }
  
  /* Print styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    .no-print {
      display: none !important;
    }
  }
  
  /* High contrast mode */
  @media (prefers-contrast: high) {
    body {
      background: ${({ theme }) => theme.colors.background} !important;
      color: ${({ theme }) => theme.colors.text} !important;
    }
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
