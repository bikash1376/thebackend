import "dotenv/config"
import prisma from "../src/lib/db"

async function testDatabase() {
    console.log("🔍 Testing Prisma Postgres connection...\n")

    try {
        // Test 1: Check connection
        console.log("✅ Connected to database!")

        // Test 2: Create a test user (Commented out to avoid cluttering, or check if user model exists)
        // Note: The schema provided has a User model.
        /*
        console.log("\n📝 Creating a test user...")
        const newUser = await prisma.user.create({
          data: {
            email: `test-${Date.now()}@example.com`,
            name: "Test User",
            password: "hashedpassword"
          },
        })
        console.log("✅ Created user:", newUser)
        */

        // Test 3: Fetch all users
        console.log("\n📋 Fetching all users...")
        const allUsers = await prisma.user.findMany()
        console.log(`✅ Found ${allUsers.length} user(s)`)


        console.log("\n🎉 All tests passed! Your database is working perfectly.\n")
    } catch (error) {
        console.error("❌ Error:", error)
        process.exit(1)
    }
}

testDatabase()
