// Agent Dashboard JavaScript

class AgentDashboard {
  constructor() {
    this.apiUrl = "/api"
    this.token = localStorage.getItem("agentToken")

    if (!this.token) {
      alert("Please login first")
      window.location.href = "agent-login.html"
      return
    }

    this.init()
  }

  async init() {
    try {
      await this.loadDashboardData()
      await this.loadMyMarkets()
      await this.loadProducts()
      this.setupEventListeners()
    } catch (error) {
      console.error("Dashboard initialization error:", error)
      if (error.message.includes("401") || error.message.includes("token")) {
        alert("Session expired. Please login again.")
        localStorage.removeItem("agentToken")
        window.location.href = "agent-login.html"
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
    // Modal form submissions will be handled by global functions
  }

  async loadDashboardData() {
    try {
      console.log("Loading agent dashboard data...")
      const response = await fetch(`${this.apiUrl}/agent/dashboard`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Agent dashboard data:", data)

      document.getElementById("myMarkets").textContent = data.myMarkets || 0
      document.getElementById("activeProducts").textContent = data.activeProducts || 0
      document.getElementById("totalTransactions").textContent = data.totalTransactions || 0
      document.getElementById("totalRevenue").textContent = `$${data.totalRevenue || 0}`

      if (data.agentName) {
        document.getElementById("agentName").textContent = data.agentName
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // Show fallback data
      document.getElementById("myMarkets").textContent = "0"
      document.getElementById("activeProducts").textContent = "0"
      document.getElementById("totalTransactions").textContent = "0"
      document.getElementById("totalRevenue").textContent = "$0"
    }
  }

  async loadMyMarkets() {
    try {
      console.log("Loading agent markets...")
      const response = await fetch(`${this.apiUrl}/agent/markets`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const markets = await response.json()
      console.log("Agent markets loaded:", markets.length)

      const marketsList = document.getElementById("marketsList")
      marketsList.innerHTML = ""

      if (markets.length === 0) {
        marketsList.innerHTML =
          '<div class="col-12"><p class="text-muted text-center">No markets created yet. Create your first market!</p></div>'
        return
      }

      markets.forEach((market) => {
        const marketCard = document.createElement("div")
        marketCard.className = "col-md-6 col-lg-4 mb-3"
        marketCard.innerHTML = `
          <div class="market-card p-3">
            <h6 class="fw-bold">${market.name}</h6>
            <p class="text-muted mb-2"><i class="fas fa-map-marker-alt me-1"></i>${market.location}</p>
            <p class="small mb-3">${market.description || "No description"}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${market.productCount || 0} products</small>
              <div>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editMarket('${market._id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMarket('${market._id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `
        marketsList.appendChild(marketCard)
      })

      // Update product market options
      this.updateProductMarketOptions(markets)
    } catch (error) {
      console.error("Error loading markets:", error)
    }
  }

  updateProductMarketOptions(markets) {
    const productMarketSelect = document.getElementById("productMarket")
    if (productMarketSelect) {
      productMarketSelect.innerHTML = '<option value="">Select a market...</option>'

      markets.forEach((market) => {
        const option = document.createElement("option")
        option.value = market._id
        option.textContent = `${market.name} - ${market.location}`
        productMarketSelect.appendChild(option)
      })
    }
  }

  async loadProducts() {
    try {
      console.log("Loading agent products...")
      const response = await fetch(`${this.apiUrl}/agent/products`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const products = await response.json()
      console.log("Agent products loaded:", products.length)

      const productsTable = document.getElementById("productsTable")
      productsTable.innerHTML = ""

      if (products.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products added yet.</td></tr>'
        return
      }

      products.forEach((product) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.marketName}</td>
          <td>$${product.sellingPrice.toFixed(2)}</td>
          <td>$${product.buyingPrice.toFixed(2)}</td>
          <td>${product.stock} kg</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct('${product._id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `
        productsTable.appendChild(row)
      })
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }
}

async function createMarket() {
  const name = document.getElementById("marketName").value
  const location = document.getElementById("marketLocation").value
  const description = document.getElementById("marketDescription").value

  if (!name || !location) {
    alert("Please fill in required fields")
    return
  }

  try {
    const token = localStorage.getItem("agentToken")
    const response = await fetch("/api/markets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, description }),
    })

    if (response.ok) {
      // Close modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("createMarketModal"))
      modal.hide()

      // Reset form
      document.getElementById("createMarketForm").reset()

      // Reload markets
      await dashboard.loadMyMarkets()
      await dashboard.loadDashboardData()

      alert("Market created successfully!")
    } else {
      const errorData = await response.json()
      alert(errorData.message || "Error creating market")
    }
  } catch (error) {
    console.error("Error creating market:", error)
    alert("Error creating market")
  }
}

async function addProduct() {
  const name = document.getElementById("productName").value
  const marketId = document.getElementById("productMarket").value
  const sellingPrice = Number.parseFloat(document.getElementById("sellingPrice").value)
  const buyingPrice = Number.parseFloat(document.getElementById("buyingPrice").value)
  const stock = Number.parseInt(document.getElementById("stockQuantity").value)

  if (!name || !marketId || !sellingPrice || !buyingPrice || !stock) {
    alert("Please fill in all fields")
    return
  }

  if (sellingPrice <= buyingPrice) {
    alert("Selling price must be higher than buying price")
    return
  }

  try {
    const token = localStorage.getItem("agentToken")
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, marketId, sellingPrice, buyingPrice, stock }),
    })

    if (response.ok) {
      // Close modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("addProductModal"))
      modal.hide()

      // Reset form
      document.getElementById("addProductForm").reset()

      // Reload products
      await dashboard.loadProducts()
      await dashboard.loadDashboardData()

      alert("Product added successfully!")
    } else {
      const errorData = await response.json()
      alert(errorData.message || "Error adding product")
    }
  } catch (error) {
    console.error("Error adding product:", error)
    alert("Error adding product")
  }
}

async function deleteMarket(marketId) {
  if (!confirm("Are you sure you want to delete this market? This will also delete all associated products.")) {
    return
  }

  try {
    const token = localStorage.getItem("agentToken")
    const response = await fetch(`/api/markets/${marketId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      await dashboard.loadMyMarkets()
      await dashboard.loadProducts()
      await dashboard.loadDashboardData()
      alert("Market deleted successfully!")
    } else {
      const errorData = await response.json()
      alert(errorData.message || "Error deleting market")
    }
  } catch (error) {
    console.error("Error deleting market:", error)
    alert("Error deleting market")
  }
}

async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return
  }

  try {
    const token = localStorage.getItem("agentToken")
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      await dashboard.loadProducts()
      await dashboard.loadDashboardData()
      alert("Product deleted successfully!")
    } else {
      const errorData = await response.json()
      alert(errorData.message || "Error deleting product")
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    alert("Error deleting product")
  }
}

function editMarket(marketId) {
  // Implementation for editing market
  alert("Edit market functionality - to be implemented")
}

function editProduct(productId) {
  // Implementation for editing product
  alert("Edit product functionality - to be implemented")
}

function logout() {
  localStorage.removeItem("agentToken")
  localStorage.removeItem("agentName")
  localStorage.removeItem("agentEmail")
  window.location.href = "agent-login.html"
}

// Initialize dashboard when page loads
let dashboard
document.addEventListener("DOMContentLoaded", () => {
  window.bootstrap = window.bootstrap || {} // Declare bootstrap variable
  dashboard = new AgentDashboard()
})
