// Farmer Profile JavaScript

class FarmerProfile {
  constructor() {
    this.apiUrl = "/api"
    this.init()
  }

  async init() {
    await this.loadProfile()
    await this.loadRecentActivity()
  }

  async loadProfile() {
    try {
      const token = localStorage.getItem("farmerToken")
      const response = await fetch(`${this.apiUrl}/farmer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const profile = await response.json()

      // Update profile information
      document.getElementById("farmerName").textContent = profile.name
      document.getElementById("farmerEmail").textContent = profile.email
      document.getElementById("farmLocation").textContent = profile.farmLocation
      document.getElementById("farmSize").textContent = `${profile.farmSize} acres`
      document.getElementById("totalPredictions").textContent = profile.totalPredictions || 0
      document.getElementById("moneySaved").textContent = `$${profile.moneySaved || 0}`
      document.getElementById("memberSince").textContent = new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })

      // Update detailed information
      document.getElementById("fullName").textContent = profile.name
      document.getElementById("email").textContent = profile.email
      document.getElementById("phone").textContent = profile.phone
      document.getElementById("location").textContent = profile.farmLocation
      document.getElementById("farmSizeDetail").textContent = `${profile.farmSize} acres`
      document.getElementById("primaryCrops").textContent = profile.primaryCrops
      document.getElementById("farmDescription").textContent = profile.farmDescription || "No description provided"

      // Populate edit form
      const nameParts = profile.name.split(" ")
      document.getElementById("editFirstName").value = nameParts[0] || ""
      document.getElementById("editLastName").value = nameParts.slice(1).join(" ") || ""
      document.getElementById("editPhone").value = profile.phone
      document.getElementById("editLocation").value = profile.farmLocation
      document.getElementById("editFarmSize").value = profile.farmSize
      document.getElementById("editPrimaryCrops").value = profile.primaryCrops
      document.getElementById("editFarmDescription").value = profile.farmDescription || ""
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  async loadRecentActivity() {
    try {
      const token = localStorage.getItem("farmerToken")
      const response = await fetch(`${this.apiUrl}/farmer/activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const activities = await response.json()
      const activityContainer = document.getElementById("recentActivity")

      if (activities.length === 0) {
        activityContainer.innerHTML = '<p class="text-muted">No recent activity</p>'
        return
      }

      activityContainer.innerHTML = activities
        .map(
          (activity) => `
        <div class="timeline-item mb-3">
          <div class="d-flex">
            <div class="timeline-icon me-3">
              <i class="fas ${this.getActivityIcon(activity.type)} text-success"></i>
            </div>
            <div>
              <h6 class="mb-1">${activity.title}</h6>
              <p class="text-muted mb-1">${activity.description}</p>
              <small class="text-muted">${new Date(activity.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        </div>
      `,
        )
        .join("")
    } catch (error) {
      console.error("Error loading activity:", error)
    }
  }

  getActivityIcon(type) {
    const icons = {
      prediction: "fa-crystal-ball",
      market_view: "fa-store",
      profile_update: "fa-user-edit",
      login: "fa-sign-in-alt",
    }
    return icons[type] || "fa-info-circle"
  }
}

async function updateProfile() {
  const firstName = document.getElementById("editFirstName").value
  const lastName = document.getElementById("editLastName").value
  const phone = document.getElementById("editPhone").value
  const location = document.getElementById("editLocation").value
  const farmSize = document.getElementById("editFarmSize").value
  const primaryCrops = document.getElementById("editPrimaryCrops").value
  const farmDescription = document.getElementById("editFarmDescription").value

  try {
    const token = localStorage.getItem("farmerToken")
    const response = await fetch("/api/farmer/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`,
        phone,
        farmLocation: location,
        farmSize: Number.parseInt(farmSize),
        primaryCrops,
        farmDescription,
      }),
    })

    if (response.ok) {
      // Close modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("editProfileModal"))
      modal.hide()

      // Reload profile
      await profile.loadProfile()
      alert("Profile updated successfully!")
    } else {
      alert("Error updating profile")
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    alert("Error updating profile")
  }
}

// Initialize profile when page loads
let profile
document.addEventListener("DOMContentLoaded", () => {
  window.bootstrap = window.bootstrap || {}
  profile = new FarmerProfile()
})
