import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const MarkdownContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text};
    margin-top: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: 600;
  }
  
  h1 { font-size: 1.875rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
  h4 { font-size: 1.125rem; }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.lg};
    
    li {
      margin-bottom: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.accent};
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.surfaceSecondary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    
    p {
      margin: 0;
      font-style: italic;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.md} 0;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    
    th, td {
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
    
    th {
      background: ${({ theme }) => theme.colors.surfaceSecondary};
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
    }
    
    td {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
    
    tr:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  }
  
  hr {
    border: none;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

const CodeBlock = styled.div`
  position: relative;
  margin: ${({ theme }) => theme.spacing.md} 0;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Language = styled.span`
  text-transform: uppercase;
  font-weight: 600;
`;

const CopyButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const InlineCode = styled.code`
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  color: ${({ theme }) => theme.colors.accent};
  padding: 0.125rem 0.375rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875em;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;

const MarkdownRenderer = ({ content, className }) => {
  const { isDarkMode } = useTheme();
  const [copiedCode, setCopiedCode] = React.useState(null);
  
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const components = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
      
      if (!inline && match) {
        return (
          <CodeBlock>
            {language && (
              <CodeHeader>
                <Language>{language}</Language>
                <CopyButton
                  onClick={() => copyToClipboard(codeString, codeId)}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedCode === codeId ? (
                    <>
                      <Check size={12} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </CopyButton>
              </CodeHeader>
            )}
            <SyntaxHighlighter
              style={isDarkMode ? oneDark : oneLight}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.4',
              }}
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </CodeBlock>
        );
      }
      
      return (
        <InlineCode className={className} {...props}>
          {children}
        </InlineCode>
      );
    },
    
    a({ href, children, ...props }) {
      const isExternal = href?.startsWith('http');
      
      return (
        <StyledLink
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {isExternal && <ExternalLink size={12} />}
        </StyledLink>
      );
    },
  };

  return (
    <MarkdownContainer className={className}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
};

export default MarkdownRenderer;