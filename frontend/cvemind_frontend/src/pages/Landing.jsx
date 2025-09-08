import BrainBackground from "../components/BrainBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  text-shadow: 0 2px 16px #23272F;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 2rem;
`;

export default function Landing() {
  const navigate = useNavigate();
  const handleSearch = (keyword) => {
    if (keyword.trim()) navigate(`/results?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <>
      <BrainBackground />
      <Navbar />
      <Section>
        <Title>CVEMind</Title>
        <Subtitle>
          Discover, analyze, and understand vulnerabilities with AI-powered insights.
        </Subtitle>
        <SearchBar onSearch={handleSearch} />
      </Section>
      <Footer />
    </>
  );
}
