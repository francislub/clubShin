// Agent Registration JavaScript

console.log("agent-register.js: Script loaded.")

document.getElementById("agentRegisterForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  console.log("agentRegisterForm: Submit event triggered.")

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

  console.log("agentRegisterForm: Collecting form data.")

  // Validation
  if (password !== confirmPassword) {
    alert("Passwords do not match")
    console.warn("agentRegisterForm: Password mismatch.")
    return
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long")
    console.warn("agentRegisterForm: Password too short.")
    return
  }

  try {
    const requestBody = JSON.stringify({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      password,
      company,
      businessLocation,
      businessType,
      licenseNumber,
    })
    console.log(`agentRegisterForm: Sending registration request to /api/auth/agent/register with body: ${requestBody}`)

    const response = await fetch("/api/auth/agent/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })

    console.log(`agentRegisterForm: Received response with status: ${response.status}`)
    const data = await response.json()
    console.log("agentRegisterForm: Response data:", data)

    if (response.ok) {
      console.log("agentRegisterForm: Registration successful.")
      alert("Registration successful! Please login to continue.")
      console.log("agentRegisterForm: Redirecting to agent-login.html")
      window.location.href = "agent-login.html"
    } else {
      console.error("agentRegisterForm: Registration failed.", data.message || "Unknown error.")
      alert(data.message || "Registration failed")
    }
  } catch (error) {
    console.error("agentRegisterForm: Network or unexpected error during registration:", error)
    alert("Registration failed. Please try again.")
  }
})
