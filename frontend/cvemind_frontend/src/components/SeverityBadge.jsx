import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getSeverityColor, getSeverityVariant } from '../utils/helpers';

const BadgeContainer = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
  
  background-color: ${({ theme, variant }) => {
    const color = getSeverityColor(variant, theme);
    return `${color}20`; // 20% opacity
  }};
  
  color: ${({ theme, variant }) => getSeverityColor(variant, theme)};
  
  border: 1px solid ${({ theme, variant }) => {
    const color = getSeverityColor(variant, theme);
    return `${color}40`; // 40% opacity
  }};
  
  &:hover {
    background-color: ${({ theme, variant }) => {
      const color = getSeverityColor(variant, theme);
      return `${color}30`; // 30% opacity on hover
    }};
  }
`;

const SeverityIcon = styled.span`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ theme, variant }) => getSeverityColor(variant, theme)};
  margin-right: 0.375rem;
`;

const SeverityBadge = ({ 
  severity, 
  showIcon = true, 
  className,
  ...props 
}) => {
  const variant = getSeverityVariant(severity);
  const displayText = severity || 'Unknown';

  return (
    <BadgeContainer
      variant={variant}
      className={className}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {showIcon && <SeverityIcon variant={variant} />}
      {displayText}
    </BadgeContainer>
  );
};

export default SeverityBadge;