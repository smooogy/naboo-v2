'use client';

import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, RefreshIcon } from '@hugeicons/core-free-icons';

interface ColorVariable {
  name: string;
  cssVar: string;
  defaultValue: string;
  currentValue: string;
}

const defaultColors: ColorVariable[] = [
  { name: 'Primary', cssVar: '--primary', defaultValue: '#D3D676', currentValue: '#D3D676' },
  { name: 'Primary Foreground', cssVar: '--primary-foreground', defaultValue: '#212724', currentValue: '#212724' },
  { name: 'Background', cssVar: '--background', defaultValue: '#fdfdfd', currentValue: '#fdfdfd' },
  { name: 'Foreground', cssVar: '--foreground', defaultValue: '#212724', currentValue: '#212724' },
  { name: 'Border', cssVar: '--border', defaultValue: '#e0e0e0', currentValue: '#e0e0e0' },
  { name: 'Ring', cssVar: '--ring', defaultValue: '#D3D676', currentValue: '#D3D676' },
];

interface ColorPaletteExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  heroVariant?: 'gradient' | 'video';
  onHeroVariantChange?: (variant: 'gradient' | 'video') => void;
}

type FontOption = 'Google Sans' | 'Aeonik' | 'TWK Lausanne';
type LetterSpacingOption = '0%' | '-1%' | '-2%';

const fontOptions: { label: string; value: FontOption; fontFamily: string }[] = [
  { label: 'Google Sans', value: 'Google Sans', fontFamily: "'Google Sans', system-ui, sans-serif" },
  { label: 'Aeonik Medium', value: 'Aeonik', fontFamily: "'Aeonik Medium', 'Aeonik', system-ui, sans-serif" },
  { label: 'TWK Lausanne', value: 'TWK Lausanne', fontFamily: "'TWK Lausanne', system-ui, sans-serif" },
];

const letterSpacingOptions: { label: string; value: LetterSpacingOption; cssValue: string }[] = [
  { label: '0%', value: '0%', cssValue: '0' },
  { label: '-1%', value: '-1%', cssValue: '-0.01em' },
  { label: '-2%', value: '-2%', cssValue: '-0.02em' },
];

