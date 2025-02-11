export const theme = {
  colors: {
    brand: {
      primary: {
        DEFAULT: '#004D40', // Dark green
        light: '#00695C',
        dark: '#003D33',
      },
      secondary: {
        DEFAULT: '#D4B982', // Gold/beige
        light: '#E5D4AD',
        dark: '#B69B62',
      },
    },
    // Semantic colors that map to our brand colors
    semantic: {
      active: 'var(--brand-primary)', // For active states, links
      loading: 'var(--brand-primary)', // For spinners, progress bars
      hover: 'var(--brand-primary-light)', // For hover states
      focus: 'var(--brand-primary-dark)', // For focus states
      success: '#10B981', // Keep some utility colors
      error: '#EF4444',
      warning: '#F59E0B',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9F9F9',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    }
  }
}; 