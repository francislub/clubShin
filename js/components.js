// Enhanced Reusable Components JavaScript

class ComponentLoader {
  static async loadHeader(userType = null) {
    try {
      const response = await fetch("components/header.html")
      const headerHTML = await response.text()

      // Insert header into page
      const headerContainer = document.getElementById("header-container")
      if (headerContainer) {
        headerContainer.innerHTML = headerHTML
      } else {
        // Fallback: insert at beginning of body
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = headerHTML
        document.body.insertBefore(tempDiv.firstElementChild, document.body.firstChild)
      }

      // Configure header based on user type
      this.configureHeader(userType)
      this.initializeHeaderFeatures()
    } catch (error) {
      console.error("Error loading header:", error)
      // Fallback: show a simple header
      this.createFallbackHeader()
    }
  }

  static async loadFooter() {
    try {
      const response = await fetch("components/footer.html")
      const footerHTML = await response.text()

      // Insert footer into page
      const footerContainer = document.getElementById("footer-container")
      if (footerContainer) {
        footerContainer.innerHTML = footerHTML
      } else {
        // Fallback: append to body
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = footerHTML
        document.body.appendChild(tempDiv.firstElementChild)
      }

      this.initializeFooterFeatures()
    } catch (error) {
      console.error("Error loading footer:", error)
      // Fallback: show a simple footer
      this.createFallbackFooter()
    }
  }