export function ColorPaletteExplorer({ isOpen, onClose, heroVariant, onHeroVariantChange }: ColorPaletteExplorerProps) {
  const [colors, setColors] = useState<ColorVariable[]>(defaultColors);
  const [customColors, setCustomColors] = useState<{ name: string; value: string }[]>([
    { name: 'Grey', value: '#737876' },
    { name: 'Grey Light', value: '#f1f1f1' },
    { name: 'Info', value: '#3452bd' },
    { name: 'Black', value: '#212724' },
  ]);
  const [selectedFont, setSelectedFont] = useState<FontOption>('Google Sans');
  const [selectedLetterSpacing, setSelectedLetterSpacing] = useState<LetterSpacingOption>('-1%');

  // Initialize colors from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colorPaletteSettings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          
          // Restore colors
          if (settings.colors) {
            setColors(prev => prev.map(color => {
              const savedValue = settings.colors[color.cssVar];
              if (savedValue) {
                document.documentElement.style.setProperty(color.cssVar, savedValue);
                return { ...color, currentValue: savedValue };
              }
              return color;
            }));
          }
          
          // Restore custom colors
          if (settings.customColors) {
            const colorMappings: Record<string, string> = {
              'Grey': '--color-grey',
              'Grey Light': '--color-grey-light',
              'Info': '--color-info',
              'Black': '--color-black',
            };
            const newCustomColors = customColors.map(c => {
              const savedValue = settings.customColors[c.name];
              if (savedValue) {
                const cssVar = colorMappings[c.name];
                if (cssVar) {
                  document.documentElement.style.setProperty(cssVar, savedValue);
                }
                return { ...c, value: savedValue };
              }
              return c;
            });
            setCustomColors(newCustomColors);
          }
          
          // Restore font
          if (settings.font) {
            setSelectedFont(settings.font);
            const fontConfig = fontOptions.find(f => f.value === settings.font);
            if (fontConfig) {
              document.documentElement.style.setProperty('--font-sans', fontConfig.fontFamily);
              document.documentElement.style.setProperty('--font-weight-bold', settings.font === 'Aeonik' ? '500' : '600');
            }
          }
          
          // Restore letter spacing
          if (settings.letterSpacing) {
            setSelectedLetterSpacing(settings.letterSpacing);
            const spacingConfig = letterSpacingOptions.find(s => s.value === settings.letterSpacing);
            if (spacingConfig) {
              document.documentElement.style.setProperty('--letter-spacing', spacingConfig.cssValue);
            }
          }
        } catch (e) {
          console.error('Failed to parse color palette settings:', e);
        }
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = (
    updatedColors?: ColorVariable[],
    updatedCustomColors?: { name: string; value: string }[],
    updatedFont?: FontOption,
    updatedLetterSpacing?: LetterSpacingOption
  ) => {
    if (typeof window !== 'undefined') {
      const settings = {
        colors: (updatedColors || colors).reduce((acc, c) => ({ ...acc, [c.cssVar]: c.currentValue }), {}),
        customColors: (updatedCustomColors || customColors).reduce((acc, c) => ({ ...acc, [c.name]: c.value }), {}),
        font: updatedFont || selectedFont,
        letterSpacing: updatedLetterSpacing || selectedLetterSpacing,
      };
      localStorage.setItem('colorPaletteSettings', JSON.stringify(settings));
    }
  };

  const updateCssVariable = (cssVar: string, value: string) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(cssVar, value);
    }
    
    const newColors = colors.map(color => 
      color.cssVar === cssVar ? { ...color, currentValue: value } : color
    );
    setColors(newColors);
    saveSettings(newColors);
  };

  // Update multiple CSS variables at once (for presets)
  const applyPreset = (updates: Record<string, string>) => {
    if (typeof window !== 'undefined') {
      Object.entries(updates).forEach(([cssVar, value]) => {
        document.documentElement.style.setProperty(cssVar, value);
      });
    }
    
    const newColors = colors.map(color => 
      updates[color.cssVar] ? { ...color, currentValue: updates[color.cssVar] } : color
    );
    setColors(newColors);
    saveSettings(newColors);
  };

  const updateCustomColor = (index: number, value: string) => {
    const newCustomColors = [...customColors];
    newCustomColors[index].value = value;
    setCustomColors(newCustomColors);

    // Update the corresponding Tailwind classes by modifying CSS variables
    // These map to the tailwind.config.ts colors
    const colorMappings: Record<string, string> = {
      'Grey': '--color-grey',
      'Grey Light': '--color-grey-light',
      'Info': '--color-info',
      'Black': '--color-black',
    };

    const cssVar = colorMappings[newCustomColors[index].name];
    if (cssVar && typeof window !== 'undefined') {
      document.documentElement.style.setProperty(cssVar, value);
    }
    saveSettings(undefined, newCustomColors);
  };

  const updateFont = (font: FontOption) => {
    setSelectedFont(font);
    const fontConfig = fontOptions.find(f => f.value === font);
    if (fontConfig && typeof window !== 'undefined') {
      // Update the CSS variable - all elements use var(--font-sans) so this applies globally
      document.documentElement.style.setProperty('--font-sans', fontConfig.fontFamily);
      
      // For Aeonik, set bold weight to medium (500) instead of bold (700)
      if (font === 'Aeonik') {
        document.documentElement.style.setProperty('--font-weight-bold', '500');
      } else {
        document.documentElement.style.setProperty('--font-weight-bold', '600');
      }
    }
    saveSettings(undefined, undefined, font);
  };

  const updateLetterSpacing = (spacing: LetterSpacingOption) => {
    setSelectedLetterSpacing(spacing);
    const spacingConfig = letterSpacingOptions.find(s => s.value === spacing);
    if (spacingConfig && typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--letter-spacing', spacingConfig.cssValue);
    }
    saveSettings(undefined, undefined, undefined, spacing);
  };

  const resetAllColors = () => {
    if (typeof window !== 'undefined') {
      // Reset CSS variable colors
      colors.forEach(color => {
        document.documentElement.style.setProperty(color.cssVar, color.defaultValue);
      });
      
      // Reset custom colors
      document.documentElement.style.removeProperty('--color-grey');
      document.documentElement.style.removeProperty('--color-grey-light');
      document.documentElement.style.removeProperty('--color-info');
      document.documentElement.style.removeProperty('--color-black');
      
      // Reset font to default
      document.documentElement.style.setProperty('--font-sans', "'Google Sans', system-ui, sans-serif");
      
      // Reset letter spacing to default -1%
      document.documentElement.style.setProperty('--letter-spacing', '-0.01em');
      
      // Reset font weight for bold
      document.documentElement.style.setProperty('--font-weight-bold', '600');
      
      // Clear localStorage
      localStorage.removeItem('colorPaletteSettings');
    }
    
    setColors(defaultColors);
    setCustomColors([
      { name: 'Grey', value: '#737876' },
      { name: 'Grey Light', value: '#f1f1f1' },
      { name: 'Info', value: '#3452bd' },
      { name: 'Black', value: '#212724' },
    ]);
    setSelectedFont('Google Sans');
    setSelectedLetterSpacing('-1%');
  };

  const copyColorsToClipboard = () => {
    const colorConfig = {
      font: selectedFont,
      letterSpacing: selectedLetterSpacing,
      cssVariables: colors.reduce((acc, c) => ({ ...acc, [c.cssVar]: c.currentValue }), {}),
      customColors: customColors.reduce((acc, c) => ({ ...acc, [c.name]: c.value }), {}),
    };
    navigator.clipboard.writeText(JSON.stringify(colorConfig, null, 2));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-20 right-8 w-[320px] bg-white rounded-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)] border border-border z-[9999] overflow-hidden"
      style={{ animation: 'slideIn 0.2s ease-out' }}
    >
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-grey-lighterGrey">
        <h3 className="font-sans font-medium text-[14px] text-black">
          Color Palette Explorer
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAllColors}
            className="p-1.5 hover:bg-grey-light rounded transition-colors"
            title="Reset all colors"
          >
            <HugeiconsIcon icon={RefreshIcon} size={16} className="text-grey" strokeWidth={1.5} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-grey-light rounded transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} className="text-grey" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {/* Font Section */}
        <div className="mb-4">
          <p className="font-sans font-medium text-[12px] text-grey uppercase tracking-wider mb-3">
            Font Family
          </p>
          <div className="flex flex-col gap-2">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => updateFont(font.value)}
                className={`flex items-center justify-between px-3 py-2 rounded border transition-colors ${
                  selectedFont === font.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-grey-lighterGrey'
                }`}
              >
                <span 
                  className="font-medium text-[14px] text-black"
                  style={{ fontFamily: font.fontFamily }}
                >
                  {font.label}
                </span>
                {selectedFont === font.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Letter Spacing Section */}
        <div className="mt-4">
          <p className="font-sans font-medium text-[12px] text-grey uppercase tracking-wider mb-3">
            Letter Spacing
          </p>
          <div className="flex gap-2">
            {letterSpacingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateLetterSpacing(option.value)}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded border transition-colors ${
                  selectedLetterSpacing === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-grey-lighterGrey'
                }`}
              >
                <span className="font-medium text-[13px] text-black">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Variant Section - Only show if callback is provided */}
        {onHeroVariantChange && (
          <div className="mt-4">
            <p className="font-sans font-medium text-[12px] text-grey uppercase tracking-wider mb-3">
              Hero Background
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onHeroVariantChange('gradient')}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded border transition-colors ${
                  heroVariant === 'gradient'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-grey-lighterGrey'
                }`}
              >
                <span className="font-medium text-[13px] text-black">
                  Gradient
                </span>
              </button>
              <button
                onClick={() => onHeroVariantChange('video')}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded border transition-colors ${
                  heroVariant === 'video'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-grey-lighterGrey'
                }`}
              >
                <span className="font-medium text-[13px] text-black">
                  Video
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* CSS Variables Section */}
        <div className="mb-4">
          <p className="font-sans font-medium text-[12px] text-grey uppercase tracking-wider mb-3">
            CSS Variables
          </p>
          <div className="flex flex-col gap-3">
            {colors.map((color) => (
              <div key={color.cssVar} className="flex items-center justify-between gap-3">
                <label className="font-sans text-[13px] text-black flex-1">
                  {color.name}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.currentValue}
                    onChange={(e) => updateCssVariable(color.cssVar, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                    style={{ padding: 0 }}
                  />
                  <input
                    type="text"
                    value={color.currentValue}
                    onChange={(e) => updateCssVariable(color.cssVar, e.target.value)}
                    className="w-[80px] h-8 px-2 text-[12px] font-mono border border-border rounded bg-white text-black"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Custom Colors Section */}
        <div className="mb-4">
          <p className="font-sans font-medium text-[12px] text-grey uppercase tracking-wider mb-3">
            Tailwind Colors
          </p>
          <div className="flex flex-col gap-3">
            {customColors.map((color, index) => (
              <div key={color.name} className="flex items-center justify-between gap-3">
                <label className="font-sans text-[13px] text-black flex-1">
                  {color.name}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) => updateCustomColor(index, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                    style={{ padding: 0 }}
                  />
                  <input
                    type="text"
                    value={color.value}
                    onChange={(e) => updateCustomColor(index, e.target.value)}
                    className="w-[80px] h-8 px-2 text-[12px] font-mono border border-border rounded bg-white text-black"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Quick Presets */}
        <div>
          <p className="font-sans font-medium text-[12px] text-grey uppercase tracking-wider mb-3">
            Quick Presets
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset({ '--primary': '#D3D676', '--primary-foreground': '#212724' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#D3D676] text-black rounded hover:opacity-90 transition-opacity"
            >
              Yellow (Default)
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#d2d65c', '--primary-foreground': '#212724' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#d2d65c] text-black rounded hover:opacity-90 transition-opacity"
            >
              Lime
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#F4D686', '--primary-foreground': '#212724' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#F4D686] text-black rounded hover:opacity-90 transition-opacity"
            >
              Gold
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#F0D58A', '--primary-foreground': '#212724' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#F0D58A] text-black rounded hover:opacity-90 transition-opacity"
            >
              Sand
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#C6E278', '--primary-foreground': '#212724' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#C6E278] text-black rounded hover:opacity-90 transition-opacity"
            >
              Spring
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#2d7255', '--primary-foreground': '#ffffff' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#2d7255] text-white rounded hover:opacity-90 transition-opacity"
            >
              Green
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#3452bd', '--primary-foreground': '#ffffff' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#3452bd] text-white rounded hover:opacity-90 transition-opacity"
            >
              Blue
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#e11d48', '--primary-foreground': '#ffffff' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#e11d48] text-white rounded hover:opacity-90 transition-opacity"
            >
              Red
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#7c3aed', '--primary-foreground': '#ffffff' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#7c3aed] text-white rounded hover:opacity-90 transition-opacity"
            >
              Purple
            </button>
            <button
              onClick={() => applyPreset({ '--primary': '#212724', '--primary-foreground': '#ffffff' })}
              className="px-3 py-1.5 text-[12px] font-sans font-medium bg-[#212724] text-white rounded hover:opacity-90 transition-opacity"
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border bg-grey-lighterGrey">
        <button
          onClick={copyColorsToClipboard}
          className="w-full h-9 bg-black text-white text-[13px] font-sans font-medium rounded hover:bg-black/90 transition-colors"
        >
          Copy Current Colors
        </button>
      </div>
    </div>
  );
}

export default ColorPaletteExplorer;
