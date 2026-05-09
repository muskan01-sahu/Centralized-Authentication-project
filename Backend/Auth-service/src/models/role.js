const mongoose = require("mongoose");

/**
 * PDF Identity & Access Model — Role
 * {
 *   id: string
 *   name: string        // admin, manager, user
 *   description: string
 * }
 * PDF Relationship: Role <-> Permission (Many-to-Many)
 */
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // PDF examples: admin, manager, user
    },
    description: {
      type: String,
      trim: true,
    },
    // Many-to-Many: Role <-> Permission (PDF requirement)
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);