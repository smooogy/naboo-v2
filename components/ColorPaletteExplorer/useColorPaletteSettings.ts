'use client';

import { useEffect, useLayoutEffect } from 'react';

const fontOptions: Record<string, string> = {
  'Google Sans': "'Google Sans', system-ui, sans-serif",
  'Aeonik': "'Aeonik Medium', 'Aeonik', system-ui, sans-serif",
  'TWK Lausanne': "'TWK Lausanne', system-ui, sans-serif",
};

const letterSpacingOptions: Record<string, string> = {
  '0%': '0',
  '-1%': '-0.01em',
  '-2%': '-0.02em',
};

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useColorPaletteSettings() {
  // Use layout effect to apply settings before paint to avoid flash
  useIsomorphicLayoutEffect(() => {
    const saved = localStorage.getItem('colorPaletteSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        
        // Restore colors
        if (settings.colors) {
          Object.entries(settings.colors).forEach(([cssVar, value]) => {
            document.documentElement.style.setProperty(cssVar, value as string);
          });
        }
        
        // Restore custom colors
        if (settings.customColors) {
          const colorMappings: Record<string, string> = {
            'Grey': '--color-grey',
            'Grey Light': '--color-grey-light',
            'Info': '--color-info',
            'Black': '--color-black',
          };
          Object.entries(settings.customColors).forEach(([name, value]) => {
            const cssVar = colorMappings[name];
            if (cssVar) {
              document.documentElement.style.setProperty(cssVar, value as string);
            }
          });
        }
        
        // Restore font
        if (settings.font && fontOptions[settings.font]) {
          document.documentElement.style.setProperty('--font-sans', fontOptions[settings.font]);
          document.documentElement.style.setProperty('--font-weight-bold', settings.font === 'Aeonik' ? '500' : '600');
        }
        
        // Restore letter spacing
        if (settings.letterSpacing && letterSpacingOptions[settings.letterSpacing]) {
          document.documentElement.style.setProperty('--letter-spacing', letterSpacingOptions[settings.letterSpacing]);
        }
      } catch (e) {
        console.error('Failed to parse color palette settings:', e);
      }
    }
  }, []);
}
