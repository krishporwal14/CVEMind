import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { GlobalStyles } from "./globalStyles";
import Landing from "./pages/Landing";
import Results from "./pages/Results";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/analysis/:cveId" element={<Analysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}