// Enhanced Reusable Components JavaScript

class ComponentLoader {
  static async loadHeader(userType = null) {
    console.log(`ComponentLoader.loadHeader: Loading header for user type: ${userType || "public"}.`)
    try {
      const headerHTML = `<!-- Enhanced Agricultural Header with Specialized Dropdowns -->
<nav class="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm" id="mainNavbar">
<div class="container-fluid">
<!-- Brand -->
<a class="navbar-brand fw-bold d-flex align-items-center" href="index.html" id="brandLink">
  <i class="fas fa-seedling me-2 text-warning"></i>
  <span class="brand-name">AgriTech AI</span>
</a>

<!-- Mobile Toggle Button -->
<button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>

<!-- Navigation Content -->
<div class="collapse navbar-collapse" id="navbarNav">
  <!-- Main Navigation Links -->
  <ul class="navbar-nav me-auto" id="navLinks">
    <!-- Dashboard/Home -->
    <li class="nav-item">
      <a class="nav-link" href="farmer-dashboard.html">
        <i class="fas fa-tachometer-alt me-1"></i>Dashboard
      </a>
    </li>

    <!-- Pests & Diseases Dropdown -->
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="pestsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-bug me-1"></i>Pests & Diseases
      </a>
      <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="pestsDropdown">
        <li><h6 class="dropdown-header text-success"><i class="fas fa-microscope me-2"></i>Disease Management</h6></li>
        <li><a class="dropdown-item" href="https://legacypotatodoctor.vercel.app"><i class="fas fa-search me-2"></i>Disease Identification</a></li>
        <li><a class="dropdown-item" href="#treatment-solutions"><i class="fas fa-pills me-2"></i>Treatment Solutions</a></li>
        <li><a class="dropdown-item" href="#disease-prevention"><i class="fas fa-shield-alt me-2"></i>Prevention Guide</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-warning"><i class="fas fa-spider me-2"></i>Pest Control</h6></li>
        <li><a class="dropdown-item" href="#pest-detection"><i class="fas fa-eye me-2"></i>Pest Detection</a></li>
        <li><a class="dropdown-item" href="#control-methods"><i class="fas fa-spray-can me-2"></i>Control Methods</a></li>
        <li><a class="dropdown-item" href="#organic-solutions"><i class="fas fa-leaf me-2"></i>Organic Solutions</a></li>
      </ul>
    </li>

    <!-- Weather Forecasting Dropdown -->
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="weatherDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-cloud-sun me-1"></i>Weather
      </a>
      <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="weatherDropdown">
        <li><h6 class="dropdown-header text-info"><i class="fas fa-thermometer-half me-2"></i>Current Conditions</h6></li>
        <li><a class="dropdown-item" href="#live-weather"><i class="fas fa-broadcast-tower me-2"></i>Live Weather</a></li>
        <li><a class="dropdown-item" href="#temperature-humidity"><i class="fas fa-tint me-2"></i>Temperature & Humidity</a></li>
        <li><a class="dropdown-item" href="#rainfall-data"><i class="fas fa-cloud-rain me-2"></i>Rainfall Data</a></li>
        <li><a class="dropdown-item" href="#wind-conditions"><i class="fas fa-wind me-2"></i>Wind Conditions</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-primary"><i class="fas fa-calendar-alt me-2"></i>Forecasting</h6></li>
        <li><a class="dropdown-item" href="#seasonal-outlook"><i class="fas fa-calendar me-2"></i>Seasonal Outlook</a></li>
        <li><a class="dropdown-item" href="#storm-warnings"><i class="fas fa-exclamation-triangle me-2"></i>Storm Warnings</a></li>
      </ul>
    </li>

    <!-- Land Care Dropdown -->
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="landCareDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-mountain me-1"></i>Land Care
      </a>
      <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="landCareDropdown">
        <li><h6 class="dropdown-header text-brown"><i class="fas fa-seedling me-2"></i>Soil Management</h6></li>
        <li><a class="dropdown-item" href="#soil-testing"><i class="fas fa-vial me-2"></i>Soil Testing</a></li>
        <li><a class="dropdown-item" href="#ph-monitoring"><i class="fas fa-chart-line me-2"></i>pH Monitoring</a></li>
        <li><a class="dropdown-item" href="#soil-improvement"><i class="fas fa-arrow-up me-2"></i>Soil Improvement</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-blue"><i class="fas fa-tint me-2"></i>Water Management</h6></li>
        <li><a class="dropdown-item" href="#irrigation-planning"><i class="fas fa-water me-2"></i>Irrigation Planning</a></li>
        <li><a class="dropdown-item" href="#water-conservation"><i class="fas fa-recycle me-2"></i>Water Conservation</a></li>
        <li><a class="dropdown-item" href="#drainage-systems"><i class="fas fa-stream me-2"></i>Drainage Systems</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-green"><i class="fas fa-sync-alt me-2"></i>Sustainable Practices</h6></li>
        <li><a class="dropdown-item" href="#crop-rotation"><i class="fas fa-redo me-2"></i>Crop Rotation</a></li>
        <li><a class="dropdown-item" href="#cover-crops"><i class="fas fa-layer-group me-2"></i>Cover Crops</a></li>
        <li><a class="dropdown-item" href="#conservation-tillage"><i class="fas fa-tools me-2"></i>Conservation Tillage</a></li>
      </ul>
    </li>

    <!-- Markets -->
    <li class="nav-item">
      <a class="nav-link" href="markets.html">
        <i class="fas fa-store me-1"></i>Markets
      </a>
    </li>
  </ul>

  <!-- Right Side Navigation -->
  <ul class="navbar-nav align-items-center">
    <!-- Weather Widget (Small) -->
    <li class="nav-item d-none d-lg-block me-3">
      <div class="weather-widget bg-white bg-opacity-10 rounded px-2 py-1">
        <small class="text-white-50">
          <i class="fas fa-map-marker-alt me-1"></i>
          <span id="currentLocation">Your Location</span>
        </small>
        <div class="d-flex align-items-center">
          <i class="fas fa-sun text-warning me-2"></i>
          <span class="fw-bold" id="currentTemp">25°C</span>
          <small class="ms-2 text-white-50" id="currentCondition">Sunny</small>
        </div>
      </div>
    </li>

    <!-- Search -->
    <li class="nav-item me-2" id="navbarSearch">
      <div class="search-container">
        <div class="input-group">
          <input type="text" class="form-control form-control-sm bg-white bg-opacity-10 border-0 text-white" 
                 placeholder="Search..." id="globalSearch" style="min-width: 200px;">
          <button class="btn btn-outline-light btn-sm" type="button">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </li>

    <!-- Notifications -->
    <li class="nav-item dropdown me-2" id="notificationDropdown">
      <a class="nav-link position-relative" href="#" id="notificationsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-bell"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="notificationCount" style="display: none;">
          0
        </span>
      </a>
      <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0" style="width: 320px;" aria-labelledby="notificationsDropdown">
        <li class="dropdown-header d-flex justify-content-between align-items-center">
          <span><i class="fas fa-bell me-2"></i>Notifications</span>
          <button class="btn btn-sm btn-outline-primary" onclick="markAllAsRead()">Mark all read</button>
        </li>
        <li><hr class="dropdown-divider"></li>
        <div id="notificationList" style="max-height: 300px; overflow-y: auto;">
          <!-- Notifications will be loaded here -->
        </div>
      </ul>
    </li>

    <!-- User Dropdown -->
    <li class="nav-item dropdown" id="userDropdown" style="display: none;">
      <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdownToggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <div class="user-avatar me-2">
          <img src="/placeholder.svg?height=32&width=32" alt="User Avatar" class="rounded-circle" width="32" height="32">
        </div>
        <div class="d-none d-lg-block">
          <div class="fw-bold" id="userName">User Name</div>
          <small class="text-white-50" id="userRole">Role</small>
        </div>
      </a>
      <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0">
        <li class="dropdown-header">
          <div class="d-flex align-items-center">
            <img src="/placeholder.svg?height=40&width=40" alt="User Avatar" class="rounded-circle me-3" width="40" height="40">
            <div>
              <div class="fw-bold" id="dropdownUserName">User Name</div>
              <small class="text-muted" id="dropdownUserEmail">user@example.com</small>
            </div>
          </div>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="profileLink"><i class="fas fa-user me-2"></i>Profile</a></li>
        <li><a class="dropdown-item" href="#" id="settingsLink"><i class="fas fa-cog me-2"></i>Settings</a></li>
        <li><a class="dropdown-item" href="#"><i class="fas fa-question-circle me-2"></i>Help & Support</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
      </ul>
    </li>

    <!-- Auth Buttons (for non-authenticated users) -->
    <li class="nav-item dropdown" id="authButtons">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-sign-in-alt me-1"></i>Login
      </a>
      <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0">
        <li><a class="dropdown-item" href="farmer-login.html"><i class="fas fa-user-tie me-2"></i>Farmer Portal</a></li>
        <li><a class="dropdown-item" href="agent-login.html"><i class="fas fa-user-cog me-2"></i>Agent Portal</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="farmer-register.html"><i class="fas fa-user-plus me-2"></i>Register as Farmer</a></li>
        <li><a class="dropdown-item" href="agent-register.html"><i class="fas fa-user-plus me-2"></i>Register as Agent</a></li>
      </ul>
    </li>
  </ul>
</div>
</div>
</nav>

<!-- Mobile Bottom Navigation (for authenticated users) -->
<div class="mobile-bottom-nav d-lg-none" id="mobileBottomNav" style="display: none;">
<div class="container-fluid">
<div class="row text-center">
  <div class="col mobile-nav-item" id="mobileHome">
    <i class="fas fa-home"></i>
    <small>Home</small>
  </div>
  <div class="col mobile-nav-item" id="mobileMarkets">
    <i class="fas fa-store"></i>
    <small>Markets</small>
  </div>
  <div class="col mobile-nav-item" id="mobilePredictions">
    <i class="fas fa-chart-line"></i>
    <small>Predictions</small>
  </div>
  <div class="col mobile-nav-item" id="mobileTransactions">
    <i class="fas fa-exchange-alt"></i>
    <small>Transactions</small>
  </div>
  <div class="col mobile-nav-item" id="mobileProfile">
    <i class="fas fa-user"></i>
    <small>Profile</small>
  </div>
</div>
</div>
</div>`

      const headerContainer = document.getElementById("header-container")
      if (headerContainer) {
        headerContainer.innerHTML = headerHTML
        console.log("ComponentLoader.loadHeader: Header inserted into #header-container.")
      } else {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = headerHTML
        document.body.insertBefore(tempDiv.firstElementChild, document.body.firstChild)
        console.log("ComponentLoader.loadHeader: Header prepended to body (no #header-container).")
      }

      this.configureHeader(userType)
      this.initializeHeaderFeatures()
      console.log("ComponentLoader.loadHeader: Header loaded and configured.")
    } catch (error) {
      console.error("ComponentLoader.loadHeader: Error loading header:", error)
    }
  }

