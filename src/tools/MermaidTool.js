import { nanoid } from 'nanoid';

class MermaidTool {
  constructor() {
    this.name = 'mermaid';
    this.cursor = 'crosshair';
    this.isDrawing = false;
    this.isEditing = false;
    this.editorElement = null;
    this.previewElement = null;
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    
    this.isDrawing = true;
    this.startPoint = { x, y };
    
    // Create preview element
    const style = state.getCurrentStyle ? state.getCurrentStyle() : {
      stroke: '#4f46e5',
      fill: 'transparent',
      strokeWidth: 2,
      opacity: 100,
    };

    this.previewElement = {
      id: 'mermaid-preview',
      type: 'mermaid',
      x,
      y,
      width: 400,
      height: 300,
      stroke: style.stroke,
      fill: style.fill,
      strokeWidth: style.strokeWidth,
      opacity: style.opacity,
      mermaidCode: 'graph TD\n  A[Start] --> B{Decision}',
      theme: 'default',
      diagramType: 'flowchart',
    };

    // Open Mermaid editor
    this.openMermaidEditor(x, y, state);
  }

  onMouseMove(e, state) {
    if (!this.isDrawing || !this.startPoint) return;

    const { x, y } = this.getCanvasCoordinates(e, state);
    
    // Update preview size while dragging
    const minX = Math.min(this.startPoint.x, x);
    const minY = Math.min(this.startPoint.y, y);
    const maxX = Math.max(this.startPoint.x, x);
    const maxY = Math.max(this.startPoint.y, y);
    
    this.previewElement = {
      ...this.previewElement,
      x: minX,
      y: minY,
      width: Math.max(200, maxX - minX),
      height: Math.max(150, maxY - minY),
    };
  }

  onMouseUp(e, state) {
    if (!this.isDrawing || !this.previewElement) {
      this.reset();
      return;
    }

    // Editor handles the actual creation
    this.isDrawing = false;
  }

  onKeyDown(e, state) {
    if (e.key === 'Escape') {
      if (this.isEditing) {
        this.closeMermaidEditor();
      } else if (this.isDrawing) {
        this.reset();
      }
    }
  }

  openMermaidEditor(x, y, state) {
  this.isEditing = true;
  this.editorPosition = { x, y };
  this.editorState = state;
  
  // Call the editor open callback if available
  if (state.openMermaidEditor) {
    state.openMermaidEditor(x, y);
  }
  }

  closeMermaidEditor() {
    this.isEditing = false;
    this.editorState = null;
    this.reset();
  }

  // Add this method to handle editor callbacks
  setEditorCallbacks(openCallback, closeCallback) {
    this.openMermaidEditor = openCallback;
    this.closeMermaidEditor = closeCallback;
  }

  // Called from MermaidPanel to insert the final element
  insertMermaidElement(elementData) {
    if (!this.editorState) return;

    const finalElement = {
      ...this.previewElement,
      ...elementData,
      id: nanoid(),
    };

    this.editorState.addElement(finalElement);
    this.editorState.commitChanges();
    this.closeMermaidEditor();
  }

  render(ctx, state) {
    // Render preview while drawing/editing
    if ((this.isDrawing || this.isEditing) && this.previewElement) {
      const { x, y, width, height, stroke } = this.previewElement;
      
      ctx.save();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.globalAlpha = 0.7;
      
      // Draw bounding box
      ctx.strokeRect(x, y, width, height);
      
      // Draw Mermaid icon and label
      ctx.fillStyle = stroke;
      ctx.font = '14px Arial';
      ctx.fillText('📊 Mermaid Diagram', x + 10, y + 20);
      
      ctx.restore();
    }
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }

  reset() {
    this.isDrawing = false;
    this.isEditing = false;
    this.previewElement = null;
    this.startPoint = null;
    this.editorState = null;
  }
}

export default MermaidTool;