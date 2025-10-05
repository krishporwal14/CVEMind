import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check,
  RefreshCw,
  AlertTriangle,
  Share2,
  Download,
  Info
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SeverityBadge from "../components/SeverityBadge";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { Loading, LoadingOverlay } from "../components/Loading";
import { cveApi } from "../services/api";
import { formatDate } from "../utils/helpers";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const ContentSection = styled.section`
  flex: 1;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled(motion.div)`
  margin-bottom: 2rem;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const CveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CveTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CveActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.accent : 'transparent'};
  color: ${({ variant, theme }) => 
    variant === 'primary' ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.accentHover : theme.colors.surfaceHover};
    border-color: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.accentHover : theme.colors.accent};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CveMetadata = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetadataLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetadataValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const CveDescription = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const ReferencesSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ReferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ReferenceLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.accentHover};
  }
`;

const AnalysisSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  position: relative;
`;

const AnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ErrorState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const ErrorIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.danger};
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
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default function Analysis() {
  const { cveId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [cve, setCve] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load CVE data
  const loadCveData = useCallback(async () => {
    console.log('Loading CVE data for:', cveId);
    setLoading(true);
    setError(null);
    
    try {
      const data = await cveApi.getCveById(cveId);
      console.log('CVE data loaded:', data);
      setCve(data);
    } catch (err) {
      console.error('Error loading CVE data:', err);
      setError(err.message || 'Failed to load CVE data');
    } finally {
      setLoading(false);
    }
  }, [cveId]);

  useEffect(() => {
    if (cveId) {
      loadCveData();
    }
  }, [cveId, loadCveData]);

  // Check for cached analysis
  useEffect(() => {
    const cachedAnalysis = sessionStorage.getItem(`cve-analysis-${cveId}`);
    if (cachedAnalysis) {
      try {
        const parsed = JSON.parse(cachedAnalysis);
        setAnalysis(parsed);
        sessionStorage.removeItem(`cve-analysis-${cveId}`); // Clean up
      } catch (err) {
        console.error('Failed to parse cached analysis:', err);
      }
    }
  }, [cveId]);

  const handleAnalyze = async (e) => {
    console.log('AI Analysis button clicked');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!cveId || analyzing) {
      console.log('Cannot analyze: missing CVE ID or already analyzing');
      return;
    }
    
    console.log('Starting AI analysis for CVE:', cveId);
    setAnalyzing(true);
    setError(null); // Clear any previous errors
    
    try {
      const result = await cveApi.summarizeCve(cveId);
      console.log('AI analysis result:', result);
      
      if (result && result.summary) {
        setAnalysis(result);
        console.log('Analysis set successfully');
      } else {
        throw new Error('Invalid response format from AI analysis');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
    } finally {
      setAnalyzing(false);
      console.log('Analysis process complete');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CVE Analysis: ${cveId}`,
          text: cve?.description || `Analysis of vulnerability ${cveId}`,
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred, fallback to copy
        console.log('Share cancelled or failed:', err);
        handleCopy(url);
      }
    } else {
      handleCopy(url);
    }
  };

  const handleExport = () => {
    const content = [
      `# CVE Analysis: ${cveId}`,
      '',
      `**Severity:** ${cve?.severity || 'Unknown'}`,
      `**Published:** ${formatDate(cve?.publishedDate)}`,
      '',
      '## Description',
      cve?.description || 'No description available',
      '',
      '## AI Analysis',
      analysis?.summary || 'No analysis available',
      '',
      '## References',
      ...(parseReferences(cve?.references) || []).map(ref => `- ${ref}`),
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cveId}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseReferences = (references) => {
    if (!references) return [];
    
    if (typeof references === 'string') {
      try {
        const parsed = JSON.parse(references);
        return Array.isArray(parsed) ? parsed : [references];
      } catch {
        return references.split(/[,;\n]/).map(ref => ref.trim()).filter(ref => ref);
      }
    }
    
    return Array.isArray(references) ? references : [];
  };

  const references = parseReferences(cve?.references);

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <ContentSection>
          <Loading text="Loading CVE data..." />
        </ContentSection>
        <Footer />
      </PageContainer>
    );
  }

  if (error && !cve) {
    return (
      <PageContainer>
        <Navbar />
        <ContentSection>
          <ErrorState
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ErrorIcon>
              <AlertTriangle size={24} />
            </ErrorIcon>
            <h3>Failed to Load CVE</h3>
            <p>{error}</p>
            <ActionButton onClick={loadCveData} style={{ marginTop: '1rem' }}>
              <RefreshCw size={14} />
              Try Again
            </ActionButton>
          </ErrorState>
        </ContentSection>
        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      
      <ContentSection>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BackButton
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            whileTap={{ scale: 0.95 }}
            type="button"
          >
            <ArrowLeft size={16} />
            Back to Results
          </BackButton>
          
          <CveHeader>
            <div>
              <CveTitle>{cveId}</CveTitle>
            </div>
            
            <CveActions>
              <ActionButton
                variant="primary"
                onClick={(e) => {
                  e.preventDefault(); // Prevent any form submission
                  handleAnalyze(e);
                }}
                disabled={analyzing}
                whileTap={{ scale: 0.95 }}
                type="button" // Explicitly set as button type
              >
                {analyzing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    AI Analysis
                  </>
                )}
              </ActionButton>
              
              <ActionButton
                onClick={(e) => {
                  e.preventDefault();
                  handleShare();
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <Share2 size={14} />
                Share
              </ActionButton>
              
              <ActionButton
                onClick={(e) => {
                  e.preventDefault();
                  handleExport();
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <Download size={14} />
                Export
              </ActionButton>
            </CveActions>
          </CveHeader>
        </Header>

        {cve && (
          <>
            <CveMetadata
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <MetadataItem>
                <MetadataLabel>Severity</MetadataLabel>
                <MetadataValue>
                  <SeverityBadge severity={cve.severity} />
                </MetadataValue>
              </MetadataItem>
              
              <MetadataItem>
                <MetadataLabel>Published Date</MetadataLabel>
                <MetadataValue>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} />
                    {formatDate(cve.publishedDate)}
                  </div>
                </MetadataValue>
              </MetadataItem>
              
              <MetadataItem>
                <MetadataLabel>CVE ID</MetadataLabel>
                <MetadataValue style={{ fontFamily: 'var(--font-mono)' }}>
                  {cveId}
                </MetadataValue>
              </MetadataItem>
            </CveMetadata>

            <CveDescription
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SectionTitle>
                <Info size={18} />
                Description
              </SectionTitle>
              <Description>{cve.description || 'No description available'}</Description>
            </CveDescription>

            {references.length > 0 && (
              <ReferencesSection
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <SectionTitle>
                  <ExternalLink size={18} />
                  References ({references.length})
                </SectionTitle>
                <ReferencesList>
                  {references.map((ref, index) => (
                    <ReferenceLink
                      key={index}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                      {ref}
                    </ReferenceLink>
                  ))}
                </ReferencesList>
              </ReferencesSection>
            )}

            <AnalysisSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <LoadingOverlay isVisible={analyzing}>
                <AnalysisHeader>
                  <SectionTitle>
                    <Sparkles size={18} />
                    AI Analysis
                  </SectionTitle>
                  
                  {analysis && (
                    <CopyButton
                      onClick={() => handleCopy(analysis.summary)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copied ? (
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
                  )}
                </AnalysisHeader>

                <AnimatePresence mode="wait">
                  {analysis ? (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <MarkdownRenderer content={analysis.summary} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-analysis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Sparkles size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p>Click "AI Analysis" to generate an intelligent summary of this vulnerability.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LoadingOverlay>
            </AnalysisSection>
          </>
        )}
      </ContentSection>
      
      <Footer />
    </PageContainer>
  );
}
