import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ExternalLink, 
  Eye, 
  Sparkles,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SeverityBadge from './SeverityBadge';
import { formatDate, truncateText } from '../utils/helpers';

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CveId = styled.h3`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.accent : 'transparent'};
  color: ${({ variant, theme }) => 
    variant === 'primary' ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.accentHover : theme.colors.surfaceHover};
    border-color: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.accentHover : theme.colors.accent};
  }
`;

const ExpandedContent = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ReferenceLink = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;

const ExpandButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const CveCard = ({ 
  cve, 
  onAnalyze,
  showAnalyzeButton = false, // Changed default to false
  className 
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or links
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    e.preventDefault(); // Prevent default behavior
    navigate(`/analysis/${cve.id}`);
  };

  const handleAnalyze = async (e) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any form submission
    
    if (onAnalyze && !isAnalyzing) {
      setIsAnalyzing(true);
      try {
        await onAnalyze(cve.id);
      } catch (err) {
        console.error('Error in handleAnalyze:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const parseReferences = (references) => {
    if (!references) return [];
    
    // Handle both string and array formats
    if (typeof references === 'string') {
      // Try to parse as JSON array first
      try {
        const parsed = JSON.parse(references);
        return Array.isArray(parsed) ? parsed : [references];
      } catch {
        // Split by common delimiters if not JSON
        return references.split(/[,;\n]/).map(ref => ref.trim()).filter(ref => ref);
      }
    }
    
    return Array.isArray(references) ? references : [];
  };

  const references = parseReferences(cve.references);
  const hasReferences = references.length > 0;
  const truncatedDescription = truncateText(cve.description, 150);
  const showExpandButton = cve.description && cve.description.length > 150;

  return (
    <Card
      className={className}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <CardHeader>
        <CveId>{cve.id}</CveId>
        <SeverityBadge severity={cve.severity} />
      </CardHeader>

      <Description>
        {isExpanded ? cve.description : truncatedDescription}
      </Description>

      {showExpandButton && (
        <ExpandButton
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show more <ChevronDown size={14} />
            </>
          )}
        </ExpandButton>
      )}

      {isExpanded && (
        <ExpandedContent
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {hasReferences && (
            <>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '0.875rem', 
                color: 'var(--text-color)' 
              }}>
                References:
              </h4>
              <ReferencesList>
                {references.slice(0, 3).map((ref, index) => (
                  <ReferenceLink
                    key={index}
                    href={ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {truncateText(ref, 50)}
                    <ExternalLink size={12} />
                  </ReferenceLink>
                ))}
                {references.length > 3 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    +{references.length - 3} more references
                  </span>
                )}
              </ReferencesList>
            </>
          )}
        </ExpandedContent>
      )}

      <CardFooter>
        <MetaInfo>
          <Calendar size={12} />
          {formatDate(cve.publishedDate)}
        </MetaInfo>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <ActionButton
            onClick={(e) => {
              e.preventDefault();
              handleCardClick(e);
            }}
            whileTap={{ scale: 0.95 }}
            type="button"
          >
            <Eye size={12} />
            View Details
          </ActionButton>
          
          {showAnalyzeButton && onAnalyze && (
            <ActionButton
              variant="primary"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={12} />
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
            </ActionButton>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CveCard;