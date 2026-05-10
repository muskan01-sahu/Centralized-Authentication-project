require("dotenv").config();
const connectDB = require("../config/db");
const Permission = require("../models/permission");
const Role = require("../models/role");
const User = require("../models/user");

const seed = async () => {
  await connectDB();
  console.log("\n Seeding database...\n");

  // Clear existing
  await Permission.deleteMany({});
  await Role.deleteMany({});
  await User.deleteMany({});

  // PERMISSIONS
  const permsSeed = await Permission.insertMany([
    { resource: "orders",  action: "read"   },
    { resource: "orders",  action: "write"  },
    { resource: "orders",  action: "delete" },
    { resource: "reports", action: "read"   },
    { resource: "users",   action: "read"   },
    { resource: "users",   action: "write"  },
    { resource: "users",   action: "delete" },
  ]);

  // Build lookup map: "orders:read" -> ObjectId
  const p = {};
  permsSeed.forEach((perm) => {
    p[`${perm.resource}:${perm.action}`] = perm._id;
  });

  console.log(` Created ${permsSeed.length} permissions`);

  // ROLES 
  // admin  → all permissions
  // manager → orders:read, orders:write, reports:read
  // user   → orders:read only

  const adminRole = await Role.create({
    name: "admin",
    description: "Full access to all resources",
    permissions: permsSeed.map((p) => p._id),
  });

  const managerRole = await Role.create({
    name: "manager",
    description: "Read/write orders and read reports",
    permissions: [p["orders:read"], p["orders:write"], p["reports:read"]],
  });

  const userRole = await Role.create({
    name: "user",
    description: "Read orders only",
    permissions: [p["orders:read"]],
  });

  console.log("✅ Created roles: admin, manager, user");

  // USERS 
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

  // Disabled user 
  await User.create({
    email: "disabled@example.com",
    password: "Disabled@123",
    isActive: false,
    roles: [userRole._id],
  });

  console.log("✅ Created 4 users\n");
  console.log("─────────────────────────────────────────");
  console.log("  Credentials:");
  console.log("  admin@example.com    / Admin@123    → all permissions");
  console.log("  manager@example.com  / Manager@123  → orders:read/write, reports:read");
  console.log("  user@example.com     / User@1234    → orders:read only");
  console.log("  disabled@example.com / Disabled@123 → isActive: false (login blocked)");
  console.log("─────────────────────────────────────────\n");
  console.log(" Seeding complete!");

  process.exit(0);
};

seed().catch((err) => {
  console.error(" Seed failed:", err.message);
  process.exit(1);
});