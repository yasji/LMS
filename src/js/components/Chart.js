import Chart from 'chart.js/auto';

export function createChart(canvasId, config) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.error(`Canvas element with id '${canvasId}' not found`);
    return null;
  }

  try {
    return new Chart(ctx, config);
  } catch (error) {
    console.error(`Error creating chart '${canvasId}':`, error);
    return null;
  }
}