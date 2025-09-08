import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import React from "react";

const Section = styled.section`
  min-height: 80vh;
  padding: 2rem;
  background: rgba(24,26,32,0.8);
`;

export default function Analysis() {
  const { cveId } = useParams();
  const [cve, setCve] = React.useState(null);
  const [summary, setSummary] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`http://localhost:8080/api/v1/cve/${cveId}`)
      .then(res => res.json())
      .then(data => setCve(data))
      .finally(() => setLoading(false));
  }, [cveId]);

  const handleSummarize = () => {
    fetch(`http://localhost:8080/api/v1/cve/${cveId}/summarize`, { method: "POST" })
      .then(res => res.json())
      .then(data => setSummary(data.summary || "No summary available."));
  };

  return (
    <>
      <Navbar />
      <Section>
        {loading ? <p>Loading...</p> : cve ? (
          <>
            <h2>{cve.id}</h2>
            <p>{cve.description}</p>
            <p><strong>Severity:</strong> {cve.severity}</p>
            <p><strong>Published:</strong> {cve.publishedDate}</p>
            <button onClick={handleSummarize} style={{
              background: "#5F6FFF", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", marginTop: "1rem"
            }}>AI Summarize</button>
            {summary && (
              <div style={{ marginTop: "2rem", background: "#23272F", padding: "1rem", borderRadius: "8px" }}>
                <h3>AI Summary</h3>
                <p>{summary}</p>
              </div>
            )}
          </>
        ) : <p>CVEs not found.</p>}
      </Section>
      <Footer />
    </>
  );
}
