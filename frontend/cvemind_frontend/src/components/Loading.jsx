import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Spinner = styled.div`
  width: ${({ size }) => size || '2rem'};
  height: ${({ size }) => size || '2rem'};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
  animation: ${pulse} 2s infinite;
`;

const SkeletonItem = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.border} 25%,
    ${({ theme }) => theme.colors.borderLight} 50%,
    ${({ theme }) => theme.colors.border} 75%
  );
  background-size: 200% 100%;
  animation: ${keyframes`
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  `} 1.5s infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: ${({ height }) => height || '1rem'};
  width: ${({ width }) => width || '100%'};
`;

const SkeletonCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Basic Loading Spinner
export const Loading = ({ text = "Loading...", size }) => (
  <LoadingContainer>
    <Spinner size={size} />
    <LoadingText>{text}</LoadingText>
  </LoadingContainer>
);

// Skeleton for text content
export const SkeletonText = ({ width, height }) => (
  <SkeletonItem width={width} height={height} />
);

// Skeleton for CVE cards
export const SkeletonCveCard = () => (
  <SkeletonCard
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <SkeletonText width="60%" height="1.5rem" />
      <SkeletonText width="4rem" height="1.25rem" />
    </div>
    <SkeletonText width="100%" height="1rem" />
    <SkeletonText width="80%" height="1rem" />
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
      <SkeletonText width="3rem" height="0.875rem" />
      <SkeletonText width="4rem" height="0.875rem" />
    </div>
  </SkeletonCard>
);

// Skeleton for grid layout
export const SkeletonGrid = ({ count = 6 }) => (
  <div style={{ 
    display: 'grid', 
    gap: '1rem', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' 
  }}>
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCveCard key={index} />
    ))}
  </div>
);

// Loading overlay
export const LoadingOverlay = ({ isVisible, children }) => {
  if (!isVisible) return children;
  
  return (
    <div style={{ position: 'relative' }}>
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(2px)',
          borderRadius: '0.5rem',
        }}
      >
        <Loading text="Processing..." />
      </motion.div>
    </div>
  );
};