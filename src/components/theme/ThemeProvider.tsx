
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
    
    // Apply theme-specific CSS variables and background gradients
    switch (theme) {
      case 'sunset':
        root.style.setProperty('--background', '14 100% 96%');
        root.style.setProperty('--foreground', '20 14.3% 4.1%');
        root.style.setProperty('--primary', '24 100% 50%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--secondary', '39 100% 95%');
        root.style.setProperty('--secondary-foreground', '24 45% 15%');
        root.style.setProperty('--accent', '45 100% 90%');
        root.style.setProperty('--accent-foreground', '24 45% 15%');
        root.style.setProperty('--muted', '39 100% 95%');
        root.style.setProperty('--muted-foreground', '25 5.3% 44.7%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '20 14.3% 4.1%');
        root.style.setProperty('--border', '20 5.9% 90%');
        root.style.setProperty('--input', '20 5.9% 90%');
        document.body.style.background = 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%)';
        break;
      case 'ocean':
        root.style.setProperty('--background', '210 100% 97%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '200 100% 40%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--secondary', '220 100% 95%');
        root.style.setProperty('--secondary-foreground', '200 50% 15%');
        root.style.setProperty('--accent', '220 100% 95%');
        root.style.setProperty('--accent-foreground', '200 50% 15%');
        root.style.setProperty('--muted', '210 100% 92%');
        root.style.setProperty('--muted-foreground', '200 5.3% 44.7%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
        root.style.setProperty('--border', '210 40% 80%');
        root.style.setProperty('--input', '210 40% 80%');
        document.body.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #0ea5e9 100%)';
        break;
      case 'forest':
        root.style.setProperty('--background', '120 25% 96%');
        root.style.setProperty('--foreground', '140 100% 10%');
        root.style.setProperty('--primary', '140 60% 35%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--secondary', '120 50% 90%');
        root.style.setProperty('--secondary-foreground', '140 50% 15%');
        root.style.setProperty('--accent', '120 50% 90%');
        root.style.setProperty('--accent-foreground', '140 50% 15%');
        root.style.setProperty('--muted', '120 30% 92%');
        root.style.setProperty('--muted-foreground', '120 5.3% 44.7%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '140 100% 10%');
        root.style.setProperty('--border', '120 20% 80%');
        root.style.setProperty('--input', '120 20% 80%');
        document.body.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 50%, #16a34a 100%)';
        break;
      default:
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '222.2 47.4% 11.2%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        root.style.setProperty('--secondary', '210 40% 96.1%');
        root.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
        root.style.setProperty('--accent', '210 40% 96.1%');
        root.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
        root.style.setProperty('--muted', '210 40% 96.1%');
        root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
        root.style.setProperty('--border', '214.3 31.8% 91.4%');
        root.style.setProperty('--input', '214.3 31.8% 91.4%');
        document.body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)';
        break;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme} min-h-screen transition-all duration-500`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
