import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List as ListIcon,
  AlertTriangle,
  RefreshCw,
  Download,
  Database
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CveCard from "../components/CveCard";
import SeverityBadge from "../components/SeverityBadge";
import { Loading, SkeletonGrid } from "../components/Loading";
import { cveApi } from "../services/api";
import { getSeverityVariant, getSkeletonCount } from "../utils/helpers";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const ContentSection = styled.section`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ControlsSection = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ResultsCount = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.backgroundGradient};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0.5rem;
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${({ active, theme }) => 
    active ? theme.colors.accent : 'transparent'};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.textSecondary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.accentHover : theme.colors.surfaceHover};
    color: ${({ active, theme }) => 
      active ? 'white' : theme.colors.text};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.backgroundGradient};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled(motion.button)`
  padding: 0.5rem;
  background: ${({ active, theme }) => 
    active ? theme.colors.accent : 'transparent'};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.textSecondary};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.accentHover : theme.colors.surfaceHover};
    color: ${({ active, theme }) => 
      active ? 'white' : theme.colors.text};
  }
`;

const SeverityFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ResultsContainer = styled(motion.div)`
  margin-top: 2rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ viewMode }) => 
    viewMode === 'grid' 
      ? 'repeat(auto-fill, minmax(350px, 1fr))' 
      : '1fr'};
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
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

export default function AllCves() {
  // State
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('publishedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');

  // Load all CVEs
  useEffect(() => {
    loadAllCves();
  }, []);

  const loadAllCves = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await cveApi.getAllCves();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load CVEs');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAllCves();
  };

  const handleExport = () => {
    const csvContent = [
      ['CVE ID', 'Severity', 'Description', 'Published Date'].join(','),
      ...filteredAndSortedResults.map(cve => [
        cve.id,
        cve.severity || 'Unknown',
        `"${cve.description?.replace(/"/g, '""') || ''}"`,
        cve.publishedDate || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-cves-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter and sort results
  const filteredAndSortedResults = React.useMemo(() => {
    let filtered = results;
    
    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(cve => 
        getSeverityVariant(cve.severity) === severityFilter
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'severity': {
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, unknown: 0 };
          aValue = severityOrder[getSeverityVariant(a.severity)] || 0;
          bValue = severityOrder[getSeverityVariant(b.severity)] || 0;
          break;
        }
        case 'publishedDate': {
          aValue = new Date(a.publishedDate || 0);
          bValue = new Date(b.publishedDate || 0);
          break;
        }
        case 'id':
        default: {
          aValue = a.id || '';
          bValue = b.id || '';
          break;
        }
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [results, severityFilter, sortBy, sortOrder]);

  const severityStats = React.useMemo(() => {
    const stats = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 };
    results.forEach(cve => {
      const severity = getSeverityVariant(cve.severity);
      stats[severity] = (stats[severity] || 0) + 1;
    });
    return stats;
  }, [results]);

  return (
    <PageContainer>
      <Navbar />
      
      <ContentSection>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PageTitle>
            <Database size={36} />
            All CVEs
          </PageTitle>
          <PageDescription>
            Browse the complete database of Common Vulnerabilities and Exposures (CVEs) 
            with advanced filtering and sorting options.
          </PageDescription>
        </PageHeader>

        <ControlsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <LeftControls>
            <ResultsCount>
              {loading ? (
                "Loading CVEs..."
              ) : error ? (
                "Failed to load"
              ) : (
                <>
                  Showing <strong>{filteredAndSortedResults.length}</strong> of <strong>{results.length}</strong> CVEs
                </>
              )}
            </ResultsCount>
            
            {!loading && results.length > 0 && (
              <FilterControls>
                <Filter size={14} />
                
                <FilterButton
                  active={severityFilter === 'all'}
                  onClick={() => setSeverityFilter('all')}
                  whileTap={{ scale: 0.95 }}
                >
                  All ({results.length})
                </FilterButton>
                
                <SeverityFilters>
                  {Object.entries(severityStats).map(([severity, count]) => (
                    count > 0 && (
                      <FilterButton
                        key={severity}
                        active={severityFilter === severity}
                        onClick={() => setSeverityFilter(severity)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SeverityBadge severity={severity} showIcon={false} />
                        ({count})
                      </FilterButton>
                    )
                  ))}
                </SeverityFilters>
              </FilterControls>
            )}
          </LeftControls>
          
          <RightControls>
            <ActionButton
              onClick={handleRefresh}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={14} />
              Refresh
            </ActionButton>
            
            {results.length > 0 && (
              <ActionButton
                onClick={handleExport}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={14} />
                Export CSV
              </ActionButton>
            )}
            
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 size={14} />
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                whileTap={{ scale: 0.95 }}
              >
                <ListIcon size={14} />
              </ViewButton>
            </ViewToggle>
          </RightControls>
        </ControlsSection>

        {!loading && results.length > 0 && (
          <FilterControls style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sort by:</span>
            
            <FilterButton
              active={sortBy === 'publishedDate'}
              onClick={() => setSortBy('publishedDate')}
              whileTap={{ scale: 0.95 }}
            >
              Date
            </FilterButton>
            
            <FilterButton
              active={sortBy === 'severity'}
              onClick={() => setSortBy('severity')}
              whileTap={{ scale: 0.95 }}
            >
              Severity
            </FilterButton>
            
            <FilterButton
              active={sortBy === 'id'}
              onClick={() => setSortBy('id')}
              whileTap={{ scale: 0.95 }}
            >
              CVE ID
            </FilterButton>
            
            <FilterButton
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              whileTap={{ scale: 0.95 }}
            >
              {sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
            </FilterButton>
          </FilterControls>
        )}

        <ResultsContainer>
          <AnimatePresence mode="wait">
            {loading ? (
              <SkeletonGrid key="loading" count={getSkeletonCount()} />
            ) : error ? (
              <ErrorState
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyIcon>
                  <AlertTriangle size={24} />
                </EmptyIcon>
                <h3>Failed to Load CVEs</h3>
                <p>{error}</p>
                <ActionButton onClick={handleRefresh} style={{ marginTop: '1rem' }}>
                  <RefreshCw size={14} />
                  Try Again
                </ActionButton>
              </ErrorState>
            ) : filteredAndSortedResults.length === 0 ? (
              <EmptyState
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyIcon>
                  <Database size={24} />
                </EmptyIcon>
                <h3>No CVEs Found</h3>
                <p>
                  {results.length === 0 
                    ? 'No CVEs are currently available in the database'
                    : 'No CVEs match the current filters'
                  }
                </p>
                {results.length > 0 && (
                  <ActionButton 
                    onClick={() => setSeverityFilter('all')}
                    style={{ marginTop: '1rem' }}
                  >
                    Clear Filters
                  </ActionButton>
                )}
              </EmptyState>
            ) : (
              <ResultsGrid key="results" viewMode={viewMode}>
                {filteredAndSortedResults.map((cve, index) => (
                  <motion.div
                    key={cve.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <CveCard
                      cve={cve}
                      showAnalyzeButton={false}
                    />
                  </motion.div>
                ))}
              </ResultsGrid>
            )}
          </AnimatePresence>
        </ResultsContainer>
      </ContentSection>
      
      <Footer />
    </PageContainer>
  );
}