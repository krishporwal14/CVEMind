// Light theme colors (VSCode Light+ Theme)
export const lightTheme = {
  colors: {
    background: "#FFFFFF",
    backgroundGradient: "linear-gradient(135deg, #FFFFFF 0%, #F6F8FA 100%)",
    surface: "#F6F8FA",
    surfaceSecondary: "#FFFFFF",
    surfaceHover: "#F3F4F6",
    accent: "#0969DA",
    accentHover: "#0550AE",
    accentLight: "#DDF4FF",
    text: "#24292F",
    textSecondary: "#656D76",
    textMuted: "#8B949E",
    border: "#D0D7DE",
    borderLight: "#E1E7ED",
    success: "#1A7F37",
    warning: "#D1242F",
    danger: "#CF222E",
    dangerHover: "#A40E26",
    info: "#0969DA",
    
    // Severity colors
    critical: "#CF222E",
    high: "#FB8500",
    medium: "#D1242F", 
    low: "#1A7F37",
    unknown: "#8B949E",
  },
  fonts: {
    main: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
    mono: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(31 35 40 / 0.08)",
    md: "0 3px 6px 0 rgb(31 35 40 / 0.12)",
    lg: "0 8px 24px 0 rgb(31 35 40 / 0.12)",
    xl: "0 12px 28px 0 rgb(31 35 40 / 0.15)",
  },
  borderRadius: {
    sm: "0.125rem",
    md: "0.25rem",
    lg: "0.375rem", 
    xl: "0.5rem",
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
    fast: "0.1s ease-in-out",
    normal: "0.2s ease-in-out",
    slow: "0.3s ease-in-out",
  }
};

// Dark theme colors (VSCode Dark+ Theme)
export const darkTheme = {
  colors: {
    background: "#0D1117",
    backgroundGradient: "linear-gradient(135deg, #0D1117 0%, #161B22 100%)",
    surface: "#161B22",
    surfaceSecondary: "#21262D",
    surfaceHover: "#30363D",
    accent: "#58A6FF",
    accentHover: "#1F6FEB",
    accentLight: "#1A4480",
    text: "#F0F6FC",
    textSecondary: "#7D8590",
    textMuted: "#484F58",
    border: "#30363D",
    borderLight: "#21262D",
    success: "#238636",
    warning: "#D29922",
    danger: "#F85149",
    dangerHover: "#EC6A5E",
    info: "#58A6FF",
    
    // Severity colors (VSCode inspired)
    critical: "#F85149",
    high: "#FF8E00",
    medium: "#D29922",
    low: "#238636",
    unknown: "#7D8590",
  },
  fonts: {
    main: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
    mono: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
  },
  shadows: {
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.5)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.6), 0 2px 4px -2px rgb(0 0 0 / 0.6)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.7), 0 4px 6px -4px rgb(0 0 0 / 0.7)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.8), 0 8px 10px -6px rgb(0 0 0 / 0.8)",
  },
  borderRadius: {
    sm: "0.125rem",
    md: "0.25rem",
    lg: "0.375rem", 
    xl: "0.5rem",
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
    fast: "0.1s ease-in-out",
    normal: "0.2s ease-in-out", 
    slow: "0.3s ease-in-out",
  }
};

// Legacy theme for backward compatibility
export const theme = darkTheme;
