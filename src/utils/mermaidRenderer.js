// src/utils/mermaidRenderer.js
import mermaid from 'mermaid';
import { CATPPUCCIN_THEMES } from '../components/MermaidPanel/MermaidPanel';

/**
 * Renders Mermaid diagram to SVG
 * @param {string} code - Mermaid code
 * @param {string} theme - Theme name
 * @returns {Promise<string>} SVG string
 */
export const renderMermaidToSvg = async (code, theme = 'default') => {
  if (!code.trim()) return '';

  try {
    // Configure Mermaid
    const config = {
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'JetBrains Mono, monospace',
    };

    // Apply Catppuccin themes if selected
    if (CATPPUCCIN_THEMES[theme]) {
      Object.assign(config, CATPPUCCIN_THEMES[theme]);
    } else {
      config.theme = theme;
    }

    mermaid.initialize(config);
    
    const { svg } = await mermaid.render('mermaid-render', code);
    return svg;
  } catch (error) {
    console.error('Mermaid rendering error:', error);
    throw error;
  }
};

/**
 * Preloads Mermaid themes for faster rendering
 */
export const preloadMermaidThemes = () => {
  const themes = ['default', 'dark', 'forest', 'neutral', ...Object.keys(CATPPUCCIN_THEMES)];
  
  themes.forEach(theme => {
    const config = {
      startOnLoad: false,
      securityLevel: 'loose',
    };

    if (CATPPUCCIN_THEMES[theme]) {
      Object.assign(config, CATPPUCCIN_THEMES[theme]);
    } else {
      config.theme = theme;
    }

    mermaid.initialize(config);
  });
};