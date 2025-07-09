import dotenv from "dotenv"
import fs from "fs"

dotenv.config()

console.log("🔍 Checking environment configuration...")

// Check if .env file exists
if (!fs.existsSync(".env")) {
  console.error("❌ .env file not found!")
  console.log("💡 Please create a .env file with the following content:")
  console.log(`
MONGODB_URI=mongodb://localhost:27017/agritech
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
`)
  process.exit(1)
}

// Check required environment variables
const required = ["MONGODB_URI", "JWT_SECRET"]
const missing = []

for (const key of required) {
  if (!process.env[key]) {
    missing.push(key)
  }
}

if (missing.length > 0) {
  console.error("❌ Missing required environment variables:")
  missing.forEach((key) => console.log(`   - ${key}`))
  console.log("\n💡 Please add these to your .env file")
  process.exit(1)
}

console.log("✅ Environment configuration looks good!")
console.log("📍 MongoDB URI:", process.env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@"))
console.log("🔑 JWT Secret:", process.env.JWT_SECRET ? "Set" : "Not set")
console.log("🚀 Ready to start the server!")
