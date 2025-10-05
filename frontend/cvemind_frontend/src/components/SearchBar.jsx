import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, Command } from "lucide-react";
import { debounce } from "../utils/helpers";

const SearchContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchForm = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme, isFocused }) => 
    isFocused ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme, isFocused }) => 
    isFocused ? theme.shadows.lg : theme.shadows.sm};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 0;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
`;

const SearchActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.accent : 'transparent'};
  color: ${({ variant, theme }) => 
    variant === 'primary' ? 'white' : theme.colors.textMuted};
  border: ${({ variant, theme }) => 
    variant === 'primary' ? 'none' : `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.accentHover : theme.colors.surfaceHover};
    color: ${({ variant, theme }) => 
      variant === 'primary' ? 'white' : theme.colors.text};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ClearButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: ${({ theme }) => theme.colors.textMuted};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 1;
  }
`;

const SearchSuggestions = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  margin-top: 0.5rem;
  overflow: hidden;
  z-index: 100;
`;

const SuggestionItem = styled(motion.div)`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SearchHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  justify-content: center;
`;

const KeyboardShortcut = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.625rem;
`;

const commonSuggestions = [
  "Apache",
  "Microsoft Windows", 
  "Linux Kernel",
  "OpenSSL",
  "CVE-2024-",
  "Critical vulnerabilities",
  "High severity",
  "Remote code execution"
];

export default function SearchBar({ 
  onSearch, 
  onSuggestionSearch,
  placeholder = "Search CVEs (e.g. Apache, CVE-2024-1234, critical vulnerabilities)",
  isLoading = false,
  showSuggestions = true,
  autoFocus = false 
}) {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  
  // Debounced search for real-time suggestions
  const debouncedSuggestionSearch = useCallback(
    (query) => {
      const debouncedFn = debounce((q) => {
        if (onSuggestionSearch && q.length > 2) {
          onSuggestionSearch(q);
        }
      }, 300);
      debouncedFn(query);
    },
    [onSuggestionSearch]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() && onSearch) {
      onSearch(keyword.trim());
      setShowSuggestionsList(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    
    if (showSuggestions) {
      setShowSuggestionsList(value.length > 0);
      debouncedSuggestionSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    setShowSuggestionsList(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleClear = () => {
    setKeyword("");
    setShowSuggestionsList(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && keyword.length > 0) {
      setShowSuggestionsList(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestionsList(false), 200);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="search"]')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSuggestions = keyword.length > 0 
    ? commonSuggestions.filter(s => 
        s.toLowerCase().includes(keyword.toLowerCase())
      ).slice(0, 6)
    : commonSuggestions.slice(0, 6);

  return (
    <SearchContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SearchForm onSubmit={handleSubmit} isFocused={isFocused}>
        <SearchIcon>
          <Search size={20} />
        </SearchIcon>
        
        <SearchInput
          type="search"
          placeholder={placeholder}
          value={keyword}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
        />
        
        <SearchActions>
          <AnimatePresence>
            {keyword && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <ClearButton
                  type="button"
                  onClick={handleClear}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </ClearButton>
              </motion.div>
            )}
          </AnimatePresence>
          
          <ActionButton
            type="submit"
            variant="primary"
            disabled={!keyword.trim() || isLoading}
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </ActionButton>
        </SearchActions>
      </SearchForm>

      <AnimatePresence>
        {showSuggestionsList && showSuggestions && (
          <SearchSuggestions
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ backgroundColor: "var(--surface-hover)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {suggestion}
              </SuggestionItem>
            ))}
          </SearchSuggestions>
        )}
      </AnimatePresence>

      <SearchHint>
        <span>Press</span>
        <KeyboardShortcut>
          <Command size={10} />
          K
        </KeyboardShortcut>
        <span>to focus</span>
      </SearchHint>
    </SearchContainer>
  );
}
