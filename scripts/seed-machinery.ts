/**
 * Seed demo machinery data for testing the booking system.
 * Run with: npx ts-node scripts/seed-machinery.ts
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedMachinery() {
  console.log("🌱 Seeding machinery data...")

  try {
    // Get the first user (operator/owner)
    const { data: users } = await supabase.auth.admin.listUsers()
    if (!users || users.users.length === 0) {
      console.error("No users found. Please create a user first.")
      process.exit(1)
    }

    const ownerId = users.users[0].id
    console.log(`Using owner ID: ${ownerId}`)

    // Define sample machines with actual column names from machines table
    const machines = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Tractor - MF 241",
        owner_id: ownerId,
        machine_status: "active",
        status: "active",
        brand: "Mahindra",
        model: "MF 241",
        manufacture_year: 2022,
        power_hp: 35,
        description: "Reliable MF 241 tractor for general farm work, plowing, and transport",
        specifications: {
          features: ["4WD", "35 HP", "Hydraulic lift", "Good fuel efficiency"],
          warranty: "3-year warranty on major components. Free maintenance for first year.",
          hourly_rate: 500,
          daily_rate: 3500,
        },
        service_radius_km: 100,
        operator_included: false,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Combine Harvester - John Deere",
        owner_id: ownerId,
        machine_status: "active",
        status: "active",
        brand: "John Deere",
        model: "CH 100",
        manufacture_year: 2021,
        power_hp: 80,
        description: "Modern combine harvester for efficient grain harvesting",
        specifications: {
          features: ["Auto-threshing", "GPS guidance", "Large hopper", "Fuel efficient"],
          warranty: "2-year warranty. Technical support team available 24/7.",
          hourly_rate: 1200,
          daily_rate: 8000,
        },
        service_radius_km: 200,
        operator_included: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Sprayer - Battery Operated",
        owner_id: ownerId,
        machine_status: "active",
        status: "active",
        brand: "STIHL",
        model: "SR 450",
        manufacture_year: 2023,
        power_hp: 1,
        description: "Eco-friendly battery-operated sprayer for pesticide and fertilizer application",
        specifications: {
          features: ["20 liter capacity", "8-10 hour battery", "Adjustable nozzle"],
          warranty: "1-year warranty on battery and motor. Spare parts available.",
          hourly_rate: 100,
          daily_rate: 600,
        },
        service_radius_km: 50,
        operator_included: false,
      },
    ]

    // Upsert machines
    for (const machine of machines) {
      const { error } = await supabase.from("machines").upsert(machine, {
        onConflict: "id",
      })
      if (error) {
        console.error(`Error upserting machine ${machine.id}:`, error)
      } else {
        console.log(`✓ Seeded machine: ${machine.name}`)
      }
    }



    console.log("\n✅ Machinery data seeded successfully!")
    console.log("\nYou can now:")
    console.log("  1. Visit /farmer/machinery to browse machines")
    console.log("  2. Click on a machine to view details")
    console.log("  3. Click 'Book This Machine' to create a booking")
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedMachinery()
