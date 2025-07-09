// Farmer Markets JavaScript

class FarmerMarkets {
  constructor() {
    this.apiUrl = "/api"
    this.markets = []
    this.filteredMarkets = []
    this.init()
  }

  async init() {
    await this.loadMarkets()
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.getElementById("searchMarkets").addEventListener("input", () => this.filterMarkets())
    document.getElementById("locationFilter").addEventListener("change", () => this.filterMarkets())
    document.getElementById("sortBy").addEventListener("change", () => this.sortMarkets())
  }

  async loadMarkets() {
    try {
      const response = await fetch(`${this.apiUrl}/markets`)
      this.markets = await response.json()
      this.filteredMarkets = [...this.markets]
      this.renderMarkets()
    } catch (error) {
      console.error("Error loading markets:", error)
    }
  }

  filterMarkets() {
    const searchTerm = document.getElementById("searchMarkets").value.toLowerCase()
    const locationFilter = document.getElementById("locationFilter").value.toLowerCase()

    this.filteredMarkets = this.markets.filter((market) => {
      const matchesSearch =
        market.name.toLowerCase().includes(searchTerm) || market.location.toLowerCase().includes(searchTerm)
      const matchesLocation = !locationFilter || market.location.toLowerCase().includes(locationFilter)

      return matchesSearch && matchesLocation
    })

    this.renderMarkets()
  }

  sortMarkets() {
    const sortBy = document.getElementById("sortBy").value

    this.filteredMarkets.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "location":
          return a.location.localeCompare(b.location)
        case "products":
          return (b.productCount || 0) - (a.productCount || 0)
        default:
          return 0
      }
    })

    this.renderMarkets()
  }

  renderMarkets() {
    const marketsGrid = document.getElementById("marketsGrid")

    if (this.filteredMarkets.length === 0) {
      marketsGrid.innerHTML = `
        <div class="col-12">
          <div class="text-center py-5">
            <i class="fas fa-store fa-3x text-muted mb-3"></i>
            <h4>No markets found</h4>
            <p class="text-muted">Try adjusting your search criteria</p>
          </div>
        </div>
      `
      return
    }

    marketsGrid.innerHTML = this.filteredMarkets
      .map(
        (market) => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="market-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="fw-bold mb-0">${market.name}</h5>
            <span class="badge bg-success">${market.productCount || 0} products</span>
          </div>
          <p class="text-muted mb-2">
            <i class="fas fa-map-marker-alt me-1"></i>${market.location}
          </p>
          <p class="mb-3">${market.description || "No description available"}</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
              Created: ${new Date(market.createdAt).toLocaleDateString()}
            </small>
            <button class="btn btn-success btn-sm" onclick="markets.viewMarketDetails('${market._id}')">
              <i class="fas fa-eye me-1"></i>View Details
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  async viewMarketDetails(marketId) {
    try {
      // Get market details
      const marketResponse = await fetch(`${this.apiUrl}/markets/${marketId}`)
      const market = await marketResponse.json()

      // Get market products
      const productsResponse = await fetch(`${this.apiUrl}/products/by-market/${marketId}`)
      const products = await productsResponse.json()

      // Update modal content
      document.getElementById("marketModalTitle").textContent = market.name
      document.getElementById("marketModalLocation").textContent = market.location
      document.getElementById("marketModalProducts").textContent = products.length
      document.getElementById("marketModalDescription").textContent = market.description || "No description available"

      // Update products table
      const productsTable = document.getElementById("marketProductsTable")
      if (products.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No products available</td></tr>'
      } else {
        productsTable.innerHTML = products
          .map(
            (product) => `
          <tr>
            <td>${product.name}</td>
            <td>$${product.sellingPrice.toFixed(2)}</td>
            <td>$${product.buyingPrice.toFixed(2)}</td>
            <td>${product.stock} kg</td>
            <td>
              <button class="btn btn-sm btn-outline-success" onclick="markets.predictPrice('${product.name}', '${marketId}')">
                Predict
              </button>
            </td>
          </tr>
        `,
          )
          .join("")
      }

      // Show modal
      const modal = new window.bootstrap.Modal(document.getElementById("marketDetailsModal"))
      modal.show()

      // Store current market for prediction
      this.currentMarket = marketId
    } catch (error) {
      console.error("Error loading market details:", error)
      alert("Error loading market details")
    }
  }

  predictPrice(productName, marketId) {
    // Close modal and redirect to dashboard with pre-filled data
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("marketDetailsModal"))
    modal.hide()

    // Redirect to dashboard with pre-filled prediction form
    localStorage.setItem("predictionProduct", productName)
    localStorage.setItem("predictionMarket", marketId)
    window.location.href = "farmer-dashboard.html#prediction"
  }
}

function goToPrediction() {
  window.location.href = "farmer-dashboard.html#prediction"
}

// Initialize markets when page loads
let markets
document.addEventListener("DOMContentLoaded", () => {
  markets = new FarmerMarkets()
})
