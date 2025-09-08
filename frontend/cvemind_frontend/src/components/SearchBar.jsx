import React from "react";
import styled from "styled-components";

const Bar = styled.form`
  display: flex;
  gap: 1rem;
  margin: 2rem auto;
  max-width: 500px;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;

export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = React.useState("");
  return (
    <Bar onSubmit={e => { e.preventDefault(); onSearch(keyword); }}>
      <Input
        type="text"
        placeholder="Search CVEs (e.g. windows, apache, CVE-2024-1234)"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <Button type="submit">Search</Button>
    </Bar>
  );
}
