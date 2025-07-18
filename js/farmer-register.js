// Farmer Registration JavaScript

document.getElementById("farmerRegisterForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const farmLocation = document.getElementById("farmLocation").value
  const farmSize = document.getElementById("farmSize").value
  const primaryCrops = document.getElementById("primaryCrops").value

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
    const response = await fetch("/api/auth/farmer/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password,
        farmLocation,
        farmSize: Number.parseInt(farmSize),
        primaryCrops,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert("Registration successful! Please login to continue.")
      window.location.href = "farmer-login.html"
    } else {
      alert(data.message || "Registration failed")
    }
  } catch (error) {
    console.error("Registration error:", error)
    alert("Registration failed. Please try again.")
  }
})
