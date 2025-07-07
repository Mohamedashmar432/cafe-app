
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { Palette } from 'lucide-react';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'default' as const,
      name: 'Default',
      description: 'Clean and minimal',
      colors: ['#ffffff', '#000000', '#f1f5f9', '#64748b'],
    },
    {
      id: 'sunset' as const,
      name: 'Sunset Orange',
      description: 'Warm and energetic',
      colors: ['#fff7ed', '#fb923c', '#fed7aa', '#fdba74'],
    },
    {
      id: 'ocean' as const,
      name: 'Ocean Blue',
      description: 'Cool and calming',
      colors: ['#f0f9ff', '#0ea5e9', '#bae6fd', '#7dd3fc'],
    },
    {
      id: 'forest' as const,
      name: 'Forest Green',
      description: 'Natural and fresh',
      colors: ['#f0fdf4', '#16a34a', '#bbf7d0', '#86efac'],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Theme Selector</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((themeOption) => (
            <div
              key={themeOption.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                theme === themeOption.id
                  ? 'border-primary bg-accent'
                  : 'border-muted hover:border-muted-foreground'
              }`}
              onClick={() => setTheme(themeOption.id)}
            >
              <div className="space-y-3">
                <div className="flex space-x-1">
                  {themeOption.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <div>
                  <h3 className="font-semibold">{themeOption.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {themeOption.description}
                  </p>
                </div>
                
                {theme === themeOption.id && (
                  <div className="text-sm text-primary font-medium">
                    ✓ Active
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Select a theme to change the appearance of your cafe dashboard
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
