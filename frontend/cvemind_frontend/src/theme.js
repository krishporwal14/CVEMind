// Light theme colors (VS Code Light)
export const lightTheme = {
  colors: {
    background: "#FFFFFF",
    backgroundGradient: "linear-gradient(135deg, #FFFFFF 0%, #F3F3F3 100%)",
    surface: "#FFFFFF",
    surfaceSecondary: "#F3F3F3",
    surfaceHover: "#E8E8E8",
    accent: "#007ACC",
    accentHover: "#005A9E",
    accentLight: "#CCE7FF",
    text: "#1E1E1E",
    textSecondary: "#2a2a2aff",
    textMuted: "#858585",
    border: "#E0E0E0",
    borderLight: "#F0F0F0",
    success: "#16A085",
    warning: "#F39C12",
    danger: "#E74C3C",
    dangerHover: "#C0392B",
    info: "#007ACC",
    
    // Severity colors
    critical: "#E74C3C",
    high: "#E67E22",
    medium: "#F39C12", 
    low: "#16A085",
    unknown: "#95A5A6",
  },
  fonts: {
    main: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem", 
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.25s ease-in-out",
    slow: "0.4s ease-in-out",
  }
};

// Dark theme colors (VS Code Dark)
export const darkTheme = {
  colors: {
    background: "#1E1E1E",
    backgroundGradient: "linear-gradient(135deg, #1E1E1E 0%, #252526 100%)",
    surface: "#252526",
    surfaceSecondary: "#2D2D30",
    surfaceHover: "#37373D",
    accent: "#007ACC",
    accentHover: "#1177BB",
    accentLight: "#1E3A8A",
    text: "#CCCCCC",
    textSecondary: "#9D9D9D",
    textMuted: "#6A6A6A",
    border: "#3C3C3C",
    borderLight: "#484848",
    success: "#16A085",
    warning: "#F39C12",
    danger: "#E74C3C",
    dangerHover: "#EC7063",
    info: "#007ACC",
    
    // Severity colors
    critical: "#E74C3C",
    high: "#E67E22",
    medium: "#F39C12",
    low: "#16A085",
    unknown: "#95A5A6",
  },
  fonts: {
    main: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.25)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem", 
    xl: "0.75rem",
    full: "9999px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.25s ease-in-out", 
    slow: "0.4s ease-in-out",
  }
};

// Legacy theme for backward compatibility
export const theme = darkTheme;
