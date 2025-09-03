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
      await this.loadUserInfo()
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

  async loadUserInfo() {
    try {
      const response = await fetch(`${this.apiUrl}/agent/profile`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const userInfo = await response.json()
        const agentName = userInfo.name || userInfo.fullName || localStorage.getItem("agentName") || "Agent"

        document.getElementById("agentName").textContent = agentName
        document.getElementById("agentNameHeader").textContent = agentName

        localStorage.setItem("agentName", agentName)
      } else {
        const agentName = localStorage.getItem("agentName") || "Agent"
        document.getElementById("agentName").textContent = agentName
        document.getElementById("agentNameHeader").textContent = agentName
      }
    } catch (error) {
      console.error("Error loading user info:", error)
      const agentName = localStorage.getItem("agentName") || "Agent"
      document.getElementById("agentName").textContent = agentName
      document.getElementById("agentNameHeader").textContent = agentName
    }
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

      const revenueInUGX = data.totalRevenue || 0 // Already in UGX from API
      document.getElementById("totalRevenue").innerHTML =
        `<span class="currency-ugx">${revenueInUGX.toLocaleString()} shs</span>`
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      document.getElementById("myMarkets").textContent = "0"
      document.getElementById("activeProducts").textContent = "0"
      document.getElementById("totalTransactions").textContent = "0"
      document.getElementById("totalRevenue").innerHTML = '<span class="currency-ugx">0 shs</span>'
    }
  }

  async loadMyMarkets() {
    try {
      console.log("[v0] Loading agent markets...")
      console.log("[v0] Token:", this.token ? "Present" : "Missing")

      const response = await fetch(`${this.apiUrl}/markets`, {
        headers: this.getAuthHeaders(),
      })

      console.log("[v0] Markets API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Markets API error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const markets = await response.json()
      console.log("[v0] Agent markets loaded:", markets.length)
      console.log("[v0] First market sample:", markets[0])

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

      this.updateProductMarketOptions(markets)
    } catch (error) {
      console.error("[v0] Error loading markets:", error)
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
      console.log("[v0] Loading agent products...")
      console.log("[v0] Token:", this.token ? "Present" : "Missing")

      const response = await fetch(`${this.apiUrl}/products`, {
        headers: this.getAuthHeaders(),
      })

      console.log("[v0] Products API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Products API error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const products = await response.json()
      console.log("[v0] Agent products loaded:", products.length)
      console.log("[v0] First product sample:", products[0])

      const productsTable = document.getElementById("productsTable")
      productsTable.innerHTML = ""

      if (products.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products added yet.</td></tr>'
        return
      }

      products.forEach((product) => {
        const row = document.createElement("tr")
        const sellingPriceUGX = Math.round(product.sellingPrice || 0).toLocaleString()
        const buyingPriceUGX = Math.round(product.buyingPrice || 0).toLocaleString()

        row.innerHTML = `
          <td><strong>${product.name}</strong></td>
          <td>${product.marketName}</td>
          <td><span class="currency-ugx">${sellingPriceUGX} shs</span></td>
          <td><span class="currency-ugx">${buyingPriceUGX} shs</span></td>
          <td>${product.stock} kg</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct('${product._id}')" title="Edit Product">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product._id}')" title="Delete Product">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `
        productsTable.appendChild(row)
      })
    } catch (error) {
      console.error("[v0] Error loading products:", error)
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
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("createMarketModal"))
      modal.hide()

      document.getElementById("createMarketForm").reset()

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
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("addProductModal"))
      modal.hide()

      document.getElementById("addProductForm").reset()

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
    const response = await fetch(`/api/markets?id=${marketId}`, {
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
    const response = await fetch(`/api/products?id=${productId}`, {
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

async function editProduct(productId) {
  try {
    const token = localStorage.getItem("agentToken")
    // Get all products and find the specific one
    const response = await fetch(`/api/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const products = await response.json()
      const product = products.find((p) => p._id === productId)

      if (!product) {
        alert("Product not found")
        return
      }

      document.getElementById("editProductId").value = product._id
      document.getElementById("editProductName").value = product.name
      document.getElementById("editProductMarket").value = product.marketId
      document.getElementById("editSellingPrice").value = Math.round(product.sellingPrice || 0)
      document.getElementById("editBuyingPrice").value = Math.round(product.buyingPrice || 0)
      document.getElementById("editStockQuantity").value = product.stock

      await dashboard.updateEditProductMarketOptions()
      document.getElementById("editProductMarket").value = product.marketId

      const modal = new window.bootstrap.Modal(document.getElementById("editProductModal"))
      modal.show()
    } else {
      alert("Error loading product details")
    }
  } catch (error) {
    console.error("Error loading product for edit:", error)
    alert("Error loading product details")
  }
}

async function updateProduct() {
  const productId = document.getElementById("editProductId").value
  const name = document.getElementById("editProductName").value
  const marketId = document.getElementById("editProductMarket").value
  const sellingPrice = Number.parseFloat(document.getElementById("editSellingPrice").value)
  const buyingPrice = Number.parseFloat(document.getElementById("editBuyingPrice").value)
  const stock = Number.parseFloat(document.getElementById("editStockQuantity").value)

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
    const response = await fetch(`/api/products?id=${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, marketId, sellingPrice, buyingPrice, stock }),
    })

    if (response.ok) {
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("editProductModal"))
      modal.hide()

      await dashboard.loadProducts()
      await dashboard.loadDashboardData()

      alert("Product updated successfully!")
    } else {
      const errorData = await response.json()
      alert(errorData.message || "Error updating product")
    }
  } catch (error) {
    console.error("Error updating product:", error)
    alert("Error updating product")
  }
}

async function editMarket(marketId) {
  try {
    const token = localStorage.getItem("agentToken")
    // Get all markets and find the specific one
    const response = await fetch(`/api/markets`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const markets = await response.json()
      const market = markets.find((m) => m._id === marketId)

      if (!market) {
        alert("Market not found")
        return
      }

      document.getElementById("editMarketId").value = market._id
      document.getElementById("editMarketName").value = market.name
      document.getElementById("editMarketLocation").value = market.location
      document.getElementById("editMarketDescription").value = market.description || ""

      const modal = new window.bootstrap.Modal(document.getElementById("editMarketModal"))
      modal.show()
    } else {
      alert("Error loading market details")
    }
  } catch (error) {
    console.error("Error loading market for edit:", error)
    alert("Error loading market details")
  }
}

async function updateMarket() {
  const marketId = document.getElementById("editMarketId").value
  const name = document.getElementById("editMarketName").value
  const location = document.getElementById("editMarketLocation").value
  const description = document.getElementById("editMarketDescription").value

  if (!name || !location) {
    alert("Please fill in required fields")
    return
  }

  try {
    const token = localStorage.getItem("agentToken")
    const response = await fetch(`/api/markets?id=${marketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, location, description }),
    })

    if (response.ok) {
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("editMarketModal"))
      modal.hide()

      await dashboard.loadMyMarkets()
      await dashboard.loadDashboardData()

      alert("Market updated successfully!")
    } else {
      const errorData = await response.json()
      alert(errorData.message || "Error updating market")
    }
  } catch (error) {
    console.error("Error updating market:", error)
    alert("Error updating market")
  }
}

function logout() {
  localStorage.removeItem("agentToken")
  localStorage.removeItem("agentName")
  localStorage.removeItem("agentEmail")
  window.location.href = "agent-login.html"
}

let dashboard
document.addEventListener("DOMContentLoaded", () => {
  window.bootstrap = window.bootstrap || {}
  dashboard = new AgentDashboard()

  dashboard.updateEditProductMarketOptions = async function () {
    try {
      const response = await fetch(`${this.apiUrl}/markets`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const markets = await response.json()
        const editProductMarketSelect = document.getElementById("editProductMarket")
        if (editProductMarketSelect) {
          editProductMarketSelect.innerHTML = '<option value="">Select a market...</option>'

          markets.forEach((market) => {
            const option = document.createElement("option")
            option.value = market._id
            option.textContent = `${market.name} - ${market.location}`
            editProductMarketSelect.appendChild(option)
          })
        }
      }
    } catch (error) {
      console.error("Error loading markets for edit form:", error)
    }
  }
})
