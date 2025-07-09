// Agent Registration JavaScript

document.getElementById("agentRegisterForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const company = document.getElementById("company").value
  const businessLocation = document.getElementById("businessLocation").value
  const businessType = document.getElementById("businessType").value
  const licenseNumber = document.getElementById("licenseNumber").value

  // Validation
  if (password !== confirmPassword) {
    alert("Passwords do not match")
    return
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long")
    return
  }

  try {
    const response = await fetch("/api/auth/agent/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password,
        company,
        businessLocation,
        businessType,
        licenseNumber,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert("Registration successful! Please login to continue.")
      window.location.href = "agent-login.html"
    } else {
      alert(data.message || "Registration failed")
    }
  } catch (error) {
    console.error("Registration error:", error)
    alert("Registration failed. Please try again.")
  }
})
