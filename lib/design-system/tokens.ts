// AgreeConnect Enterprise Design System - Design Tokens
// Foundation for all 300+ components across 8 products

export const designTokens = {
  // COLORS - Premium Palette (3-5 colors as per guidelines)
  colors: {
    // Primary: Agricultural Green
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e", // Main primary
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#145231",
    },
    // Secondary: Sky Blue
    secondary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9", // Main secondary
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c3d66",
    },
    // Accent: Warm Orange (Energy)
    accent: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316", // Main accent
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    // Neutrals
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    // Semantic
    success: "#16a34a",
    warning: "#f97316",
    error: "#dc2626",
    info: "#0284c7",
  },

  // TYPOGRAPHY
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      serif: 'ui-serif, Georgia, Palatino, "Palatino Linotype", "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", Courier, monospace',
    },
    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
      "4xl": ["36px", { lineHeight: "44px" }],
      "5xl": ["48px", { lineHeight: "56px" }],
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },

  // SPACING - 8px base unit
  spacing: {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    9: "36px",
    10: "40px",
    12: "48px",
    14: "56px",
    16: "64px",
    20: "80px",
    24: "96px",
  },

  // BORDER RADIUS
  borderRadius: {
    none: "0",
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "24px",
    full: "9999px",
  },

  // SHADOWS - Glassmorphic style
  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    glow: "0 0 20px rgba(34, 197, 94, 0.3)",
  },

  // Z-INDEX SCALE
  zIndex: {
    hide: "-1",
    base: "0",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    backdrop: "1040",
    offcanvas: "1050",
    modal: "1060",
    popover: "1070",
    tooltip: "1080",
  },

  // BREAKPOINTS
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // TRANSITIONS & ANIMATIONS
  transitions: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },

  // OPACITY
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    20: "0.2",
    25: "0.25",
    30: "0.3",
    40: "0.4",
    50: "0.5",
    60: "0.6",
    70: "0.7",
    75: "0.75",
    80: "0.8",
    90: "0.9",
    95: "0.95",
    100: "1",
  },

  // ASPECT RATIOS
  aspectRatio: {
    auto: "auto",
    square: "1 / 1",
    video: "16 / 9",
    "4/3": "4 / 3",
    "21/9": "21 / 9",
  },
};

// THEME CONFIGURATION
export const themeConfig = {
  lightMode: {
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#171717",
    textSecondary: "#525252",
    border: "#e5e5e5",
  },
  darkMode: {
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    border: "#334155",
  },
};

// COMPONENT SIZING
export const componentSizes = {
  button: {
    xs: { padding: "4px 8px", fontSize: "12px" },
    sm: { padding: "6px 12px", fontSize: "14px" },
    md: { padding: "8px 16px", fontSize: "16px" },
    lg: { padding: "12px 24px", fontSize: "16px" },
    xl: { padding: "16px 32px", fontSize: "18px" },
  },
  input: {
    sm: { padding: "6px 12px", fontSize: "14px", minHeight: "32px" },
    md: { padding: "8px 12px", fontSize: "16px", minHeight: "40px" },
    lg: { padding: "12px 16px", fontSize: "16px", minHeight: "48px" },
  },
  badge: {
    sm: { padding: "2px 8px", fontSize: "12px" },
    md: { padding: "4px 12px", fontSize: "14px" },
    lg: { padding: "6px 16px", fontSize: "16px" },
  },
  avatar: {
    xs: "24px",
    sm: "32px",
    md: "40px",
    lg: "56px",
    xl: "72px",
  },
};

// INTERACTION STATES
export const interactionStates = {
  hover: { opacity: 0.8, transform: "translateY(-1px)" },
  active: { opacity: 0.9, transform: "translateY(0px)" },
  disabled: { opacity: 0.5, cursor: "not-allowed" },
  focus: { outline: "2px solid", outlineOffset: "2px" },
};
