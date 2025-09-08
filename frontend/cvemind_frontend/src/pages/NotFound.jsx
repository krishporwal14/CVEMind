import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.danger};
`;

export default function NotFound() {
  return (
    <>
      <Navbar />
      <Section>
        <h1>404 - Page Not Found</h1>
      </Section>
      <Footer />
    </>
  );
}
