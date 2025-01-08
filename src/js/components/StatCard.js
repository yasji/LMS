export function createStatCard(title, value, valueClass = '') {
  return `
    <div class="bg-card p-6 rounded-lg shadow-sm border">
      <h3 class="text-sm font-medium text-muted-foreground mb-2">${title}</h3>
      <p class="text-2xl font-bold text-card-foreground ${valueClass}">${value}</p>
    </div>
  `;
}