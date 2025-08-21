// Farmer Dashboard JavaScript

class FarmerDashboard {
  constructor() {
    this.apiUrl = "/api"
    this.token = localStorage.getItem("farmerToken")
    this.usdToUgx = 3700

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

      const savedAmountUgx = data.savedAmount || 0
      document.getElementById("savedAmount").textContent = `${Math.round(savedAmountUgx).toLocaleString()} shs`

      const farmerName = data.farmerName || data.name || localStorage.getItem("farmerName") || "Farmer"
      document.getElementById("farmerName").textContent = farmerName
      document.getElementById("farmerNameHeader").textContent = farmerName

      // Store farmer name for future use
      if (data.farmerName) {
        localStorage.setItem("farmerName", data.farmerName)
      }

      console.log("[v0] Dashboard data updated successfully for:", farmerName)
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
      document.getElementById("totalMarkets").textContent = "0"
      document.getElementById("totalProducts").textContent = "0"
      document.getElementById("predictions").textContent = "0"
      document.getElementById("savedAmount").textContent = "0 shs"

      // Try to get farmer name from localStorage as fallback
      const storedName = localStorage.getItem("farmerName") || "Farmer"
      document.getElementById("farmerName").textContent = storedName
      document.getElementById("farmerNameHeader").textContent = storedName
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
    const quantity = Number.parseFloat(document.getElementById("quantity").value)
    const predictionDays = Number.parseInt(document.getElementById("predictionDays").value)

    if (!product || !market || !quantity || quantity <= 0) {
      alert("Please fill in all fields with valid values")
      return
    }

    try {
      console.log("Getting price prediction for:", { product, market, quantity, predictionDays })
      const response = await fetch(`${this.apiUrl}/predict-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          market,
          quantity: quantity,
          predictionDays: predictionDays,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const prediction = await response.json()
      console.log("Prediction received:", prediction)
      this.displayPrediction(prediction, quantity)
    } catch (error) {
      console.error("Error getting price prediction:", error)
      alert("Error getting price prediction. Please try again.")
    }
  }

  displayPrediction(prediction, quantity) {
    console.log("[v0] Displaying prediction:", prediction, "for quantity:", quantity)

    // The API now returns prices already calculated for the total quantity in UGX
    const totalSellingPriceUgx = prediction.totalSellingPrice || prediction.sellingPrice * quantity
    const totalBuyingPriceUgx = prediction.totalBuyingPrice || prediction.buyingPrice * quantity
    const sellingPricePerKgUgx = prediction.sellingPricePerKg || totalSellingPriceUgx / quantity
    const buyingPricePerKgUgx = prediction.buyingPricePerKg || totalBuyingPriceUgx / quantity
    const profitPotentialUgx = totalSellingPriceUgx - totalBuyingPriceUgx

    console.log("[v0] Calculated prices - Total selling:", totalSellingPriceUgx, "Total buying:", totalBuyingPriceUgx)
    console.log("[v0] Per kg prices - Selling:", sellingPricePerKgUgx, "Buying:", buyingPricePerKgUgx)

    // Display total prices with proper formatting
    document.getElementById("sellingPrice").textContent = `${Math.round(totalSellingPriceUgx).toLocaleString()} shs`
    document.getElementById("buyingPrice").textContent = `${Math.round(totalBuyingPriceUgx).toLocaleString()} shs`

    // Display per kg prices with proper formatting
    document.getElementById("sellingPricePerKg").textContent =
      `${Math.round(sellingPricePerKgUgx).toLocaleString()} shs`
    document.getElementById("buyingPricePerKg").textContent = `${Math.round(buyingPricePerKgUgx).toLocaleString()} shs`

    // Display profit potential and other metrics
    document.getElementById("profitPotential").textContent = `${Math.round(profitPotentialUgx).toLocaleString()} shs`
    document.getElementById("confidenceLevel").textContent = `${Math.round((prediction.confidence || 0.85) * 100)}%`

    const trendValue = prediction.factors?.trendFactor || prediction.factors?.marketTrend || 1
    const trendText = trendValue > 1.05 ? "Rising ↗️" : trendValue < 0.95 ? "Falling ↘️" : "Stable ➡️"
    document.getElementById("marketTrend").textContent = trendText

    const predictionDays = Number.parseInt(document.getElementById("predictionDays").value)
    const bestSellTime = prediction.bestSellTime || `Within ${predictionDays} days`
    const bestBuyTime = prediction.bestBuyTime || "Now"

    document.getElementById("bestSellTime").textContent = bestSellTime
    document.getElementById("bestBuyTime").textContent = bestBuyTime

    let recommendation = prediction.recommendation
    if (!recommendation) {
      if (quantity >= 100) {
        recommendation = `For bulk quantity (${quantity}kg), consider negotiating better rates. Current market conditions suggest ${trendText.toLowerCase()} prices.`
      } else if (quantity <= 10) {
        recommendation = `Small quantity (${quantity}kg) - consider combining with other farmers for better rates.`
      } else {
        recommendation = `Good quantity for trading. Monitor market trends for optimal timing.`
      }
    }
    document.getElementById("recommendation").textContent = recommendation

    // Show prediction results with smooth animation
    const resultsDiv = document.getElementById("predictionResults")
    resultsDiv.style.display = "block"
    resultsDiv.scrollIntoView({ behavior: "smooth" })

    console.log("[v0] Prediction display completed successfully")
  }

  async loadMarketComparison(markets) {
    try {
      console.log("[v0] Loading market comparison...")
      const response = await fetch(`${this.apiUrl}/market-comparison`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const comparisons = await response.json()
      console.log("[v0] Market comparison data loaded:", comparisons.length, "items")

      const tableBody = document.getElementById("marketComparisonTable")
      tableBody.innerHTML = ""

      if (comparisons.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No market data available</td></tr>'
        return
      }

      comparisons.forEach((item) => {
        const row = document.createElement("tr")
        const trendClass = item.trend === "up" ? "price-up" : item.trend === "down" ? "price-down" : "price-stable"
        const trendIcon = item.trend === "up" ? "fa-arrow-up" : item.trend === "down" ? "fa-arrow-down" : "fa-minus"

        // Assuming API now returns prices in UGX format
        const sellingPriceUgx = Math.round(item.sellingPrice || 0).toLocaleString()
        const buyingPriceUgx = Math.round(item.buyingPrice || 0).toLocaleString()

        row.innerHTML = `
          <td><strong>${item.marketName}</strong><br><small class="text-muted">${item.location || "Location not specified"}</small></td>
          <td>${item.productName}</td>
          <td><span class="currency-ugx">${sellingPriceUgx} shs</span></td>
          <td><span class="currency-ugx">${buyingPriceUgx} shs</span></td>
          <td>${item.stock || "N/A"} kg</td>
          <td><i class="fas ${trendIcon} ${trendClass}"></i> ${item.trend}</td>
          <td>
            <button class="btn btn-sm btn-success" onclick="dashboard.predictForProduct('${item.productName}', '${item.marketId}')">
              <i class="fas fa-crystal-ball me-1"></i>Predict
            </button>
          </td>
        `
        tableBody.appendChild(row)
      })

      console.log("[v0] Market comparison table populated successfully")
    } catch (error) {
      console.error("[v0] Error loading market comparison:", error)
      const tableBody = document.getElementById("marketComparisonTable")
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading market data</td></tr>'
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