  static async loadFooter() {
    console.log("ComponentLoader.loadFooter: Loading footer.")
    try {
      const response = await fetch("components/footer.html")
      const footerHTML = await response.text()
      console.log("ComponentLoader.loadFooter: Footer HTML fetched.")

      const footerContainer = document.getElementById("footer-container")
      if (footerContainer) {
        footerContainer.innerHTML = footerHTML
        console.log("ComponentLoader.loadFooter: Footer inserted into #footer-container.")
      } else {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = footerHTML
        document.body.appendChild(tempDiv.firstElementChild)
        console.log("ComponentLoader.loadFooter: Footer appended to body (no #footer-container).")
      }

      this.initializeFooterFeatures()
      console.log("ComponentLoader.loadFooter: Footer loaded and configured.")
    } catch (error) {
      console.error("ComponentLoader.loadFooter: Error loading footer:", error)
      this.createFallbackFooter()
      console.log("ComponentLoader.loadFooter: Fallback footer created due to error.")
    }
  }

  static createFallbackFooter() {
    console.log("ComponentLoader.createFallbackFooter: Creating fallback footer.")
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
          <p>&copy; 2025 AgriTech AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
`
      console.log("ComponentLoader.createFallbackFooter: Fallback footer HTML injected.")
    }
  }

  static configureHeader(userType) {
    console.log(`ComponentLoader.configureHeader: Configuring header for user type: ${userType}.`)
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
      console.log("ComponentLoader.configureHeader: Applying farmer-specific header configurations.")
      if (navbar) navbar.className = "navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm"
      if (brandLink) {
        brandLink.href = "farmer-dashboard.html"
        const brandName = brandLink.querySelector(".brand-name")
        if (brandName) brandName.textContent = "AgriTech AI - Farmer"
      }

      if (navLinks) {
        const dashboardLink = navLinks.querySelector('a[href="farmer-dashboard.html"]')
        if (dashboardLink) dashboardLink.href = "farmer-dashboard.html"

        const marketsLink = navLinks.querySelector('a[href="markets.html"]')
        if (marketsLink) marketsLink.href = "markets.html"
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
      console.log("ComponentLoader.configureHeader: Applying agent-specific header configurations.")
      if (navbar) navbar.className = "navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm"
      if (brandLink) {
        brandLink.href = "agent-dashboard.html"
        const brandName = brandLink.querySelector(".brand-name")
        if (brandName) brandName.textContent = "AgriTech AI - Agent"
      }

      if (navLinks) {
        const dashboardLink = navLinks.querySelector('a[href="farmer-dashboard.html"]')
        if (dashboardLink) {
          dashboardLink.href = "agent-dashboard.html"
          dashboardLink.innerHTML = '<i class="fas fa-tachometer-alt me-1"></i>Dashboard'
        }

        const marketsLink = navLinks.querySelector('a[href="markets.html"]')
        if (marketsLink) {
          marketsLink.href = "agent-analytics.html"
          marketsLink.innerHTML = '<i class="fas fa-chart-line me-1"></i>Analytics'
        }
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
      console.log("ComponentLoader.configureHeader: Applying public (non-authenticated) header configurations.")
      if (navbar) navbar.className = "navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm"
      if (brandLink) {
        brandLink.href = "index.html"
        const brandName = brandLink.querySelector(".brand-name")
        if (brandName) brandName.textContent = "AgriTech AI"
      }

      if (navLinks) {
        navLinks.innerHTML = `
    <!-- Dashboard/Home -->
    <li class="nav-item">
      <a class="nav-link" href="farmer-dashboard.html">
        <i class="fas fa-tachometer-alt me-1"></i>Dashboard
      </a>
    </li>

    <!-- Pests & Diseases Dropdown -->
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="pestsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-bug me-1"></i>Pests & Diseases
      </a>
      <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="pestsDropdown">
        <li><h6 class="dropdown-header text-success"><i class="fas fa-microscope me-2"></i>Disease Management</h6></li>
        <li><a class="dropdown-item" href="https://legacypotatodoctor.vercel.app"><i class="fas fa-search me-2"></i>Disease Identification</a></li>
        <li><a class="dropdown-item" href="treatment-solutions.html"><i class="fas fa-pills me-2"></i>Treatment Solutions</a></li>
        <li><a class="dropdown-item" href="disease-prevention.html"><i class="fas fa-shield-alt me-2"></i>Prevention Guide</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-warning"><i class="fas fa-spider me-2"></i>Pest Control</h6></li>
        <li><a class="dropdown-item" href="pest-detection.html"><i class="fas fa-eye me-2"></i>Pest Detection</a></li>
        <li><a class="dropdown-item" href="control-methods.html"><i class="fas fa-spray-can me-2"></i>Control Methods</a></li>
        <li><a class="dropdown-item" href="organic-solutions.html"><i class="fas fa-leaf me-2"></i>Organic Solutions</a></li>
      </ul>
    </li>

    <!-- Weather Forecasting Dropdown -->
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="weatherDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-cloud-sun me-1"></i>Weather
      </a>
      <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="weatherDropdown">
        <li><h6 class="dropdown-header text-info"><i class="fas fa-thermometer-half me-2"></i>Current Conditions</h6></li>
        <li><a class="dropdown-item" href="live-weather.html"><i class="fas fa-broadcast-tower me-2"></i>Live Weather</a></li>
        <li><a class="dropdown-item" href="temperature-humidity.html"><i class="fas fa-tint me-2"></i>Temperature & Humidity</a></li>
        <li><a class="dropdown-item" href="wind-conditions.html"><i class="fas fa-wind me-2"></i>Wind Conditions</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-primary"><i class="fas fa-calendar-alt me-2"></i>Forecasting</h6></li>
        <li><a class="dropdown-item" href="seasonal-outlook.html"><i class="fas fa-calendar me-2"></i>Seasonal Outlook</a></li>
        <li><a class="dropdown-item" href="storm-warnings.html"><i class="fas fa-exclamation-triangle me-2"></i>Storm Warnings</a></li>
      </ul>
    </li>

    <!-- Land Care Dropdown -->
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="landCareDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-mountain me-1"></i>Land Care
      </a>
      <ul class="dropdown-menu shadow-lg border-0" aria-labelledby="landCareDropdown">
        <li><h6 class="dropdown-header text-brown"><i class="fas fa-seedling me-2"></i>Soil Management</h6></li>
        <li><a class="dropdown-item" href="soil-testing.html"><i class="fas fa-vial me-2"></i>Soil Testing</a></li>
        <li><a class="dropdown-item" href="ph-monitoring.html"><i class="fas fa-chart-line me-2"></i>pH Monitoring</a></li>
        <li><a class="dropdown-item" href="soil-improvement.html"><i class="fas fa-arrow-up me-2"></i>Soil Improvement</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-blue"><i class="fas fa-tint me-2"></i>Water Management</h6></li>
        <li><a class="dropdown-item" href="irrigation-planning.html"><i class="fas fa-water me-2"></i>Irrigation Planning</a></li>
        <li><a class="dropdown-item" href="water-conservation.html"><i class="fas fa-recycle me-2"></i>Water Conservation</a></li>
        <li><a class="dropdown-item" href="drainage-systems.html"><i class="fas fa-stream me-2"></i>Drainage Systems</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><h6 class="dropdown-header text-green"><i class="fas fa-sync-alt me-2"></i>Sustainable Practices</h6></li>
        <li><a class="dropdown-item" href="crop-rotation.html"><i class="fas fa-redo me-2"></i>Crop Rotation</a></li>
        <li><a class="dropdown-item" href="cover-crops.html"><i class="fas fa-layer-group me-2"></i>Cover Crops</a></li>
        <li><a class="dropdown-item" href="conservation-tillage.html"><i class="fas fa-tools me-2"></i>Conservation Tillage</a></li>
      </ul>
    </li>

    <!-- team -->
    <li class="nav-item">
      <a class="nav-link" href="team.html">
        <i class="fas fa-tachometer-alt me-1"></i>Club Members
      </a>
    </li>


    <!-- Markets -->
    <li class="nav-item">
      <a class="nav-link" href="markets.html">
        <i class="fas fa-store me-1"></i>Markets
      </a>
    </li>
  `
      }

      if (userDropdown) userDropdown.style.display = "none"
      if (authButtons) authButtons.style.display = "block"
      if (navbarSearch) navbarSearch.classList.add("d-none")
      if (notificationDropdown) notificationDropdown.classList.add("d-none")
      if (mobileBottomNav) mobileBottomNav.style.display = "none"
    }

    this.loadCurrentWeather()
    console.log("ComponentLoader.configureHeader: Header configuration complete.")
  }

  static configureMobileNav(userType) {
    console.log(`ComponentLoader.configureMobileNav: Configuring mobile navigation for user type: ${userType}.`)
    const mobileHome = document.getElementById("mobileHome")
    const mobileMarkets = document.getElementById("mobileMarkets")
    const mobilePredictions = document.getElementById("mobilePredictions")
    const mobileTransactions = document.getElementById("mobileTransactions")
    const mobileProfile = document.getElementById("mobileProfile")

    if (userType === "farmer") {
      console.log("ComponentLoader.configureMobileNav: Applying farmer-specific mobile nav links.")
      if (mobileHome) mobileHome.onclick = () => (window.location.href = "farmer-dashboard.html")
      if (mobileMarkets) mobileMarkets.onclick = () => (window.location.href = "farmer-markets.html")
      if (mobileMarkets) mobileMarkets.onclick = () => (window.location.href = "markets.html")
      if (mobilePredictions)
        mobilePredictions.onclick = () => (window.location.href = "farmer-dashboard.html#prediction")
      if (mobileTransactions) mobileTransactions.onclick = () => (window.location.href = "farmer-transactions.html")
      if (mobileProfile) mobileProfile.onclick = () => (window.location.href = "farmer-profile.html")
    } else if (userType === "agent") {
      console.log("ComponentLoader.configureMobileNav: Applying agent-specific mobile nav links.")
      if (mobileHome) mobileHome.onclick = () => (window.location.href = "agent-dashboard.html")
      if (mobileMarkets) mobileMarkets.onclick = () => (window.location.href = "agent-dashboard.html")
      if (mobilePredictions) mobilePredictions.onclick = () => (window.location.href = "agent-analytics.html")
      if (mobileTransactions) mobileTransactions.onclick = () => (window.location.href = "agent-dashboard.html")
      if (mobileProfile) mobileProfile.onclick = () => (window.location.href = "agent-profile.html")

      if (mobilePredictions) {
        const icon = mobilePredictions.querySelector("i")
        const text = mobilePredictions.querySelector("small")
        if (icon) icon.className = "fas fa-chart-line"
        if (text) text.textContent = "Analytics"
      }
    }

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
    console.log("ComponentLoader.configureMobileNav: Mobile navigation configured and active link highlighted.")
  }

  static initializeHeaderFeatures() {
    console.log("ComponentLoader.initializeHeaderFeatures: Initializing header interactive features.")
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
    console.log("ComponentLoader.initializeHeaderFeatures: Navbar scroll effect added.")

    const globalSearch = document.getElementById("globalSearch")
    if (globalSearch) {
      globalSearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          console.log("globalSearch: Enter key pressed. Performing global search.")
          this.performGlobalSearch(globalSearch.value)
        }
      })
    }
    console.log("ComponentLoader.initializeHeaderFeatures: Global search listener added.")

    this.loadNotifications()
    console.log("ComponentLoader.initializeHeaderFeatures: Notifications loaded.")

    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map((tooltipTriggerEl) => {
        if (window.bootstrap && window.bootstrap.Tooltip) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl)
        } else {
          console.warn("ComponentLoader.initializeHeaderFeatures: Bootstrap Tooltip not available.")
        }
      })
      console.log("ComponentLoader.initializeHeaderFeatures: Tooltips initialized.")
    }, 100)
    console.log("ComponentLoader.initializeHeaderFeatures: Header features initialized.")
  }

  static initializeFooterFeatures() {
    console.log("ComponentLoader.initializeFooterFeatures: Initializing footer interactive features.")
    const newsletterForm = document.getElementById("newsletterForm")
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log("newsletterForm: Submit event triggered. Subscribing to newsletter.")
        this.subscribeNewsletter(e.target.querySelector('input[type="email"]').value)
      })
    }
    console.log("ComponentLoader.initializeFooterFeatures: Newsletter form listener added.")

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
    console.log("ComponentLoader.initializeFooterFeatures: Back to top button listener added.")

    const currentYear = document.getElementById("currentYear")
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear()
    }
    console.log("ComponentLoader.initializeFooterFeatures: Current year updated.")

    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map((tooltipTriggerEl) => {
        if (window.bootstrap && window.bootstrap.Tooltip) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl)
        } else {
          console.warn("ComponentLoader.initializeFooterFeatures: Bootstrap Tooltip not available.")
        }
      })
      console.log("ComponentLoader.initializeFooterFeatures: Footer tooltips initialized.")
    }, 100)
    console.log("ComponentLoader.initializeFooterFeatures: Footer features initialized.")
  }

  static async loadCurrentWeather() {
    console.log("ComponentLoader.loadCurrentWeather: Loading current weather data (mocked).")
    try {
      const weatherData = {
        location: "Farm Location",
        temperature: "25°C",
        condition: "Sunny",
        icon: "fas fa-sun",
      }
      console.log("ComponentLoader.loadCurrentWeather: Mock weather data:", weatherData)

      const currentLocation = document.getElementById("currentLocation")
      const currentTemp = document.getElementById("currentTemp")
      const currentCondition = document.getElementById("currentCondition")

      if (currentLocation) currentLocation.textContent = weatherData.location
      if (currentTemp) currentTemp.textContent = weatherData.temperature
      if (currentCondition) currentCondition.textContent = weatherData.condition
      console.log("ComponentLoader.loadCurrentWeather: Weather widget updated.")
    } catch (error) {
      console.error("ComponentLoader.loadCurrentWeather: Error loading weather:", error)
    }
  }

  static async loadNotifications() {
    console.log("ComponentLoader.loadNotifications: Attempting to load notifications.")
    try {
      const token = localStorage.getItem("farmerToken") || localStorage.getItem("agentToken")
      if (!token) {
        console.warn("ComponentLoader.loadNotifications: No user token found. Skipping notification load.")
        return
      }
      console.log(
        `ComponentLoader.loadNotifications: Fetching from /api/notifications with token: ${token.substring(0, 10)}...`,
      )

      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(`ComponentLoader.loadNotifications: Response Status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error("ComponentLoader.loadNotifications: Failed to fetch notifications.", errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`)
      }

      const notifications = await response.json()
      console.log("ComponentLoader.loadNotifications: Notifications received:", notifications.length, notifications)
      this.updateNotificationUI(notifications)
    } catch (error) {
      console.error("ComponentLoader.loadNotifications: Error loading notifications:", error)
    }
  }

  static updateNotificationUI(notifications) {
    console.log("ComponentLoader.updateNotificationUI: Updating notification display.")
    const notificationCount = document.getElementById("notificationCount")
    const notificationList = document.getElementById("notificationList")

    if (!notificationList) {
      console.warn("ComponentLoader.updateNotificationUI: Notification list element not found.")
      return
    }

    if (notifications.length === 0) {
      if (notificationCount) notificationCount.style.display = "none"
      notificationList.innerHTML = '<li class="dropdown-item text-center text-muted py-3">No new notifications</li>'
      console.log("ComponentLoader.updateNotificationUI: No notifications, displaying empty message.")
      return
    }

    const unreadCount = notifications.filter((n) => !n.read).length
    if (notificationCount) {
      if (unreadCount > 0) {
        notificationCount.textContent = unreadCount > 99 ? "99+" : unreadCount
        notificationCount.style.display = "block"
      } else {
        notificationCount.style.display = "none"
      }
      console.log(`ComponentLoader.updateNotificationUI: Unread notification count: ${unreadCount}`)
    }

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
    console.log("ComponentLoader.updateNotificationUI: Notification list rendered.")
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
    console.log(`ComponentLoader.performGlobalSearch: Performing global search for query: "${query}".`)
    if (!query.trim()) {
      console.warn("ComponentLoader.performGlobalSearch: Search query is empty.")
      return
    }
    console.log("ComponentLoader.performGlobalSearch: This would typically redirect to a search results page.")
    // window.location.href = `search.html?q=${encodeURIComponent(query)}`
  }

  static async subscribeNewsletter(email) {
    console.log(`ComponentLoader.subscribeNewsletter: Attempting to subscribe email: ${email} to newsletter.`)
    try {
      const requestBody = JSON.stringify({ email })
      console.log(
        `ComponentLoader.subscribeNewsletter: Sending POST request to /api/newsletter/subscribe with body: ${requestBody}`,
      )
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      })

      console.log(`ComponentLoader.subscribeNewsletter: Received response with status: ${response.status}`)
      if (response.ok) {
        console.log("ComponentLoader.subscribeNewsletter: Successfully subscribed to newsletter!")
        alert("Successfully subscribed to newsletter!")
        const form = document.getElementById("newsletterForm")
        if (form) form.reset()
      } else {
        const errorData = await response.json()
        console.error("ComponentLoader.subscribeNewsletter: Subscription failed.", errorData)
        alert("Subscription failed. Please try again.")
      }
    } catch (error) {
      console.error(
        "ComponentLoader.subscribeNewsletter: Network or unexpected error during newsletter subscription:",
        error,
      )
      alert("Thank you for subscribing! We'll keep you updated with the latest agricultural insights.") // Fallback message
      const form = document.getElementById("newsletterForm")
      if (form) form.reset()
    }
  }
}

// Global functions
function logout() {
  console.log("Global function logout: Initiating logout process.")
  const userType = localStorage.getItem("farmerToken") ? "farmer" : localStorage.getItem("agentToken") ? "agent" : null

  if (userType === "farmer") {
    console.log("Global function logout: Logging out farmer.")
    localStorage.removeItem("farmerToken")
    localStorage.removeItem("farmerName")
    localStorage.removeItem("farmerEmail")
    window.location.href = "farmer-login.html"
  } else if (userType === "agent") {
    console.log("Global function logout: Logging out agent.")
    localStorage.removeItem("agentToken")
    localStorage.removeItem("agentName")
    localStorage.removeItem("agentEmail")
    window.location.href = "agent-login.html"
  } else {
    console.warn("Global function logout: No user token found, cannot determine user type for logout.")
    // Redirect to home or login page if no token is found
    window.location.href = "index.html"
  }
  console.log("Global function logout: Redirecting after logout.")
}

function scrollToTop() {
  console.log("Global function scrollToTop: Scrolling to top of the page.")
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function markAsRead(notificationId) {
  console.log(`Global function markAsRead: Marking notification ID ${notificationId} as read.`)
  const token = localStorage.getItem("farmerToken") || localStorage.getItem("agentToken")
  if (!token) {
    console.warn("Global function markAsRead: No token found, cannot mark notification as read.")
    return
  }
  fetch(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log(`Global function markAsRead: Response status for marking read: ${response.status}`)
      if (!response.ok) {
        console.error("Global function markAsRead: Failed to mark notification as read.")
      }
      ComponentLoader.loadNotifications()
    })
    .catch((error) => {
      console.error("Global function markAsRead: Error marking notification as read:", error)
    })
}

function markAllAsRead() {
  console.log("Global function markAllAsRead: Marking all notifications as read.")
  const token = localStorage.getItem("farmerToken") || localStorage.getItem("agentToken")
  if (!token) {
    console.warn("Global function markAllAsRead: No token found, cannot mark all notifications as read.")
    return
  }
  fetch("/api/notifications/mark-all-read", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log(`Global function markAllAsRead: Response status for marking all read: ${response.status}`)
      if (!response.ok) {
        console.error("Global function markAllAsRead: Failed to mark all notifications as read.")
      }
      ComponentLoader.loadNotifications()
    })
    .catch((error) => {
      console.error("Global function markAllAsRead: Error marking all notifications as read:", error)
    })
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded: Starting component loading process.")
  document.body.classList.add("component-loading")

  let userType = null
  if (window.location.pathname.includes("farmer-") && localStorage.getItem("farmerToken")) {
    userType = "farmer"
  } else if (window.location.pathname.includes("agent-") && localStorage.getItem("agentToken")) {
    userType = "agent"
  }
  console.log(`DOMContentLoaded: Determined user type: ${userType || "public"}.`)

  Promise.all([ComponentLoader.loadHeader(userType), ComponentLoader.loadFooter()])
    .then(() => {
      console.log("DOMContentLoaded: All components loaded successfully.")
      setTimeout(() => {
        document.body.classList.remove("component-loading")
        document.body.classList.add("component-loaded")
        console.log("DOMContentLoaded: Component loading animation removed.")
      }, 100)
    })
    .catch((error) => {
      console.error("DOMContentLoaded: Error loading components:", error)
      document.body.classList.remove("component-loading")
      // Potentially add an error state to the UI
    })

  if (userType) {
    console.log("DOMContentLoaded: User is authenticated, setting up notification refresh interval.")
    setInterval(() => {
      ComponentLoader.loadNotifications()
    }, 30000) // Refresh every 30 seconds
  }
})
