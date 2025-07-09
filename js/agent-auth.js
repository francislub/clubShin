// Agent Authentication JavaScript

document.getElementById("agentLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Show loading state
  const submitButton = e.target.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...'
  submitButton.disabled = true

  try {
    console.log("Attempting agent login for:", email)

    const response = await fetch("/api/auth/agent/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    console.log("Agent login response status:", response.status)
    const data = await response.json()
    console.log("Agent login response data:", data)

    if (response.ok) {
      localStorage.setItem("agentToken", data.token)
      localStorage.setItem("agentName", data.name)
      localStorage.setItem("agentEmail", data.email)

      alert("Login successful!")
      window.location.href = "agent-dashboard.html"
    } else {
      alert(data.message || "Login failed")
    }
  } catch (error) {
    console.error("Agent login error:", error)
    alert("Login failed. Please check your connection and try again.")
  } finally {
    // Reset button state
    submitButton.innerHTML = originalText
    submitButton.disabled = false
  }
})

// Check if already logged in
if (localStorage.getItem("agentToken")) {
  window.location.href = "agent-dashboard.html"
}
