import { Chart } from "@/components/ui/chart"
// Agent Analytics JavaScript

class AgentAnalytics {
  constructor() {
    this.apiUrl = "/api"
    this.charts = {}
    this.init()
  }

  async init() {
    this.setDefaultDates()
    await this.loadAnalytics()
    this.initializeCharts()
  }

  setDefaultDates() {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    document.getElementById("dateFrom").value = thirtyDaysAgo.toISOString().split("T")[0]
    document.getElementById("dateTo").value = today.toISOString().split("T")[0]
  }

  async loadAnalytics() {
    try {
      const token = localStorage.getItem("agentToken")
      const dateFrom = document.getElementById("dateFrom").value
      const dateTo = document.getElementById("dateTo").value

      const response = await fetch(`${this.apiUrl}/agent/analytics?from=${dateFrom}&to=${dateTo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const analytics = await response.json()
      this.updateMetrics(analytics)
      this.updateTables(analytics)
      this.updateCharts(analytics)
    } catch (error) {
      console.error("Error loading analytics:", error)
    }
  }

  updateMetrics(analytics) {
    document.getElementById("totalRevenue").textContent = `$${analytics.totalRevenue.toLocaleString()}`
    document.getElementById("totalSales").textContent = analytics.totalSales.toLocaleString()
    document.getElementById("uniqueCustomers").textContent = analytics.uniqueCustomers.toLocaleString()
    document.getElementById("profitMargin").textContent = `${analytics.profitMargin}%`

    // Update change indicators
    document.getElementById("revenueChange").textContent =
      `${analytics.revenueChange > 0 ? "+" : ""}${analytics.revenueChange}%`
    document.getElementById("salesChange").textContent =
      `${analytics.salesChange > 0 ? "+" : ""}${analytics.salesChange}%`
    document.getElementById("customersChange").textContent =
      `${analytics.customersChange > 0 ? "+" : ""}${analytics.customersChange}%`
    document.getElementById("marginChange").textContent =
      `${analytics.marginChange > 0 ? "+" : ""}${analytics.marginChange}%`
  }

  updateTables(analytics) {
    // Top products table
    const topProductsTable = document.getElementById("topProductsTable")
    topProductsTable.innerHTML = analytics.topProducts
      .map(
        (product) => `
      <tr>
        <td>${product.name}</td>
        <td>${product.sales}</td>
        <td>$${product.revenue.toLocaleString()}</td>
        <td>
          <i class="fas fa-arrow-${product.trend === "up" ? "up text-success" : product.trend === "down" ? "down text-danger" : "right text-warning"}"></i>
        </td>
      </tr>
    `,
      )
      .join("")

    // Market performance table
    const marketPerformanceTable = document.getElementById("marketPerformanceTable")
    marketPerformanceTable.innerHTML = analytics.marketPerformance
      .map(
        (market) => `
      <tr>
        <td>${market.name}</td>
        <td>${market.productCount}</td>
        <td>$${market.revenue.toLocaleString()}</td>
        <td>
          <span class="badge bg-${market.status === "active" ? "success" : market.status === "inactive" ? "danger" : "warning"}">
            ${market.status}
          </span>
        </td>
      </tr>
    `,
      )
      .join("")

    // Recent transactions table
    const recentTransactionsTable = document.getElementById("recentTransactionsTable")
    recentTransactionsTable.innerHTML = analytics.recentTransactions
      .map(
        (transaction) => `
      <tr>
        <td>${new Date(transaction.date).toLocaleDateString()}</td>
        <td>${transaction.product}</td>
        <td>${transaction.market}</td>
        <td>${transaction.quantity} kg</td>
        <td>$${transaction.amount.toLocaleString()}</td>
        <td>
          <span class="badge bg-${transaction.type === "sale" ? "success" : "primary"}">
            ${transaction.type}
          </span>
        </td>
        <td>
          <span class="badge bg-${transaction.status === "completed" ? "success" : transaction.status === "pending" ? "warning" : "danger"}">
            ${transaction.status}
          </span>
        </td>
      </tr>
    `,
      )
      .join("")
  }

  initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById("revenueChart").getContext("2d")
    this.charts.revenue = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Revenue",
            data: [],
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
        },
      },
    })

    // Product Distribution Chart
    const productCtx = document.getElementById("productChart").getContext("2d")
    this.charts.product = new Chart(productCtx, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["#28a745", "#007bff", "#ffc107", "#dc3545", "#6f42c1", "#fd7e14"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }

  updateCharts(analytics) {
    // Update revenue chart
    this.charts.revenue.data.labels = analytics.revenueData.labels
    this.charts.revenue.data.datasets[0].data = analytics.revenueData.values
    this.charts.revenue.update()

    // Update product chart
    this.charts.product.data.labels = analytics.productDistribution.labels
    this.charts.product.data.datasets[0].data = analytics.productDistribution.values
    this.charts.product.update()
  }
}

async function updateAnalytics() {
  await analytics.loadAnalytics()
}

// Initialize analytics when page loads
let analytics
document.addEventListener("DOMContentLoaded", () => {
  analytics = new AgentAnalytics()
})
