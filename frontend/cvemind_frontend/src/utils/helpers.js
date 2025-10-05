/**
 * Get severity color based on severity level
 */
export const getSeverityColor = (severity, theme) => {
  if (!severity) return theme.colors.unknown;
  
  const severityLower = severity.toLowerCase();
  
  switch (severityLower) {
    case 'critical':
      return theme.colors.critical;
    case 'high':
      return theme.colors.high;
    case 'medium':
    case 'moderate':
      return theme.colors.medium;
    case 'low':
      return theme.colors.low;
    default:
      return theme.colors.unknown;
  }
};

/**
 * Get severity badge variant
 */
export const getSeverityVariant = (severity) => {
  if (!severity) return 'unknown';
  
  const severityLower = severity.toLowerCase();
  
  switch (severityLower) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
    case 'moderate':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'unknown';
  }
};

/**
 * Format date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Extract CVE ID from various formats
 */
export const extractCveId = (input) => {
  if (!input) return null;
  
  // Match CVE-YYYY-NNNNN format
  const cveMatch = input.match(/CVE-\d{4}-\d{4,}/i);
  return cveMatch ? cveMatch[0].toUpperCase() : null;
};

/**
 * Generate loading skeleton count based on screen size
 */
export const getSkeletonCount = () => {
  const width = window.innerWidth;
  if (width < 768) return 3; // Mobile
  if (width < 1024) return 6; // Tablet
  return 9; // Desktop
};

/**
 * Debounce function for search
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};