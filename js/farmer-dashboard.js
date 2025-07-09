// Farmer Dashboard JavaScript

class FarmerDashboard {
  constructor() {
    this.apiUrl = "/api"
    this.token = localStorage.getItem("farmerToken")

    if (!this.token) {
      alert("Please login first")
      window.location.href = "farmer-login.html"
      return
    }

    this.init()
  }

  async init() {
    try {
      await this.loadDashboardData()
      await this.loadMarkets()
      await this.loadProducts()
      this.setupEventListeners()
    } catch (error) {
      console.error("Dashboard initialization error:", error)
      if (error.message.includes("401") || error.message.includes("token")) {
        alert("Session expired. Please login again.")
        localStorage.removeItem("farmerToken")
        window.location.href = "farmer-login.html"
      }
    }
  }

  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
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
      console.log("Loading dashboard data...")
      const response = await fetch(`${this.apiUrl}/farmer/dashboard`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Dashboard data:", data)

      document.getElementById("totalMarkets").textContent = data.totalMarkets || 0
      document.getElementById("totalProducts").textContent = data.totalProducts || 0
      document.getElementById("predictions").textContent = data.predictions || 0
      document.getElementById("savedAmount").textContent = `$${data.savedAmount || 0}`

      if (data.farmerName) {
        document.getElementById("farmerName").textContent = data.farmerName
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // Show fallback data
      document.getElementById("totalMarkets").textContent = "0"
      document.getElementById("totalProducts").textContent = "0"
      document.getElementById("predictions").textContent = "0"
      document.getElementById("savedAmount").textContent = "$0"
    }
  }

  async loadMarkets() {
    try {
      console.log("Loading markets...")
      const response = await fetch(`${this.apiUrl}/markets`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const markets = await response.json()
      console.log("Markets loaded:", markets.length)

      const marketSelect = document.getElementById("marketSelect")
      marketSelect.innerHTML = '<option value="">Choose a market...</option>'

      markets.forEach((market) => {
        const option = document.createElement("option")
        option.value = market._id
        option.textContent = `${market.name} - ${market.location}`
        marketSelect.appendChild(option)
      })

      this.loadMarketComparison(markets)
    } catch (error) {
      console.error("Error loading markets:", error)
    }
  }

  async loadProducts() {
    try {
      console.log("Loading products...")
      const response = await fetch(`${this.apiUrl}/products`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const products = await response.json()
      console.log("Products loaded:", products.length)

      const productSelect = document.getElementById("productSelect")
      productSelect.innerHTML = '<option value="">Choose a product...</option>'

      // Get unique products
      const uniqueProducts = [...new Set(products.map((p) => p.name))]

      uniqueProducts.forEach((productName) => {
        const option = document.createElement("option")
        option.value = productName
        option.textContent = productName
        productSelect.appendChild(option)
      })
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  async updateMarketOptions() {
    const selectedProduct = document.getElementById("productSelect").value
    if (!selectedProduct) return

    try {
      console.log("Updating market options for product:", selectedProduct)
      const response = await fetch(`${this.apiUrl}/products/by-name/${selectedProduct}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
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
      console.error("Error updating market options:", error)
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
      console.log("Getting price prediction for:", { product, market, quantity })
      const response = await fetch(`${this.apiUrl}/predict-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, market, quantity: Number.parseInt(quantity) }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const prediction = await response.json()
      console.log("Prediction received:", prediction)
      this.displayPrediction(prediction)
    } catch (error) {
      console.error("Error getting price prediction:", error)
      alert("Error getting price prediction. Please try again.")
    }
  }

  displayPrediction(prediction) {
    document.getElementById("sellingPrice").textContent = `$${prediction.sellingPrice.toFixed(2)}`
    document.getElementById("buyingPrice").textContent = `$${prediction.buyingPrice.toFixed(2)}`
    document.getElementById("bestSellTime").textContent = prediction.bestSellTime
    document.getElementById("bestBuyTime").textContent = prediction.bestBuyTime
    document.getElementById("recommendation").textContent = prediction.recommendation

    // Show prediction results
    document.getElementById("predictionResults").style.display = "block"
    document.getElementById("predictionResults").scrollIntoView({ behavior: "smooth" })
  }

  async loadMarketComparison(markets) {
    try {
      console.log("Loading market comparison...")
      const response = await fetch(`${this.apiUrl}/market-comparison`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const comparisons = await response.json()

      const tableBody = document.getElementById("marketComparisonTable")
      tableBody.innerHTML = ""

      if (comparisons.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No market data available</td></tr>'
        return
      }

      comparisons.forEach((item) => {
        const row = document.createElement("tr")
        const trendClass = item.trend === "up" ? "price-up" : item.trend === "down" ? "price-down" : "price-stable"
        const trendIcon = item.trend === "up" ? "fa-arrow-up" : item.trend === "down" ? "fa-arrow-down" : "fa-minus"

        row.innerHTML = `
          <td>${item.marketName}</td>
          <td>${item.productName}</td>
          <td>$${item.sellingPrice.toFixed(2)}</td>
          <td>$${item.buyingPrice.toFixed(2)}</td>
          <td><i class="fas ${trendIcon} ${trendClass}"></i> ${item.trend}</td>
          <td>
            <button class="btn btn-sm btn-success" onclick="dashboard.predictForProduct('${item.productName}', '${item.marketId}')">
              Predict
            </button>
          </td>
        `
        tableBody.appendChild(row)
      })
    } catch (error) {
      console.error("Error loading market comparison:", error)
    }
  }

  predictForProduct(productName, marketId) {
    document.getElementById("productSelect").value = productName
    document.getElementById("marketSelect").value = marketId
    document.getElementById("quantity").focus()
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
  dashboard = new FarmerDashboard()
})
