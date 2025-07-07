
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'sunset' | 'ocean' | 'forest' | 'default';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('cafeTheme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cafeTheme', theme);
    
    // Apply theme to document root
    const root = document.documentElement;
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${theme}`);
    
    // Apply theme-specific CSS variables
    switch (theme) {
      case 'sunset':
        root.style.setProperty('--background', '14 100% 96%'); // Warm cream
        root.style.setProperty('--primary', '24 100% 50%'); // Orange
        root.style.setProperty('--accent', '45 100% 90%'); // Light yellow
        root.style.setProperty('--muted', '39 100% 95%'); // Peach
        break;
      case 'ocean':
        root.style.setProperty('--background', '210 100% 97%'); // Light blue
        root.style.setProperty('--primary', '200 100% 40%'); // Ocean blue
        root.style.setProperty('--accent', '220 100% 95%'); // Sky blue
        root.style.setProperty('--muted', '210 100% 92%'); // Pale blue
        break;
      case 'forest':
        root.style.setProperty('--background', '120 25% 96%'); // Light green
        root.style.setProperty('--primary', '140 60% 35%'); // Forest green
        root.style.setProperty('--accent', '120 50% 90%'); // Mint green
        root.style.setProperty('--muted', '120 30% 92%'); // Pale green
        break;
      default:
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--primary', '222.2 47.4% 11.2%');
        root.style.setProperty('--accent', '210 40% 96.1%');
        root.style.setProperty('--muted', '210 40% 96.1%');
        break;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