  static createFallbackHeader() {
    const headerContainer = document.getElementById("header-container")
    if (headerContainer) {
      headerContainer.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
          <div class="container">
            <a class="navbar-brand fw-bold" href="index.html">
              <i class="fas fa-seedling me-2"></i>AgriTech AI
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto">
                <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
                <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
                <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
              </ul>
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-sign-in-alt me-1"></i>Login
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="farmer-login.html">Farmer Portal</a></li>
                    <li><a class="dropdown-item" href="agent-login.html">Agent Portal</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      `
    }
  }

  static createFallbackFooter() {
    const footerContainer = document.getElementById("footer-container")
    if (footerContainer) {
      footerContainer.innerHTML = `
        <footer class="bg-dark text-white py-4">
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <h5><i class="fas fa-seedling me-2"></i>AgriTech AI</h5>
                <p>Smart farming solutions powered by AI</p>
              </div>
              <div class="col-md-6 text-md-end">
                <p>&copy; 2024 AgriTech AI. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      `
    }
  }

  static configureHeader(userType) {
    const navbar = document.getElementById("mainNavbar")
    const brandLink = document.getElementById("brandLink")
    const navLinks = document.getElementById("navLinks")
    const userDropdown = document.getElementById("userDropdown")
    const authButtons = document.getElementById("authButtons")
    const userName = document.getElementById("userName")
    const dropdownUserName = document.getElementById("dropdownUserName")
    const dropdownUserEmail = document.getElementById("dropdownUserEmail")
    const profileLink = document.getElementById("profileLink")
    const settingsLink = document.getElementById("settingsLink")
    const navbarSearch = document.getElementById("navbarSearch")
    const notificationDropdown = document.getElementById("notificationDropdown")
    const mobileBottomNav = document.getElementById("mobileBottomNav")

    if (userType === "farmer") {
      if (navbar) navbar.className = "navbar navbar-expand-lg navbar-dark bg-success sticky-top"
      if (brandLink) {
        brandLink.href = "farmer-dashboard.html"
        const brandName = brandLink.querySelector(".brand-name")
        if (brandName) brandName.textContent = "AgriTech AI - Farmer"
      }

      if (navLinks) {
        navLinks.innerHTML = `
          <li class="nav-item"><a class="nav-link" href="farmer-dashboard.html"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="farmer-markets.html"><i class="fas fa-store me-1"></i>Markets</a></li>
          <li class="nav-item"><a class="nav-link" href="farmer-transactions.html"><i class="fas fa-exchange-alt me-1"></i>Transactions</a></li>
        `
      }

      if (profileLink) profileLink.href = "farmer-profile.html"
      if (settingsLink) settingsLink.href = "farmer-settings.html"

      const farmerName = localStorage.getItem("farmerName") || "Farmer"
      const farmerEmail = localStorage.getItem("farmerEmail") || "farmer@example.com"

      if (userName) userName.textContent = farmerName
      if (dropdownUserName) dropdownUserName.textContent = farmerName
      if (dropdownUserEmail) dropdownUserEmail.textContent = farmerEmail
      const userRole = document.getElementById("userRole")
      if (userRole) userRole.textContent = "Farmer"

      if (userDropdown) userDropdown.style.display = "block"
      if (authButtons) authButtons.style.display = "none"
      if (navbarSearch) navbarSearch.classList.remove("d-none")
      if (notificationDropdown) notificationDropdown.classList.remove("d-none")
      if (mobileBottomNav) mobileBottomNav.style.display = "block"

      this.configureMobileNav("farmer")
    } else if (userType === "agent") {
      if (navbar) navbar.className = "navbar navbar-expand-lg navbar-dark bg-primary sticky-top"
      if (brandLink) {
        brandLink.href = "agent-dashboard.html"
        const brandName = brandLink.querySelector(".brand-name")
        if (brandName) brandName.textContent = "AgriTech AI - Agent"
      }

      if (navLinks) {
        navLinks.innerHTML = `
          <li class="nav-item"><a class="nav-link" href="agent-dashboard.html"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="agent-analytics.html"><i class="fas fa-chart-line me-1"></i>Analytics</a></li>
        `
      }

      if (profileLink) profileLink.href = "agent-profile.html"
      if (settingsLink) settingsLink.href = "agent-settings.html"

      const agentName = localStorage.getItem("agentName") || "Agent"
      const agentEmail = localStorage.getItem("agentEmail") || "agent@example.com"

      if (userName) userName.textContent = agentName
      if (dropdownUserName) dropdownUserName.textContent = agentName
      if (dropdownUserEmail) dropdownUserEmail.textContent = agentEmail
      const userRole = document.getElementById("userRole")
      if (userRole) userRole.textContent = "Agent"

      if (userDropdown) userDropdown.style.display = "block"
      if (authButtons) authButtons.style.display = "none"
      if (navbarSearch) navbarSearch.classList.remove("d-none")
      if (notificationDropdown) notificationDropdown.classList.remove("d-none")
      if (mobileBottomNav) mobileBottomNav.style.display = "block"

      this.configureMobileNav("agent")
    } else {
      // Public pages
      if (navbar) navbar.className = "navbar navbar-expand-lg navbar-dark bg-success sticky-top"
      if (brandLink) {
        brandLink.href = "index.html"
        const brandName = brandLink.querySelector(".brand-name")
        if (brandName) brandName.textContent = "AgriTech AI"
      }

      if (navLinks) {
        navLinks.innerHTML = `
          <li class="nav-item"><a class="nav-link" href="#features"><i class="fas fa-star me-1"></i>Features</a></li>
          <li class="nav-item"><a class="nav-link" href="#about"><i class="fas fa-info-circle me-1"></i>About</a></li>
          <li class="nav-item"><a class="nav-link" href="#pricing"><i class="fas fa-tag me-1"></i>Pricing</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact"><i class="fas fa-envelope me-1"></i>Contact</a></li>
        `
      }

      if (userDropdown) userDropdown.style.display = "none"
      if (authButtons) authButtons.style.display = "block"
      if (navbarSearch) navbarSearch.classList.add("d-none")
      if (notificationDropdown) notificationDropdown.classList.add("d-none")
      if (mobileBottomNav) mobileBottomNav.style.display = "none"
    }
  }

  static configureMobileNav(userType) {
    const mobileHome = document.getElementById("mobileHome")
    const mobileMarkets = document.getElementById("mobileMarkets")
    const mobilePredictions = document.getElementById("mobilePredictions")
    const mobileTransactions = document.getElementById("mobileTransactions")
    const mobileProfile = document.getElementById("mobileProfile")

    if (userType === "farmer") {
      if (mobileHome) mobileHome.onclick = () => (window.location.href = "farmer-dashboard.html")
      if (mobileMarkets) mobileMarkets.onclick = () => (window.location.href = "farmer-markets.html")
      if (mobilePredictions)
        mobilePredictions.onclick = () => (window.location.href = "farmer-dashboard.html#prediction")
      if (mobileTransactions) mobileTransactions.onclick = () => (window.location.href = "farmer-transactions.html")
      if (mobileProfile) mobileProfile.onclick = () => (window.location.href = "farmer-profile.html")
    } else if (userType === "agent") {
      if (mobileHome) mobileHome.onclick = () => (window.location.href = "agent-dashboard.html")
      if (mobileMarkets) mobileMarkets.onclick = () => (window.location.href = "agent-dashboard.html")
      if (mobilePredictions) mobilePredictions.onclick = () => (window.location.href = "agent-analytics.html")
      if (mobileTransactions) mobileTransactions.onclick = () => (window.location.href = "agent-dashboard.html")
      if (mobileProfile) mobileProfile.onclick = () => (window.location.href = "agent-profile.html")

      // Update icons for agent
      if (mobilePredictions) {
        const icon = mobilePredictions.querySelector("i")
        const text = mobilePredictions.querySelector("small")
        if (icon) icon.className = "fas fa-chart-line"
        if (text) text.textContent = "Analytics"
      }
    }

    // Highlight current page
    const currentPage = window.location.pathname.split("/").pop()
    document.querySelectorAll(".mobile-nav-item").forEach((item) => {
      item.classList.remove("active")
    })

    if (currentPage.includes("dashboard") && mobileHome) mobileHome.classList.add("active")
    else if (currentPage.includes("markets") && mobileMarkets) mobileMarkets.classList.add("active")
    else if ((currentPage.includes("predictions") || currentPage.includes("analytics")) && mobilePredictions)
      mobilePredictions.classList.add("active")
    else if (currentPage.includes("transactions") && mobileTransactions) mobileTransactions.classList.add("active")
    else if (currentPage.includes("profile") && mobileProfile) mobileProfile.classList.add("active")
  }

  static initializeHeaderFeatures() {
    // Navbar scroll effect
    window.addEventListener("scroll", () => {
      const navbar = document.getElementById("mainNavbar")
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled")
          navbar.style.backgroundColor = "rgba(40, 167, 69, 0.95)"
          navbar.style.backdropFilter = "blur(10px)"
        } else {
          navbar.classList.remove("scrolled")
          navbar.style.backgroundColor = ""
          navbar.style.backdropFilter = ""
        }
      }
    })

    // Global search functionality
    const globalSearch = document.getElementById("globalSearch")
    if (globalSearch) {
      globalSearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performGlobalSearch(globalSearch.value)
        }
      })
    }

    // Load notifications
    this.loadNotifications()

    // Initialize tooltips
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map((tooltipTriggerEl) => {
        if (window.bootstrap && window.bootstrap.Tooltip) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl)
        }
      })
    }, 100)
  }

  static initializeFooterFeatures() {
    // Newsletter subscription
    const newsletterForm = document.getElementById("newsletterForm")
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.subscribeNewsletter(e.target.querySelector('input[type="email"]').value)
      })
    }

    // Back to top button
    const backToTop = document.getElementById("backToTop")
    if (backToTop) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          backToTop.classList.add("show")
        } else {
          backToTop.classList.remove("show")
        }
      })
    }

    // Update current year
    const currentYear = document.getElementById("currentYear")
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear()
    }

    // Initialize tooltips for social links
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map((tooltipTriggerEl) => {
        if (window.bootstrap && window.bootstrap.Tooltip) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl)
        }
      })
    }, 100)
  }

  static async loadNotifications() {
    try {
      const token = localStorage.getItem("farmerToken") || localStorage.getItem("agentToken")
      if (!token) return

      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const notifications = await response.json()
      this.updateNotificationUI(notifications)
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  static updateNotificationUI(notifications) {
    const notificationCount = document.getElementById("notificationCount")
    const notificationList = document.getElementById("notificationList")

    if (!notificationList) return

    if (notifications.length === 0) {
      if (notificationCount) notificationCount.style.display = "none"
      notificationList.innerHTML = '<li class="dropdown-item text-center text-muted py-3">No new notifications</li>'
      return
    }

    // Update count
    const unreadCount = notifications.filter((n) => !n.read).length
    if (notificationCount) {
      if (unreadCount > 0) {
        notificationCount.textContent = unreadCount > 99 ? "99+" : unreadCount
        notificationCount.style.display = "block"
      } else {
        notificationCount.style.display = "none"
      }
    }

    // Update list
    notificationList.innerHTML = notifications
      .slice(0, 5)
      .map(
        (notification) => `
      <li class="notification-item ${!notification.read ? "unread" : ""}" onclick="markAsRead('${notification._id}')">
        <div class="d-flex">
          <div class="me-2">
            <i class="fas ${this.getNotificationIcon(notification.type)} text-${this.getNotificationColor(notification.type)}"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold small">${notification.title}</div>
            <div class="text-muted small">${notification.message}</div>
            <div class="notification-time">${this.formatTime(notification.createdAt)}</div>
          </div>
        </div>
      </li>
    `,
      )
      .join("")
  }

  static getNotificationIcon(type) {
    const icons = {
      price_alert: "fa-exclamation-triangle",
      market_update: "fa-store",
      prediction: "fa-crystal-ball",
      transaction: "fa-exchange-alt",
      system: "fa-cog",
    }
    return icons[type] || "fa-bell"
  }

  static getNotificationColor(type) {
    const colors = {
      price_alert: "warning",
      market_update: "info",
      prediction: "success",
      transaction: "primary",
      system: "secondary",
    }
    return colors[type] || "primary"
  }

  static formatTime(timestamp) {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now - time

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  static performGlobalSearch(query) {
    if (!query.trim()) return

    // Implement global search functionality
    console.log("Searching for:", query)
    // This would typically redirect to a search results page
    // window.location.href = `search.html?q=${encodeURIComponent(query)}`
  }

  static async subscribeNewsletter(email) {
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        alert("Successfully subscribed to newsletter!")
        const form = document.getElementById("newsletterForm")
        if (form) form.reset()
      } else {
        alert("Subscription failed. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      alert("Thank you for subscribing! We'll keep you updated with the latest agricultural insights.")
      const form = document.getElementById("newsletterForm")
      if (form) form.reset()
    }
  }
}

// Global functions
function logout() {
  const userType = localStorage.getItem("farmerToken") ? "farmer" : "agent"

  if (userType === "farmer") {
    localStorage.removeItem("farmerToken")
    localStorage.removeItem("farmerName")
    localStorage.removeItem("farmerEmail")
    window.location.href = "farmer-login.html"
  } else {
    localStorage.removeItem("agentToken")
    localStorage.removeItem("agentName")
    localStorage.removeItem("agentEmail")
    window.location.href = "agent-login.html"
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function markAsRead(notificationId) {
  // Mark notification as read
  fetch(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("farmerToken") || localStorage.getItem("agentToken")}`,
    },
  }).then(() => {
    ComponentLoader.loadNotifications()
  })
}

function markAllAsRead() {
  // Mark all notifications as read
  fetch("/api/notifications/mark-all-read", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("farmerToken") || localStorage.getItem("agentToken")}`,
    },
  }).then(() => {
    ComponentLoader.loadNotifications()
  })
}

// Auto-load components when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Add loading animation
  document.body.classList.add("component-loading")

  // Determine user type based on current page or stored tokens
  let userType = null

  if (window.location.pathname.includes("farmer-") && localStorage.getItem("farmerToken")) {
    userType = "farmer"
  } else if (window.location.pathname.includes("agent-") && localStorage.getItem("agentToken")) {
    userType = "agent"
  }

  // Load components
  Promise.all([ComponentLoader.loadHeader(userType), ComponentLoader.loadFooter()]).then(() => {
    // Remove loading animation
    setTimeout(() => {
      document.body.classList.remove("component-loading")
      document.body.classList.add("component-loaded")
    }, 100)
  })

  // Refresh notifications every 30 seconds for authenticated users
  if (userType) {
    setInterval(() => {
      ComponentLoader.loadNotifications()
    }, 30000)
  }
})
