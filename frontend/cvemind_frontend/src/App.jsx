import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import { GlobalStyles } from "./globalStyles";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useTheme } from "./hooks/useTheme";
import Landing from "./pages/Landing";
import Results from "./pages/Results";
import Analysis from "./pages/Analysis";
import AllCves from "./pages/AllCves";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/all" element={<AllCves />} />
          <Route path="/results" element={<Results />} />
          <Route path="/analysis/:cveId" element={<Analysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </StyledThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}