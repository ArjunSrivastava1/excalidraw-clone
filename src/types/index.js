// src/types/index.js

/**
 * @typedef {'select' | 'rectangle' | 'ellipse' | 'arrow' | 'draw' | 'text' | 'eraser' | 'mermaid'} ToolType
 */

/**
 * @typedef {'rectangle' | 'ellipse' | 'arrow' | 'draw' | 'text' | 'mermaid'} ElementType
 */

/**
 * @typedef {Object} MermaidElement
 * @property {string} id - Unique identifier
 * @property {'mermaid'} type - Element type
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} width - Element width
 * @property {number} height - Element height
 * @property {string} stroke - Stroke color (hex)
 * @property {string} fill - Fill color (hex or 'transparent')
 * @property {number} strokeWidth - Stroke width (1-5)
 * @property {number} roughness - Roughness level (0-3)
 * @property {number} seed - Random seed for consistent rendering
 * @property {number} angle - Rotation angle in degrees
 * @property {number} opacity - Opacity (0-100)
 * @property {string} mermaidCode - The Mermaid diagram code
 * @property {string} renderedSvg - Cached SVG rendering
 * @property {string} theme - Mermaid theme name
 * @property {string} diagramType - Type of diagram (flowchart, sequence, etc.)
 * @property {Object} mermaidConfig - Mermaid configuration options
 */

/**
 * @typedef {RectangleElement | EllipseElement | ArrowElement | DrawElement | TextElement | MermaidElement} Element
 */

/**
 * Creates a new element with default values
 * @param {string} type - Element type
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Object} options - Additional options
 * @returns {Element}
 */
export const createElement = (type, x, y, options = {}) => {
  const baseElement = {
    id: options.id || `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    x,
    y,
    width: options.width || 0,
    height: options.height || 0,
    stroke: options.stroke || '#000000',
    fill: options.fill || 'transparent',
    strokeWidth: options.strokeWidth || 2,
    roughness: options.roughness || 1,
    seed: options.seed || Math.floor(Math.random() * 2 ** 31),
    angle: options.angle || 0,
    opacity: options.opacity || 100,
  };

  // Add type-specific properties
  switch (type) {
    case 'draw':
    case 'arrow':
      return {
        ...baseElement,
        points: options.points || [],
      };
      
    case 'text':
      return {
        ...baseElement,
        text: options.text || '',
        fontSize: options.fontSize || 20,
        fontFamily: options.fontFamily || 'Arial',
        fontWeight: options.fontWeight || 'normal',
        textAlign: options.textAlign || 'left',
      };
      
    case 'mermaid':
      return {
        ...baseElement,
        mermaidCode: options.mermaidCode || 'graph TD\n  A[Start] --> B{Decision}',
        renderedSvg: options.renderedSvg || '',
        theme: options.theme || 'default',
        diagramType: options.diagramType || 'flowchart',
        mermaidConfig: options.mermaidConfig || {},
        // Set reasonable default size for Mermaid elements
        width: options.width || 400,
        height: options.height || 300,
      };
      
    default:
      return baseElement;
  }
};

/**
 * Creates a new canvas with default values
 * @param {string} name - Canvas name
 * @param {string} [id] - Optional canvas ID
 * @returns {Canvas}
 */
export const createCanvas = (name, id = null) => {
  const now = new Date().toISOString();
  return {
    id: id || `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    elements: [],
    appState: {
      currentTool: 'select',
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 2,
      opacity: 100,
      zoom: 1,
      scrollX: 0,
      scrollY: 0,
      selectedElementIds: [],
    },
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Creates default app state
 * @returns {AppState}
 */
export const createDefaultAppState = () => ({
  currentTool: 'select',
  strokeColor: '#000000',
  fillColor: 'transparent',
  strokeWidth: 2,
  opacity: 100,
  zoom: 1,
  scrollX: 0,
  scrollY: 0,
  selectedElementIds: [],
});

/*figure out the create element for mermaid*/

