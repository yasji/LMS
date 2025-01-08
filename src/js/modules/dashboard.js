import { generateDashboardData } from '../utils/Data.js';
import { createStatCard } from '../components/StatCard.js';
import { createChart } from '../components/Chart.js';

export async function setupDashboard(container) {
  try {
    const data = await generateDashboardData();
    
    container.innerHTML = `
      <div class="space-y-8">
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          ${createStatCard('Total Books', data.totalBooks)}
          ${createStatCard('Active Loans', data.activeLoans)}
          ${createStatCard('Overdue Books', data.overdueBooks, 'text-destructive')}
          ${createStatCard('Total Members', data.totalMembers)}
        </div>
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div class="md:col-span-4 lg:col-span-4">
            <div class="h-full space-y-4">
              <div class="bg-card rounded-lg shadow-sm border">
                <div class="p-6">
                  <h3 class="text-lg font-medium">Monthly Loans</h3>
                  <canvas id="loansChart" class="mt-4"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="md:col-span-2 lg:col-span-3">
            <div class="h-full space-y-4">
              <div class="bg-card rounded-lg shadow-sm border">
                <div class="p-6">
                  <h3 class="text-lg font-medium">Books by Category</h3>
                  <canvas id="categoryChart" class="mt-4"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Setup charts after DOM elements are created
    setupCharts(data);
  } catch (error) {
    console.error('Error setting up dashboard:', error);
    container.innerHTML = '<p class="text-destructive">Error loading dashboard data</p>';
  }
}

function setupCharts(data) {
  // Category Distribution Chart
  createChart('categoryChart', {
    type: 'doughnut',
    data: {
      labels: data.categories.map(c => c.name),
      datasets: [{
        data: data.categories.map(c => c.count),
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#22c55e',
          '#f59e0b',
          '#6366f1'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      cutout: '60%'
    }
  });

  // Monthly Loans Chart
  createChart('loansChart', {
    type: 'bar',
    data: {
      labels: data.monthlyLoans.map(m => m.month),
      datasets: [{
        label: 'Loans',
        data: data.monthlyLoans.map(m => m.count),
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}