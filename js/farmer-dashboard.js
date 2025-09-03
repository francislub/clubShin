// Farmer Dashboard JavaScript

class FarmerDashboard {
  constructor() {
    this.apiUrl = "/api"
    this.token = localStorage.getItem("farmerToken")

    this.init()
  }

  async init() {
    try {
      console.log("[v0] Initializing farmer dashboard...")
      await this.loadDashboardData()
      await this.loadMarkets()
      await this.loadProducts()
      this.setupEventListeners()
      console.log("[v0] Dashboard initialization completed successfully")
    } catch (error) {
      console.error("[v0] Dashboard initialization error:", error)
      this.showError("Failed to load dashboard data. Please check your connection and try again.")
    }
  }

  showError(message) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "alert alert-danger"
    errorDiv.innerHTML = `
      <strong>Error:</strong> ${message}
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="location.reload()">
        Retry
      </button>
    `
    document.querySelector(".container-fluid").prepend(errorDiv)
  }

  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    }
  }

  setupEventListeners() {
    document.getElementById("predictionForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.getPricePrediction()
    })

    document.getElementById("productSelect").addEventListener("change", () => {
      this.updateMarketOptions()
    })
  }

  async loadDashboardData() {
    try {
      console.log("[v0] Loading dashboard data...")
      const response = await fetch(`${this.apiUrl}/farmer/dashboard`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Dashboard data received:", data)

      document.getElementById("totalMarkets").textContent = data.totalMarkets || 0
      document.getElementById("totalProducts").textContent = data.totalProducts || 0
      document.getElementById("predictions").textContent = data.predictions || 0

      // Format saved amount in UGX
      const savedAmount = data.savedAmount || 0
      document.getElementById("savedAmount").textContent = `${savedAmount.toLocaleString()} shs`

      if (data.farmerName) {
        document.getElementById("farmerName").textContent = data.farmerName
        document.getElementById("farmerNameHeader").textContent = data.farmerName
        // Store for reference but prioritize database data
        localStorage.setItem("farmerName", data.farmerName)
      } else {
        // If no name in database, show error
        document.getElementById("farmerName").textContent = "farmer portal"
        document.getElementById("farmerNameHeader").textContent = "farmer portal"
      }

      console.log("[v0] Dashboard data updated successfully")
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
      throw error
    }
  }

  async loadMarkets() {
    try {
      console.log("[v0] Loading markets...")
      const response = await fetch(`${this.apiUrl}/markets`)

      if (!response.ok) {
        throw new Error(`Markets API failed: ${response.status}`)
      }

      const markets = await response.json()
      console.log("[v0] Markets loaded:", markets.length)

      const marketSelect = document.getElementById("marketSelect")
      marketSelect.innerHTML = '<option value="">Choose a market...</option>'

      if (markets.length === 0) {
        marketSelect.innerHTML = '<option value="">No markets available</option>'
        return
      }

      markets.forEach((market) => {
        const option = document.createElement("option")
        option.value = market._id
        option.textContent = `${market.name} - ${market.location}`
        marketSelect.appendChild(option)
      })

      this.loadMarketComparison(markets)
    } catch (error) {
      console.error("[v0] Error loading markets:", error)
      const marketSelect = document.getElementById("marketSelect")
      marketSelect.innerHTML = '<option value="">Failed to load markets</option>'
      throw error
    }
  }

  async loadProducts() {
    try {
      console.log("[v0] Loading products...")
      const response = await fetch(`${this.apiUrl}/products`)

      if (!response.ok) {
        throw new Error(`Products API failed: ${response.status}`)
      }

      const products = await response.json()
      console.log("[v0] Products loaded:", products.length)

      const productSelect = document.getElementById("productSelect")
      productSelect.innerHTML = '<option value="">Choose a product...</option>'

      if (products.length === 0) {
        productSelect.innerHTML = '<option value="">No products available</option>'
        return
      }

      // Get unique products
      const uniqueProducts = [...new Set(products.map((p) => p.name))]

      uniqueProducts.forEach((productName) => {
        const option = document.createElement("option")
        option.value = productName
        option.textContent = productName
        productSelect.appendChild(option)
      })
    } catch (error) {
      console.error("[v0] Error loading products:", error)
      const productSelect = document.getElementById("productSelect")
      productSelect.innerHTML = '<option value="">Failed to load products</option>'
      throw error
    }
  }

  async updateMarketOptions() {
    const selectedProduct = document.getElementById("productSelect").value
    if (!selectedProduct) return

    try {
      console.log("[v0] Updating market options for product:", selectedProduct)
      const response = await fetch(`${this.apiUrl}/products/by-name/${selectedProduct}`)

      if (!response.ok) {
        console.log("[v0] Product markets API failed, keeping all markets available")
        return
      }

      const products = await response.json()

      const marketSelect = document.getElementById("marketSelect")
      marketSelect.innerHTML = '<option value="">Choose a market...</option>'

      products.forEach((product) => {
        const option = document.createElement("option")
        option.value = product.marketId
        option.textContent = product.marketName
        marketSelect.appendChild(option)
      })
    } catch (error) {
      console.error("[v0] Error updating market options:", error)
      // Keep existing market options
    }
  }

  async getPricePrediction() {
    const product = document.getElementById("productSelect").value
    const market = document.getElementById("marketSelect").value
    const quantity = document.getElementById("quantity").value

    if (!product || !market || !quantity) {
      alert("Please fill in all fields")
      return
    }

    try {
      console.log("[v0] Getting price prediction for:", { product, market, quantity })
      const response = await fetch(`${this.apiUrl}/predict-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, market, quantity: Number.parseInt(quantity) }),
      })

      if (!response.ok) {
        throw new Error(`Price prediction failed: ${response.status}`)
      }

      const prediction = await response.json()
      console.log("[v0] Prediction received:", prediction)
      this.displayPrediction(prediction)
    } catch (error) {
      console.error("[v0] Error getting price prediction:", error)
      alert("Failed to get price prediction. Please try again later.")
    }
  }

  displayPrediction(prediction) {
    document.getElementById("sellingPrice").textContent = `${Math.round(prediction.sellingPrice).toLocaleString()} shs`
    document.getElementById("buyingPrice").textContent = `${Math.round(prediction.buyingPrice).toLocaleString()} shs`
    document.getElementById("sellingPricePerKg").textContent =
      `${Math.round(prediction.sellingPricePerKg || prediction.sellingPrice).toLocaleString()} shs`
    document.getElementById("buyingPricePerKg").textContent =
      `${Math.round(prediction.buyingPricePerKg || prediction.buyingPrice).toLocaleString()} shs`
    document.getElementById("profitPotential").textContent =
      `${Math.round(prediction.profitPotential || 0).toLocaleString()} shs`
    document.getElementById("confidenceLevel").textContent =
      `${prediction.confidenceLevel || prediction.confidence || 0}%`
    document.getElementById("marketTrend").textContent = prediction.marketTrend || "unknown"
    document.getElementById("bestSellTime").textContent = prediction.bestSellTime || "Not available"
    document.getElementById("bestBuyTime").textContent = prediction.bestBuyTime || "Not available"
    document.getElementById("recommendation").textContent = prediction.recommendation || "No recommendation available."

    // Show prediction results
    document.getElementById("predictionResults").style.display = "block"
    document.getElementById("predictionResults").scrollIntoView({ behavior: "smooth" })
  }

  async loadMarketComparison(markets) {
    try {
      console.log("[v0] Loading market comparison...")
      const response = await fetch(`${this.apiUrl}/market-comparison`)

      if (!response.ok) {
        throw new Error(`Market comparison failed: ${response.status}`)
      }

      const comparisons = await response.json()
      this.displayMarketComparison(comparisons)
    } catch (error) {
      console.error("[v0] Error loading market comparison:", error)
      const tableBody = document.getElementById("marketComparisonTable")
      tableBody.innerHTML =
        '<tr><td colspan="7" class="text-center text-danger">Failed to load market comparison data</td></tr>'
    }
  }

  displayMarketComparison(comparisons) {
    const tableBody = document.getElementById("marketComparisonTable")
    tableBody.innerHTML = ""

    if (comparisons.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No market data available</td></tr>'
      return
    }

    comparisons.forEach((item) => {
      const row = document.createElement("tr")
      const trendClass = item.trend === "up" ? "text-success" : item.trend === "down" ? "text-danger" : "text-warning"
      const trendIcon = item.trend === "up" ? "fa-arrow-up" : item.trend === "down" ? "fa-arrow-down" : "fa-minus"

      row.innerHTML = `
        <td>${item.marketName}</td>
        <td>${item.productName}</td>
        <td class="currency-ugx">${Math.round(item.sellingPrice).toLocaleString()}</td>
        <td class="currency-ugx">${Math.round(item.buyingPrice).toLocaleString()}</td>
        <td>${item.stock || "Available"}</td>
        <td><i class="fas ${trendIcon} ${trendClass}"></i> <span class="${trendClass}">${item.trend}</span></td>
        <td>
          <button class="btn btn-sm btn-success" onclick="dashboard.predictForProduct('${item.productName}', '${item.marketId || ""}')">
            Predict
          </button>
        </td>
      `
      tableBody.appendChild(row)
    })

    console.log("[v0] Market comparison table updated with", comparisons.length, "items")
  }

  predictForProduct(productName, marketId) {
    document.getElementById("productSelect").value = productName
    document.getElementById("marketSelect").value = marketId
    document.getElementById("quantity").focus()

    // Scroll to prediction form
    document.getElementById("price-prediction").scrollIntoView({ behavior: "smooth" })
  }
}

function logout() {
  localStorage.removeItem("farmerToken")
  localStorage.removeItem("farmerName")
  localStorage.removeItem("farmerEmail")
  window.location.href = "farmer-login.html"
}

// Initialize dashboard when page loads
let dashboard
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM loaded, initializing farmer dashboard...")
  dashboard = new FarmerDashboard()
})
