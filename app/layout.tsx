import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Naboo - Corporate Event Venues",
    template: "%s | Naboo",
  },
  description: "Find and book your next corporate meeting venue",
  icons: {
    icon: "/assets/favicon.png",
  },
};

// Script to apply saved color settings immediately before React hydrates
const colorSettingsScript = `
(function() {
  try {
    var saved = localStorage.getItem('colorPaletteSettings');
    if (saved) {
      var settings = JSON.parse(saved);
      var root = document.documentElement;
      
      if (settings.colors) {
        Object.keys(settings.colors).forEach(function(cssVar) {
          root.style.setProperty(cssVar, settings.colors[cssVar]);
        });
      }
      
      if (settings.customColors) {
        var colorMappings = {
          'Grey': '--color-grey',
          'Grey Light': '--color-grey-light',
          'Info': '--color-info',
          'Black': '--color-black'
        };
        Object.keys(settings.customColors).forEach(function(name) {
          var cssVar = colorMappings[name];
          if (cssVar) root.style.setProperty(cssVar, settings.customColors[name]);
        });
      }
      
      if (settings.font) {
        var fontOptions = {
          'Google Sans': "'Google Sans', system-ui, sans-serif",
          'Aeonik': "'Aeonik Medium', 'Aeonik', system-ui, sans-serif",
          'TWK Lausanne': "'TWK Lausanne', system-ui, sans-serif"
        };
        if (fontOptions[settings.font]) {
          root.style.setProperty('--font-sans', fontOptions[settings.font]);
          root.style.setProperty('--font-weight-bold', settings.font === 'Aeonik' ? '500' : '600');
        }
      }
      
      if (settings.letterSpacing) {
        var spacingOptions = { '0%': '0', '-1%': '-0.01em', '-2%': '-0.02em' };
        if (spacingOptions[settings.letterSpacing]) {
          root.style.setProperty('--letter-spacing', spacingOptions[settings.letterSpacing]);
        }
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favicon.png" />
        <script dangerouslySetInnerHTML={{ __html: colorSettingsScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}



