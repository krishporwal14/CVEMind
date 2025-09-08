import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import React from "react";

const Section = styled.section`
  min-height: 80vh;
  padding: 2rem;
  background: rgba(24,26,32,0.8);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 2px 8px #181A2044;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.accent}22;
  }
`;

export default function Results() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (keyword) {
      setLoading(true);
      fetch(`http://localhost:8080/api/v1/cve/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }
  }, [keyword]);

  const handleSearch = (kw) => {
    if (kw.trim()) navigate(`/results?keyword=${encodeURIComponent(kw)}`);
  };

  return (
    <>
      <Navbar />
      <Section>
        <SearchBar onSearch={handleSearch} />
        {loading ? <p>Loading...</p> : (
          <List>
            {results.map(cve => (
              <Item key={cve.id} onClick={() => navigate(`/analysis/${cve.id}`)}>
                <strong>{cve.id}</strong> &mdash; {cve.description}
                <br />
                <span style={{ color: "#5F6FFF" }}>{cve.severity}</span>
              </Item>
            ))}
          </List>
        )}
      </Section>
      <Footer />
    </>
  );
}
