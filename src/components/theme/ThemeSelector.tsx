
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from './ThemeProvider';
import { Palette } from 'lucide-react';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'default' as const,
      name: 'Default',
      colors: ['#ffffff', '#000000', '#f1f5f9', '#64748b'],
    },
    {
      id: 'sunset' as const,
      name: 'Sunset Orange',
      colors: ['#fff7ed', '#fb923c', '#fed7aa', '#fdba74'],
    },
    {
      id: 'ocean' as const,
      name: 'Ocean Blue',
      colors: ['#f0f9ff', '#0ea5e9', '#bae6fd', '#7dd3fc'],
    },
    {
      id: 'forest' as const,
      name: 'Forest Green',
      colors: ['#f0fdf4', '#16a34a', '#bbf7d0', '#86efac'],
    },
  ];

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <div className="flex items-center space-x-3">
      <Palette className="h-5 w-5 text-muted-foreground" />
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-48">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {currentTheme?.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{currentTheme?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {themes.map((themeOption) => (
            <SelectItem key={themeOption.id} value={themeOption.id}>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {themeOption.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span>{themeOption.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
