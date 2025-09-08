import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    overflow-x: hidden;
  }
  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
  }
`;
