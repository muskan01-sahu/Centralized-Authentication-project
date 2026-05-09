require("dotenv").config();
const connectDB = require("../config/db");
const Permission = require("../models/permission");
const Role = require("../models/role");
const User = require("../models/user");

const seed = async () => {
  try {
    await connectDB();
    console.log("\n🌱 Seeding database...\n");

    // ── 1. PERMISSIONS ───────────────────────────────────────────────────────
    console.log("Creating permissions...");
    const permsData = [
      { resource: "orders", action: "read" },
      { resource: "orders", action: "write" },
      { resource: "orders", action: "delete" },
      { resource: "reports", action: "read" },
      { resource: "users", action: "read" },
      { resource: "users", action: "write" },
      { resource: "users", action: "delete" },
    ];

    // Clear existing permissions
    await Permission.deleteMany({});
    const permissions = await Permission.insertMany(permsData);
    console.log(`✅ Created ${permissions.length} permissions`);

    // Build permission lookup
    const permMap = {};
    permissions.forEach(perm => {
      permMap[`${perm.resource}:${perm.action}`] = perm._id;
    });

    // ── 2. ROLES ──────────────────────────────────────────────────────────
    console.log("Creating roles...");
    
    // Clear existing roles
    await Role.deleteMany({});
    
    const adminRole = await Role.create({
      name: "admin",
      description: "Full access to all resources",
      permissions: Object.values(permMap), // All permissions
    });

    const managerRole = await Role.create({
      name: "manager",
      description: "Read/write orders and read reports",
      permissions: [
        permMap["orders:read"],
        permMap["orders:write"],
        permMap["reports:read"]
      ],
    });

    const userRole = await Role.create({
      name: "user",
      description: "Read orders only",
      permissions: [permMap["orders:read"]],
    });

    console.log("✅ Created roles: admin, manager, user");

    // ── 3. USERS ──────────────────────────────────────────────────────────
    console.log("Creating users...");
    
    // Clear existing users
    await User.deleteMany({});

    await User.create({
      email: "admin@example.com",
      password: "Admin@123",
      isActive: true,
      roles: [adminRole._id],
    });

    await User.create({
      email: "manager@example.com",
      password: "Manager@123",
      isActive: true,
      roles: [managerRole._id],
    });

    await User.create({
      email: "user@example.com",
      password: "User@1234",
      isActive: true,
      roles: [userRole._id],
    });

    await User.create({
      email: "disabled@example.com",
      password: "Disabled@123",
      isActive: false,
      roles: [userRole._id],
    });

    console.log("✅ Created 4 users\n");
    console.log("─────────────────────────────────────────");
    console.log("  📋 Test Credentials:");
    console.log("  admin@example.com    / Admin@123    → all permissions");
    console.log("  manager@example.com  / Manager@123  → orders:read/write, reports:read");
    console.log("  user@example.com     / User@1234    → orders:read only");
    console.log("  disabled@example.com / Disabled@123 → isActive: false (login blocked)");
    console.log("─────────────────────────────────────────\n");
    console.log("🎉 Seeding complete!");

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
  
  process.exit(0);
};

seed();
