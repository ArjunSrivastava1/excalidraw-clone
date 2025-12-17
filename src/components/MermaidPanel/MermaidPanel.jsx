import { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Download, Palette, Zap, 
  Copy, Check, FileText, Sparkles 
} from 'lucide-react';
import mermaid from 'mermaid';
import { MERMAID_THEMES, MERMAID_DIAGRAM_TYPES } from '../../constants';

// Catppuccin theme configurations
const CATPPUCCIN_THEMES = {
  'catppuccin-mocha': {
    theme: 'base',
    themeVariables: {
      primaryColor: '#1e1e2e',
      primaryTextColor: '#cdd6f4',
      primaryBorderColor: '#45475a',
      lineColor: '#cba6f7',
      arrowColor: '#cba6f7',
      clusterBkg: '#313244',
      clusterBorder: '#45475a',
      nodeBorder: '#cba6f7',
      fontFamily: 'JetBrains Mono, monospace'
    }
  },
  'catppuccin-latte': {
    theme: 'base', 
    themeVariables: {
      primaryColor: '#eff1f5',
      primaryTextColor: '#4c4f69',
      primaryBorderColor: '#bcc0cc',
      lineColor: '#8839ef',
      arrowColor: '#8839ef',
      clusterBkg: '#e6e9ef',
      clusterBorder: '#dce0e8',
      nodeBorder: '#8839ef',
      fontFamily: 'JetBrains Mono, monospace'
    }
  },
  'catppuccin-macchiato': {
    theme: 'base',
    themeVariables: {
      primaryColor: '#24273a',
      primaryTextColor: '#cad3f5',
      primaryBorderColor: '#494d64',
      lineColor: '#c6a0f6',
      arrowColor: '#c6a0f6',
      clusterBkg: '#363a4f',
      clusterBorder: '#5b6078',
      nodeBorder: '#c6a0f6',
      fontFamily: 'JetBrains Mono, monospace'
    }
  },
  'catppuccin-frappe': {
    theme: 'base',
    themeVariables: {
      primaryColor: '#303446',
      primaryTextColor: '#c6d0f5',
      primaryBorderColor: '#414559',
      lineColor: '#ca9ee6',
      arrowColor: '#ca9ee6',
      clusterBkg: '#414559',
      clusterBorder: '#51576d',
      nodeBorder: '#ca9ee6',
      fontFamily: 'JetBrains Mono, monospace'
    }
  }
};

// Premium templates for different diagram types
const MERMAID_TEMPLATES = {
  'flowchart': `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[End]
    
    style A fill:#2ecc71
    style D fill:#e74c3c`,

  'sequence': `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I'm good thanks!`,

  'class': `classDiagram
    class Animal {
      +String name
      +int age
      +void speak()
    }
    class Dog {
      +String breed
      +void bark()
    }
    Animal <|-- Dog`,

  'gitGraph': `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`,

  'c4': `C4Context
    title System Context diagram for Internet Banking System
    Person(customer, "Banking Customer", "A customer of the bank")
    System(banking_system, "Internet Banking System", "Allows customers to view account information")
    
    Rel(customer, banking_system, "Uses")`,

  'mindmap': `mindmap
    root((CanvasX))
      Features
        Drawing Tools
        Mermaid Integration
        Export Options
      Tech Stack
        React
        RoughJS
        Tailwind`,

  'timeline': `timeline
    title CanvasX Development
    2024 Q1 : Basic Drawing
    2024 Q2 : Mermaid Integration
    2024 Q3 : Advanced Features
    2024 Q4 : Premium Launch`,

  'quadrant': `quadrantChart
    title Project Priority Matrix
    x-axis "Low Effort" --> "High Effort"
    y-axis "Low Impact" --> "High Impact"
    quadrant-1 "Quick Wins"
    quadrant-2 "Major Projects"
    quadrant-3 "Fill-ins"
    quadrant-4 "Time Sinks"
    "Mermaid Integration": [0.8, 0.9]
    "Mobile App": [0.9, 0.2]`
};

export default function MermaidPanel({ position, onInsert, onClose, toolRef }) {
  const [code, setCode] = useState(MERMAID_TEMPLATES.flowchart);
  const [previewSvg, setPreviewSvg] = useState('');
  const [theme, setTheme] = useState('default');
  const [diagramType, setDiagramType] = useState('flowchart');
  const [isRendering, setIsRendering] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  // Initialize Mermaid with current theme
  useEffect(() => {
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
  }, [theme]);

  // Auto-render when code or theme changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (code.trim()) {
        renderPreview();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [code, theme]);

  const renderPreview = async () => {
    if (!code.trim()) {
      setPreviewSvg('');
      return;
    }
    
    setIsRendering(true);
    try {
      const { svg } = await mermaid.render('mermaid-preview', code);
      setPreviewSvg(svg);
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      setPreviewSvg(`
        <div style="color: #dc2626; padding: 20px; font-family: monospace; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
          <strong>Error rendering diagram:</strong><br/>
          ${error.message}
        </div>
      `);
    }
    setIsRendering(false);
  };

  const handleInsert = () => {
    onInsert({
      mermaidCode: code,
      theme: theme,
      diagramType: diagramType,
      renderedSvg: previewSvg,
    });
  };

  const handleTemplateSelect = (templateType) => {
    setCode(MERMAID_TEMPLATES[templateType]);
    setDiagramType(templateType);
    setShowTemplates(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadSVG = () => {
    if (!previewSvg) return;
    
    const blob = new Blob([previewSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `mermaid-diagram-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Main Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Mermaid Diagram Editor</h2>
              <p className="text-sm text-gray-500">Create beautiful diagrams with code</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Side */}
          <div className="flex-1 flex flex-col border-r border-gray-200">
            {/* Toolbar */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
              {/* Diagram Type */}
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(MERMAID_DIAGRAM_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {/* Theme Selector */}
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(MERMAID_THEMES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {/* Templates Button */}
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FileText size={16} />
                Templates
              </button>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              {/* Actions */}
              <div className="flex-1" />
              
              <button
                onClick={downloadSVG}
                disabled={!previewSvg}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <Download size={16} />
                Export SVG
              </button>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full font-mono text-sm border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="graph TD&#10;  A[Start] --> B{Decision}"
                spellCheck={false}
              />
            </div>

            {/* Insert Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleInsert}
                disabled={!previewSvg || isRendering}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all font-medium"
              >
                <Download size={18} />
                Insert into Canvas
              </button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="flex-1 flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
              <button
                onClick={renderPreview}
                disabled={isRendering}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Play size={14} />
                {isRendering ? 'Rendering...' : 'Refresh'}
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-4 overflow-auto bg-gray-50">
              {previewSvg ? (
                <div 
                  ref={previewRef}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Sparkles size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="font-medium">Write some Mermaid code to see the preview</p>
                    <p className="text-sm mt-1">Try one of the templates to get started!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Choose a Template</h3>
              <button onClick={() => setShowTemplates(false)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {Object.entries(MERMAID_DIAGRAM_TYPES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateSelect(key)}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-800">{label}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {Object.keys(MERMAID_TEMPLATES).includes(key) ? 'Ready' : 'No template yet'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}