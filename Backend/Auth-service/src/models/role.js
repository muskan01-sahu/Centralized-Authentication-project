const mongoose = require("mongoose");

/**
 * Identity & Access Model — Role
 * {
 *   id: string
 *   name: string        // admin, manager, user
 *   description: string
 * }
 * 
 */
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // examples: admin, manager, user
    },
    description: {
      type: String,
      trim: true,
    },
    
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