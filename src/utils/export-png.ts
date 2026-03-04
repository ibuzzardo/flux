export const exportCanvasToPNG = (canvas: HTMLCanvasElement, filename?: string): void => {
  try {
    const link = document.createElement('a');
    link.download = filename || `flux-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('PNG export failed');
  }
};