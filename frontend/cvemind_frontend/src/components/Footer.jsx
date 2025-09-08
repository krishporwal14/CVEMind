import styled from "styled-components";

const Foot = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  padding: 1rem 0;
  position: relative;
  z-index: 2;
`;

export default function Footer() {
  return (
    <Foot>
      &copy; {new Date().getFullYear()} CVEMind. All rights reserved.
    </Foot>
  );
}
